import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard, Smartphone, Wallet, CheckCircle, AlertCircle,
  Clock, ArrowRight, Shield, Receipt, Phone, Loader
} from 'lucide-react';
import ModernCard from "../components/ModernCard";
import { paymentAPI } from '../services/api';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [step, setStep] = useState('form'); // 'form' | 'pending' | 'success' | 'failed'
  const [phoneNumber, setPhoneNumber] = useState(bookingData?.phone || '');
  const [phoneError, setPhoneError] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const [paypackRef, setPaypackRef] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [pollCount, setPollCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Waiting for payment approval...');

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingData) navigate('/booking');
  }, [bookingData, navigate]);

  // Poll PayPack for payment status every 5 seconds
  useEffect(() => {
    if (step !== 'pending' || !paymentId) return;

    const interval = setInterval(async () => {
      try {
        setPollCount(c => c + 1);
        setStatusMessage('Checking payment status...');

        const response = await paymentAPI.checkPaymentStatus(paymentId);
        const payment = response.data?.data?.payment;
        const status = payment?.status;

        if (status === 'completed') {
          clearInterval(interval);
          setQrCode(response.data?.data?.qrCode);
          setStep('success');
        } else if (status === 'failed') {
          clearInterval(interval);
          setStep('failed');
        } else {
          setStatusMessage('Waiting for you to approve the payment on your phone...');
        }
      } catch (error) {
        console.error('Status check error:', error);
        setStatusMessage('Checking payment status...');
      }
    }, 5000);

    // Stop polling after 5 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (step === 'pending') {
        setStep('failed');
      }
    }, 300000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [step, paymentId]);

  if (!bookingData) return null;

  const validatePhone = (phone) => {
    const clean = phone.replace(/\s/g, '');
    return /^(\+250|0)?[7-9]\d{8}$/.test(clean);
  };

  const formatPhone = (phone) => {
    // Normalize to 07XXXXXXXX format for PayPack
    const clean = phone.replace(/\s/g, '').replace('+250', '0');
    if (clean.startsWith('250')) return '0' + clean.slice(3);
    return clean;
  };

  const handleMobileMoneyPayment = async () => {
    if (!validatePhone(phoneNumber)) {
      setPhoneError('Please enter a valid Rwandan phone number (e.g. 0788123456)');
      return;
    }
    setPhoneError('');

    try {
      setStep('pending');
      setStatusMessage('Sending payment request to your phone...');

      const formattedPhone = formatPhone(phoneNumber);
      const pricePerSeat = bookingData.pricePerSeat || bookingData.totalAmount / bookingData.seats.length;

      // Initiate payment for the first booking (one payment covers all seats)
      const firstBooking = bookingData.bookings[0];
      const response = await paymentAPI.initiatePayment(
        firstBooking.id || firstBooking.booking?.id,
        formattedPhone,
        bookingData.totalAmount
      );

      const payment = response.data?.data?.payment;
      setPaymentId(payment?.id);
      setPaypackRef(payment?.paypackRef);
      setStatusMessage('Payment request sent! Check your phone and enter your PIN.');

    } catch (error) {
      console.error('Payment initiation error:', error);
      setStep('form');
      setPhoneError(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
    }
  };

  const handleCashPayment = () => {
    navigate('/ticket', {
      state: {
        ...bookingData,
        paymentReference: 'CASH' + Date.now(),
        paymentStatus: 'pending_cash'
      }
    });
  };

  const handleGoToTicket = () => {
    navigate('/ticket', {
      state: {
        ...bookingData,
        paymentReference: paypackRef,
        paymentStatus: 'paid',
        qrCode
      }
    });
  };

  // ---- SUCCESS SCREEN ----
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <ModernCard>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">Your booking is confirmed. Show your QR code at boarding.</p>
              {qrCode && (
                <div className="mb-6">
                  <img src={qrCode} alt="Boarding QR Code" className="mx-auto w-48 h-48 border-2 border-gray-200 rounded-lg" />
                  <p className="text-xs text-gray-500 mt-2">Scan this QR code at the boarding gate</p>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleGoToTicket}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-2"
              >
                <span>View My Ticket</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </ModernCard>
        </motion.div>
      </div>
    );
  }

  // ---- FAILED SCREEN ----
  if (step === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <ModernCard>
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">The payment was not completed. You can try again.</p>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setStep('form'); setPhoneError(''); }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg"
              >
                Try Again
              </motion.button>
            </div>
          </ModernCard>
        </motion.div>
      </div>
    );
  }

  // ---- PENDING SCREEN ----
  if (step === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <ModernCard>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader className="w-10 h-10 text-blue-600" />
                </motion.div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Awaiting Payment</h1>
              <p className="text-gray-600 mb-2">{statusMessage}</p>
              <p className="text-sm text-gray-500 mb-6">Phone: <strong>{phoneNumber}</strong></p>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left space-y-2">
                <p className="text-sm font-semibold text-blue-900">What to do:</p>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                  <p className="text-sm text-blue-800">Check your phone for a payment prompt from MTN MoMo or Airtel Money</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                  <p className="text-sm text-blue-800">Enter your PIN to approve the payment of <strong>{bookingData.totalAmount?.toLocaleString()} RWF</strong></p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                  <p className="text-sm text-blue-800">This page will automatically update once payment is confirmed</p>
                </div>
              </div>

              <p className="text-xs text-gray-400">Checking status every 5 seconds... (attempt {pollCount})</p>

              <button
                onClick={() => setStep('form')}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Cancel and go back
              </button>
            </div>
          </ModernCard>
        </motion.div>
      </div>
    );
  }

  // ---- PAYMENT FORM ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Complete Your Payment</h1>
          <p className="text-gray-600">Secure payment processing for your booking</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Payment Summary */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <ModernCard className="sticky top-8">
              <div className="flex items-center mb-4">
                <Receipt className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-900">Payment Summary</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Passenger',   value: bookingData.name },
                  { label: 'Route',       value: bookingData.route },
                  { label: 'Seats',       value: bookingData.seats?.join(', ') },
                  { label: 'Price/seat',  value: `${(bookingData.pricePerSeat || 0).toLocaleString()} RWF` },
                  { label: 'Method',      value: bookingData.paymentMethod?.replace('_', ' ') },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="font-medium text-gray-900 text-sm capitalize">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">{bookingData.totalAmount?.toLocaleString()} RWF</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-700">Your payment is encrypted and secure.</p>
              </div>
            </ModernCard>
          </motion.div>

          {/* Payment Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">

            {/* Mobile Money */}
            {bookingData.paymentMethod === 'mobile_money' && (
              <ModernCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Mobile Money Payment</h2>
                    <p className="text-gray-500 text-sm">MTN MoMo or Airtel Money — powered by PayPack</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Mobile Money Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="0788123456"
                      value={phoneNumber}
                      onChange={(e) => { setPhoneNumber(e.target.value); setPhoneError(''); }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                  </div>
                  {phoneError && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{phoneError}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">You will receive a USSD prompt to enter your PIN</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">How it works:</p>
                  <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                    <li>Enter your phone number and click Pay</li>
                    <li>You'll receive a USSD push notification on your phone</li>
                    <li>Enter your MoMo/Airtel PIN to approve</li>
                    <li>Your ticket will be generated automatically</li>
                  </ol>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleMobileMoneyPayment}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2 text-lg"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Pay {bookingData.totalAmount?.toLocaleString()} RWF via MoMo</span>
                </motion.button>
              </ModernCard>
            )}

            {/* Cash */}
            {bookingData.paymentMethod === 'cash' && (
              <ModernCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Cash Payment at Terminal</h2>
                    <p className="text-gray-500 text-sm">Pay at the bus station before departure</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 mb-6 space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Your seats are reserved!</p>
                      <p className="text-sm text-green-700">Complete payment at the terminal before departure.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Pay at least 30 minutes before departure</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleCashPayment}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Confirm Cash Booking</span>
                </motion.button>
              </ModernCard>
            )}

            {/* Card */}
            {bookingData.paymentMethod === 'card' && (
              <ModernCard>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Card Payment</h2>
                    <p className="text-gray-500 text-sm">Coming soon</p>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">Card payment is not yet available. Please go back and select Mobile Money or Cash.</p>
                  </div>
                </div>
                <button onClick={() => navigate(-1)} className="mt-4 w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Go Back
                </button>
              </ModernCard>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
