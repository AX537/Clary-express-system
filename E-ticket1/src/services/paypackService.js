import axios from 'axios';

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
   * Get access token (cached for 45 minutes)
   */
  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiryTime && new Date() < this.tokenExpiryTime) {
      console.log('[PayPack] Using cached access token');
      return this.accessToken;
    }

    console.log('[PayPack] Requesting new access token');

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
        // Cache token for 45 minutes (tokens expire in 1 hour, 45 min for safety)
        this.tokenExpiryTime = new Date(Date.now() + 45 * 60 * 1000);
        console.log('[PayPack] Access token obtained and cached for 45 minutes');
        return this.accessToken;
      }

      throw new Error('Failed to obtain access token from PayPack');
    } catch (error) {
      console.error('[PayPack] Auth Error:', error.response?.data || error.message);
      throw new Error(
        'Failed to authenticate with PayPack: ' +
          (error.response?.data?.message || error.message)
      );
    }
  }

  /**
   * Clear cached token (forces re-authentication on next call)
   */
  clearTokenCache() {
    this.accessToken = null;
    this.tokenExpiryTime = null;
  }

  /**
   * Initiate cashin — sends a payment request to the user's mobile money account
   * @param {string} phoneNumber - Mobile money phone number (e.g. 0788123456)
   * @param {number} amount - Amount in RWF
   * @returns {Promise<{ ref: string, status: string }>}
   */
  async initiateCashin(phoneNumber, amount) {
    const makeRequest = async (token) => {
      return axios.post(
        `${this.baseUrl}/transactions/cashin`,
        {
          amount: Number(amount),
          number: phoneNumber
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
    };

    try {
      const token = await this.getAccessToken();
      const response = await makeRequest(token);
      console.log('[PayPack] Cashin initiated. Ref:', response.data.ref);
      return response.data;
    } catch (error) {
      // If token expired, clear cache and retry once
      const isTokenExpired =
        error.response?.status === 401 ||
        error.response?.data?.message?.toLowerCase().includes('token is expired');

      if (isTokenExpired) {
        console.log('[PayPack] Token expired — clearing cache and retrying...');
        this.clearTokenCache();

        try {
          const freshToken = await this.getAccessToken();
          const response = await makeRequest(freshToken);
          console.log('[PayPack] Cashin initiated after token refresh. Ref:', response.data.ref);
          return response.data;
        } catch (retryError) {
          console.error(
            '[PayPack] Cashin retry failed:',
            retryError.response?.data || retryError.message
          );
          throw new Error(
            'Failed to initiate PayPack payment: ' +
              (retryError.response?.data?.message || retryError.message)
          );
        }
      }

      console.error('[PayPack] Cashin Error:', error.response?.data || error.message);
      throw new Error(
        'Failed to initiate PayPack payment: ' +
          (error.response?.data?.message || error.message)
      );
    }
  }

  /**
   * Check the status of a transaction using the events API
   * @param {string} transactionRef - The ref returned by initiateCashin
   * @returns {Promise<{ status: 'pending'|'successful'|'failed', eventKind: string|null, data: object|null }>}
   */
  async checkPaymentStatus(transactionRef) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseUrl}/events/transactions?ref=${transactionRef}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          timeout: 10000 // 10 second timeout
        }
      );

      console.log(
        `[PayPack] Status check for ${transactionRef}:`,
        JSON.stringify(response.data, null, 2)
      );

      if (
        response.data &&
        response.data.transactions &&
        response.data.transactions.length > 0
      ) {
        // Most recent event is first in the list
        const latestEvent = response.data.transactions[0];
        const eventKind = latestEvent.event_kind;

        console.log(`[PayPack] ${transactionRef}: event_kind=${eventKind}`);

        if (eventKind === 'transaction:processed') {
          const data = latestEvent.data;
          const status = data.status; // 'successful' or 'failed'

          console.log(`[PayPack] ${transactionRef}: PROCESSED — status=${status}`);

          return { status, eventKind, data };
        }

        // Transaction initiated but not yet processed
        console.log(`[PayPack] ${transactionRef}: Still pending (event=${eventKind})`);
        return { status: 'pending', eventKind, data: latestEvent.data };
      }

      // No events yet — payment was just initiated
      console.log(`[PayPack] ${transactionRef}: No events yet (just initiated)`);
      return { status: 'pending', eventKind: null, data: null };
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error(`[PayPack] Status check timed out for ${transactionRef}`);
      } else if (error.response?.status === 401) {
        console.error(`[PayPack] Auth failed on status check — clearing token cache`);
        this.clearTokenCache();
      } else {
        console.error(
          `[PayPack] Status check error for ${transactionRef}:`,
          error.response?.data || error.message
        );
      }

      throw new Error(
        'Failed to check PayPack payment status: ' +
          (error.response?.data?.message || error.message)
      );
    }
  }
}

// Export a singleton so the token cache is shared across all uses
export default new PaypackService();
