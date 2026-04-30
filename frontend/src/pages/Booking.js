import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bus, User, Phone, Mail, CreditCard, Smartphone, Wallet, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import SeatSelector from "../components/SeatSelector";
import ModernCard from "../components/ModernCard";
import { bookingAPI } from '../services/api';

function Booking() {
  const [seats, setSeats] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get bus data from navigation state (passed from BusCard)
  useEffect(() => {
    if (location.state?.selectedBus) {
      setSelectedBus(location.state.selectedBus);
    }
  }, [location.state]);

  // Get price from route data — Fixed: was hardcoded 3500
  const pricePerSeat = Number(
    selectedBus?.route?.price ||
    selectedBus?.Route?.price ||
    location.state?.price ||
    5000
  );

  // Fixed: total now correctly uses pricePerSeat
  const totalAmount = seats.length * pricePerSeat;

  // Get route info
  const routeFrom = selectedBus?.route?.origin || selectedBus?.Route?.origin || location.state?.from || 'N/A';
  const routeTo   = selectedBus?.route?.destination || selectedBus?.Route?.destination || location.state?.to || 'N/A';
  const busName   = selectedBus?.company?.name || selectedBus?.plateNumber || selectedBus?.plate_number || 'N/A';

  const handleBooking = async () => {
    if (!name || !phone || seats.length === 0 || !paymentMethod || !selectedBus) {
      alert("Please fill all fields, select seats, and choose a payment method");
      return;
    }

    const phoneRegex = /^(\+250|0)?[7-9]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid Rwandan phone number (e.g. 0788123456)");
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
      }
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert("Please log in to make a booking");
      navigate("/login");
      return;
    }

    if (!selectedBus.id) {
      alert("Invalid bus selected. Please go back and select a bus.");
      return;
    }

    setIsProcessing(true);

    try {
      // Create booking for each selected seat
      const bookingPromises = seats.map(seatNumber =>
        bookingAPI.createBooking({ busId: selectedBus.id, seatNumber })
      );

      const bookingResults = await Promise.allSettled(bookingPromises);

      const failedBookings = bookingResults.filter(r => r.status === 'rejected');
      if (failedBookings.length > 0) {
        const errorMsg = failedBookings[0].reason?.response?.data?.message || 'Some seats could not be booked';
        alert(`Booking failed: ${errorMsg}`);
        return;
      }

      const successfulBookings = bookingResults
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value.data?.data?.booking || r.value.data?.data || r.value.data);

      navigate("/payment", {
        state: {
          name,
          phone,
          email,
          seats,
          bus: selectedBus,
          route: `${routeFrom} to ${routeTo}`,
          pricePerSeat,
          totalAmount,
          paymentMethod,
          bookings: successfulBookings
        }
      });
    } catch (error) {
      console.error('Booking error:', error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else if (error.response?.status === 409) {
        alert("One or more seats are already booked. Please select different seats.");
      } else {
        alert(error.response?.data?.message || "Booking failed. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedBus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="text-center">
          <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No bus selected</h2>
          <p className="text-gray-500 mb-4">Please search for a bus first</p>
          <button onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Complete Your Booking</h1>
          <p className="text-gray-600">Secure your seats for a comfortable journey</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left - Seat Selection + Passenger Info + Payment */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-4">

            {/* Seat Selector */}
            <ModernCard variant="elevated">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Select Your Seats</h2>
                  <p className="text-sm text-gray-500">Choose your preferred seats</p>
                </div>
              </div>
              <SeatSelector selectedSeats={seats} setSelectedSeats={setSeats} selectedBus={selectedBus} />
            </ModernCard>

            {/* Passenger Info */}
            <ModernCard variant="elevated">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Passenger Information</h2>
                  <p className="text-sm text-gray-500">Enter your details</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Enter your full name" value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input type="tel" placeholder="0788XXXXXX" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input type="email" placeholder="your@email.com" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            </ModernCard>

            {/* Payment Method */}
            <ModernCard variant="elevated">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                  <p className="text-sm text-gray-500">Choose how to pay</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'mobile_money', label: 'Mobile Money', sub: 'MTN MoMo / Airtel Money', icon: Smartphone, color: 'text-green-600' },
                  { value: 'card',         label: 'Credit/Debit Card', sub: 'Visa, Mastercard',   icon: CreditCard, color: 'text-blue-600'  },
                  { value: 'cash',         label: 'Cash at Terminal',  sub: 'Pay at the bus station', icon: Wallet, color: 'text-purple-600' },
                ].map(opt => (
                  <label key={opt.value} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <input type="radio" name="payment" value={opt.value} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-blue-600" />
                    <opt.icon className={`w-7 h-7 ${opt.color} ml-4 mr-3`} />
                    <div>
                      <p className="font-semibold text-gray-900">{opt.label}</p>
                      <p className="text-sm text-gray-500">{opt.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </ModernCard>
          </motion.div>

          {/* Right - Booking Summary */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <ModernCard variant="gradient" className="sticky top-8">
              <div className="flex items-center mb-5">
                <Shield className="w-7 h-7 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Booking Summary</h2>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { label: 'Route',          value: `${routeFrom} to ${routeTo}` },
                  { label: 'Bus',            value: busName },
                  { label: 'Selected Seats', value: seats.length > 0 ? seats.join(', ') : 'None' },
                  { label: 'Price per seat', value: `${pricePerSeat.toLocaleString()} RWF` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 text-sm">{item.label}</span>
                    <span className="font-semibold text-gray-900 text-sm">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">{totalAmount.toLocaleString()} RWF</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                disabled={isProcessing || seats.length === 0 || !paymentMethod}
                className={`w-full py-3.5 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 transition-all ${
                  isProcessing || seats.length === 0 || !paymentMethod
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                <span>{isProcessing ? 'Processing...' : 'Proceed to Payment'}</span>
                {!isProcessing && <ArrowRight className="w-5 h-5" />}
              </motion.button>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-700">You'll receive a confirmation email with your ticket details after payment.</p>
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
