// FrontEnd/eticketing-ui/src/pages/Booking.js

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bus, User, Phone, Mail, CreditCard, Smartphone, Wallet, ArrowRight, Shield, Clock, Users, MapPin } from 'lucide-react';
import SeatSelector from "../components/SeatSelector";
import ModernCard from "../components/ModernCard";
import { busAPI, routeAPI, bookingAPI } from '../services/api';

function Booking() {
  const [seats, setSeats] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [availableBuses, setAvailableBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch available buses
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        // Fetch all buses without filters for the booking page
        const response = await busAPI.searchBuses('', '', '');
        setAvailableBuses(response.data?.buses || response.data?.data || []);
      } catch (error) {
        console.error('Error fetching buses:', error);
        setAvailableBuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  // Get bus data from location state or set default
  useEffect(() => {
    if (location.state?.selectedBus) {
      setSelectedBus(location.state.selectedBus);
    } else if (availableBuses.length > 0) {
      setSelectedBus(availableBuses[0]);
    }
  }, [location.state, availableBuses]);

  const totalAmount = selectedBus ? seats.length * selectedBus.price : seats.length * 3500;

  const handleBooking = async () => {
    // Validate required fields
    if (!name || !phone || seats.length === 0 || !paymentMethod || !selectedBus) {
      alert("Please fill all fields, select seats, and choose a bus");
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(\+250|0)?[7-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid Rwandan phone number");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsProcessing(true);

    try {
      // Get current user ID from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Check if user is logged in
      if (!user.id) {
        alert("Please log in to make a booking");
        navigate("/login");
        return;
      }

      // Validate bus data
      if (!selectedBus.id) {
        alert("Invalid bus selected. Please select a bus again.");
        return;
      }

      console.log('Creating booking with data:', {
        passenger_id: user.id,
        bus_id: selectedBus.id,
        seats: seats,
        user: user
      });

      // Create booking for each selected seat
      const bookingPromises = seats.map(seatNumber => {
        console.log('Creating booking for seat:', seatNumber);
        return bookingAPI.createBooking({
          busId: selectedBus.id,
          seatNumber: seatNumber
        });
      });

      const bookingResults = await Promise.allSettled(bookingPromises);
      
      // Check if any bookings failed
      const failedBookings = bookingResults.filter(result => result.status === 'rejected');
      if (failedBookings.length > 0) {
        console.error('Some bookings failed:', failedBookings);
        alert(`Failed to book ${failedBookings.length} seat(s). Please try again.`);
        return;
      }

      // Extract successful booking data
      const successfulBookings = bookingResults
        .filter(result => result.status === 'fulfilled')
        .map(result => {
          // Handle different API response structures
          const bookingData = result.value.data;
          return bookingData.data || bookingData || result.value;
        });

      console.log('Successful bookings:', successfulBookings);

      // Navigate to payment page with booking details
      const origin = selectedBus.Route?.origin || 'Unknown';
      const destination = selectedBus.Route?.destination || 'Unknown';
      const price = selectedBus.Route?.price || 3500;
      const bookingData = {
        name,
        phone,
        email,
        seats,
        bus: selectedBus,
        route: `${origin} to ${destination}`,
        totalAmount: seats.length * parseFloat(price),
        paymentMethod,
        bookings: successfulBookings
      };

      console.log('Navigating to payment with data:', bookingData);
      navigate("/payment", { state: bookingData });
    } catch (error) {
      console.error('Booking error:', error);
      
      // Handle different types of errors
      if (error.code === 'NETWORK_ERROR') {
        alert("Network error. Please check your internet connection and try again.");
      } else if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else if (error.response?.status === 409) {
        alert("One or more seats are already booked. Please select different seats.");
      } else if (error.response?.status === 400) {
        alert(error.response.data?.message || "Invalid booking data. Please check your information.");
      } else {
        alert(error.response?.data?.message || "Booking failed. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-6 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/10 to-blue-300/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <img 
                src="/logo.png" 
                alt="Clary Express Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Complete Your Booking
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Secure your seats for a comfortable journey
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Seat Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <ModernCard variant="elevated" className="mb-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Your Seats</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred seats</p>
                </div>
              </div>
              <SeatSelector selectedSeats={seats} setSelectedSeats={setSeats} selectedBus={selectedBus} />
            </ModernCard>

            {/* Passenger Information */}
            <ModernCard variant="elevated" className="mb-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Passenger Information</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enter your details</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="0788XXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </ModernCard>

            {/* Payment Method */}
            <ModernCard variant="elevated">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
                  <p className="text-gray-600 dark:text-gray-400">Choose how to pay</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="mobile_money"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Smartphone className="w-8 h-8 text-green-600 ml-4 mr-3" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Mobile Money</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">MTN MoMo / Airtel Money</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <CreditCard className="w-8 h-8 text-blue-600 ml-4 mr-3" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Credit/Debit Card</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Visa, Mastercard</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Wallet className="w-8 h-8 text-purple-600 ml-4 mr-3" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Cash at Terminal</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pay at the bus station</p>
                  </div>
                </label>
              </div>
            </ModernCard>
          </motion.div>

          {/* Right Column - Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ModernCard variant="gradient" className="sticky top-8">
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">Route</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Kigali to Musanze</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">Bus</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Clary Express</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">Selected Seats</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {seats.length > 0 ? seats.join(", ") : "None"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-400">Price per seat</span>
                  <span className="font-semibold text-gray-900 dark:text-white">3,500 RWF</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totalAmount.toLocaleString()} RWF
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                disabled={isProcessing || seats.length === 0 || !paymentMethod}
                className={`w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 transition-all ${
                  (isProcessing || seats.length === 0 || !paymentMethod)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                <span>{isProcessing ? 'Processing...' : 'Proceed to Payment'}</span>
                {!isProcessing && <ArrowRight className="w-5 h-5" />}
              </motion.button>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Booking Confirmation</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      You'll receive a confirmation email with your ticket details after payment.
                    </p>
                  </div>
                </div>
              </div>
            </ModernCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Booking;