const axios = require('axios');

class PaypackService {
  constructor() {
    this.baseUrl = process.env.PAYPACK_BASE_URL || 'https://payments.paypack.rw/api';
    this.clientId = process.env.PAYPACK_CLIENT_ID;
    this.clientSecret = process.env.PAYPACK_CLIENT_SECRET;
    
    // Token caching
    this.accessToken = null;
    this.tokenExpiryTime = null;
  }

  /**
   * Get access token (cached for 50 minutes)
   */
  async getAccessToken() {
    // Return cached token if still valid (with 5 minute buffer)
    if (this.accessToken && this.tokenExpiryTime && new Date() < this.tokenExpiryTime) {
      console.log('Using cached PayPack access token');
      return this.accessToken;
    }

    // Get new token
    console.log('Requesting new PayPack access token');
    
    try {
      const webhookMode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
      
      const response = await axios.post(
        `${this.baseUrl}/auth/agents/authorize`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Mode': webhookMode
          }
        }
      );

      if (response.data && response.data.access) {
        this.accessToken = response.data.access;
        // Cache token for 45 minutes (tokens expire in 1 hour, use 45 min for safety)
        this.tokenExpiryTime = new Date(Date.now() + 45 * 60 * 1000);
        console.log('Successfully obtained PayPack access token (cached for 45 minutes)');
        return this.accessToken;
      }

      throw new Error('Failed to obtain access token from PayPack');
    } catch (error) {
      console.error('PayPack Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with PayPack: ' + (error.response?.data?.message || error.message));
    }
  }

  /**
   * Initiate cashin (payment request to user's phone)
   */
  async initiateCashin(phoneNumber, amount) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseUrl}/transactions/cashin`,
        {
          amount: amount,
          number: phoneNumber
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Cashin initiated successfully. Ref:', response.data.ref);
      return response.data;
    } catch (error) {
      // If token expired, clear cache and retry once
      if (error.response?.data?.message?.includes('token is expired') || error.response?.status === 401) {
        console.log('Token expired, clearing cache and retrying...');
        this.accessToken = null;
        this.tokenExpiryTime = null;
        
        // Retry with fresh token
        const token = await this.getAccessToken();
        
        try {
          const response = await axios.post(
            `${this.baseUrl}/transactions/cashin`,
            {
              amount: amount,
              number: phoneNumber
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }
          );

          console.log('Cashin initiated successfully (after retry). Ref:', response.data.ref);
          return response.data;
        } catch (retryError) {
          console.error('PayPack Cashin Error (retry failed):', retryError.response?.data || retryError.message);
          throw new Error('Failed to initiate payment with PayPack: ' + (retryError.response?.data?.message || retryError.message));
        }
      }
      
      console.error('PayPack Cashin Error:', error.response?.data || error.message);
      throw new Error('Failed to initiate payment with PayPack: ' + (error.response?.data?.message || error.message));
    }
  }

  /**
   * Check payment status using events API
   */
  async checkPaymentStatus(transactionRef) {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get(
        `${this.baseUrl}/events/transactions?ref=${transactionRef}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000 // 10 second timeout
        }
      );

      console.log(`[PayPack Status Check] Full response for ${transactionRef}:`, JSON.stringify(response.data, null, 2));

      if (response.data && response.data.transactions && response.data.transactions.length > 0) {
        // Get the most recent event (first in list)
        const latestEvent = response.data.transactions[0];
        const eventKind = latestEvent.event_kind;
        
        console.log(`[PayPack Status Check] ${transactionRef}: event_kind=${eventKind}`);
        
        // Check if transaction is processed
        if (eventKind === 'transaction:processed') {
          const data = latestEvent.data;
          const status = data.status;
          
          console.log(`[PayPack Status Check] ${transactionRef}: PROCESSED, status=${status}`);
          
          return {
            status: status, // 'successful' or 'failed'
            eventKind: eventKind,
            data: data
          };
        } else {
          // Transaction not yet processed - still pending
          console.log(`[PayPack Status Check] ${transactionRef}: Still pending, event=${eventKind}`);
          return {
            status: 'pending',
            eventKind: eventKind,
            data: latestEvent.data
          };
        }
      } else {
        // No events found yet - payment just initiated
        console.log(`[PayPack Status Check] ${transactionRef}: No events yet (just initiated)`);
        return {
          status: 'pending',
          eventKind: null,
          data: null
        };
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error(`[PayPack Status Check] Timeout for ${transactionRef}`);
      } else if (error.response?.status === 401) {
        console.error(`[PayPack Status Check] Auth failed for ${transactionRef}, clearing token cache`);
        this.accessToken = null;
        this.tokenExpiryTime = null;
      } else {
        console.error(`[PayPack Status Check] Error for ${transactionRef}:`, error.response?.data || error.message);
      }
      throw new Error('Failed to check payment status: ' + (error.response?.data?.message || error.message));
    }
  }

}

// Export singleton instance
module.exports = new PaypackService();
