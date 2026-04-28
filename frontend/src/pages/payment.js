// FrontEnd/eticketing-ui/src/pages/Payment.js

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Wallet, CheckCircle, AlertCircle, Clock, ArrowRight, Shield, QrCode, Receipt, MapPin, Phone, X, Plus } from 'lucide-react';
import ModernCard from "../components/ModernCard";
import { paymentAPI, authAPI } from '../services/api';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentReference, setPaymentReference] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [existingPaymentMethods, setExistingPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's existing payment methods on component mount
  useEffect(() => {
    const fetchUserPaymentMethods = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.id) {
          const response = await paymentAPI.getUserPaymentMethods(user.id);
          setExistingPaymentMethods(response.data?.data || []);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchUserPaymentMethods();
  }, []);

  // Validate phone number format
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+250|0)?[7-9]\d{8}$/;
    return phoneRegex.test(phone);
  };

  // Check if phone has existing payment methods
  const checkPhonePaymentMethods = async (phone) => {
    if (!validatePhoneNumber(phone)) {
      setPhoneError("Please enter a valid Rwandan phone number");
      return false;
    }

    try {
      setLoading(true);
      const response = await paymentAPI.checkPaymentMethod(phone);
      
      if (response.data?.hasPaymentMethods) {
        setShowPhoneModal(true);
        setPhoneError("");
        return true;
      } else {
        setPhoneError("No payment methods found for this phone number");
        return false;
      }
    } catch (error) {
      console.error('Error checking payment methods:', error);
      setPhoneError("Unable to verify phone number. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    navigate("/booking");
    return null;
  }

  const handleMobileMoneyPayment = async () => {
    // Check phone number first before proceeding
    if (!phoneNumber || phoneNumber.length < 10) {
      setPhoneError("Please enter a valid phone number first");
      return;
    }

    setPaymentStatus("processing");

    try {
      // Create payment for each booking
      const paymentPromises = bookingData.bookings.map(booking =>
        paymentAPI.initiatePayment({
          bookingId: booking.id,
          amount: Number(bookingData.totalAmount / bookingData.seats.length),
          phoneNumber: phoneNumber
        })
      );

      const paymentResults = await Promise.all(paymentPromises);

      // For demo purposes, simulate successful payment
      // In real app, you would redirect to PayPack or handle webhook
      setTimeout(() => {
        const reference = "TXN" + Date.now();
        setPaymentReference(reference);
        setPaymentStatus("success");

        // Navigate to ticket after 2 seconds
        setTimeout(() => {
          navigate("/ticket", {
            state: {
              ...bookingData,
              paymentReference: reference,
              paymentStatus: "paid"
            }
          });
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus("failed");
      alert(error.response?.data?.message || "Payment failed. Please try again.");
    }
  };

  const handleCardPayment = () => {
    // In real app, integrate Stripe or other payment gateway
    alert("Card payment integration - Redirect to secure payment page");
  };

  const handleCashPayment = () => {
    const reference = "CASH" + Date.now();
    navigate("/ticket", { 
      state: { 
        ...bookingData, 
        paymentReference: reference,
        paymentStatus: "pending_cash"
      } 
    });
  };

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ModernCard variant="gradient" className="max-w-md">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Transaction Reference:</p>
            <p className="text-xl font-mono font-bold text-gray-900 dark:text-white mb-6">{paymentReference}</p>
            <p className="text-gray-500 dark:text-gray-500">Redirecting to your ticket...</p>
          </ModernCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <CreditCard className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Complete Your Payment
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Secure payment processing for your booking
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ModernCard variant="gradient" className="sticky top-8">
              <div className="flex items-center mb-6">
                <Receipt className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Summary</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">Passenger</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{bookingData.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">Route</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{bookingData.route}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">Seats</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{bookingData.seats.join(", ")}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {bookingData.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {bookingData.totalAmount.toLocaleString()} RWF
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Secure Payment</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>
            </ModernCard>
          </motion.div>

          {/* Right Column - Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {bookingData.paymentMethod === "mobile_money" && (
              <ModernCard variant="elevated">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mobile Money Payment</h2>
                    <p className="text-gray-600 dark:text-gray-400">Pay with MTN MoMo or Airtel Money</p>
                  </div>
                </div>

                <ModernCard variant="glass" className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Instructions</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">Open your MTN MoMo or Airtel Money app</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">0</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">Enter your phone number to check existing payment methods</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="tel"
                        placeholder="+250 7XX XXX XXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => checkPhonePaymentMethods(phoneNumber)}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {phoneError && (
                      <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{phoneError}</span>
                      </div>
                    )}
                    {existingPaymentMethods.length > 0 && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <div>
                            <p className="text-sm font-semibold text-green-900 dark:text-green-100">Payment Methods Found</p>
                            <p className="text-xs text-green-700 dark:text-green-300">
                              Found {existingPaymentMethods.length} existing payment method(s)
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 space-y-2">
                          {existingPaymentMethods.map((method, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {method.type} - {method.provider}
                              </span>
                              <button
                                onClick={() => setShowPhoneModal(false)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                Use This Method
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">Pay to: <strong className="text-blue-600 dark:text-blue-400">Volcano Express</strong></p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">3</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">Merchant Code: <strong className="text-blue-600 dark:text-blue-400">789012</strong></p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">4</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">Amount: <strong className="text-blue-600 dark:text-blue-400">{bookingData.totalAmount.toLocaleString()} RWF</strong></p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">5</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">Reference: <strong className="text-blue-600 dark:text-blue-400">BUS{Date.now()}</strong></p>
                    </div>
                  </div>
                </ModernCard>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMobileMoneyPayment}
                  disabled={paymentStatus === "processing"}
                  className={`w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 transition-all ${
                    paymentStatus === "processing"
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                  }`}
                >
                  <span>{paymentStatus === "processing" ? "Processing..." : "I Have Paid"}</span>
                  {!paymentStatus === "processing" && <ArrowRight className="w-5 h-5" />}
                </motion.button>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Click after completing payment on your phone
                </p>
              </ModernCard>
            )}

            {bookingData.paymentMethod === "card" && (
              <ModernCard variant="elevated">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Card Payment</h2>
                    <p className="text-gray-600 dark:text-gray-400">Secure card payment processing</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCardPayment}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Pay {bookingData.totalAmount.toLocaleString()} RWF</span>
                  <CreditCard className="w-5 h-5" />
                </motion.button>

                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Test Mode</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        This is a demo. In production, this would integrate with a secure payment gateway.
                      </p>
                    </div>
                  </div>
                </div>
              </ModernCard>
            )}

            {bookingData.paymentMethod === "cash" && (
              <ModernCard variant="elevated">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cash Payment at Terminal</h2>
                    <p className="text-gray-600 dark:text-gray-400">Pay at the bus station</p>
                  </div>
                </div>

                <ModernCard variant="glass" className="mb-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Your booking is reserved!</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Please complete payment before departure to confirm your seats.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Terminal Location</p>
                        <p className="text-gray-900 dark:text-white">Kigali Main Bus Station, Gate 5</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Deadline</p>
                        <p className="text-gray-900 dark:text-white">30 minutes before departure</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Receipt className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Booking Reference</p>
                        <p className="text-gray-900 dark:text-white">Will be sent to your phone</p>
                      </div>
                    </div>
                  </div>
                </ModernCard>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCashPayment}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Confirm Cash Booking</span>
                  <CheckCircle className="w-5 h-5" />
                </motion.button>
              </ModernCard>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Payment;