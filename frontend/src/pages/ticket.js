import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bus, User, Phone, MapPin, CreditCard, CheckCircle,
  Clock, Download, Share2, ArrowLeft, Shield, Star, AlertCircle
} from 'lucide-react';
import ModernCard from "../components/ModernCard";

function Ticket() {
  const location = useLocation();
  const ticketData = location.state;
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Ticket Found</h2>
          <p className="text-gray-600 mb-6">Please complete a booking to generate your ticket.</p>
          <Link to="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = ticketData.paymentStatus === 'paid';
  const busName = ticketData.bus?.company?.name || ticketData.bus?.plateNumber || 'Clary Express';
  const plateNumber = ticketData.bus?.plateNumber || ticketData.bus?.plate_number || 'N/A';
  const departureDate = ticketData.bus?.departureDate || ticketData.bus?.departure_date || 'N/A';
  const departureTime = ticketData.bus?.departureTime || ticketData.bus?.departure_time || 'N/A';

  const handleDownload = () => {
    if (ticketData.qrCode) {
      const link = document.createElement('a');
      link.download = `clary-express-ticket-${ticketData.paymentReference}.png`;
      link.href = ticketData.qrCode;
      link.click();
    } else {
      window.print();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Clary Express Ticket',
          text: `My bus ticket: ${ticketData.route} on ${departureDate}. Seats: ${ticketData.seats?.join(', ')}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ticket link copied to clipboard!');
    }
  };

  const handleRating = (stars) => {
    setRating(stars);
    setTimeout(() => setRatingSubmitted(true), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <Bus className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">Your E-Ticket</h1>
              <p className="text-gray-500">Clary Express — Safe Travels!</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Main Ticket */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

              {/* Ticket Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Clary Express</h2>
                    <p className="text-blue-100 text-sm">Electronic Boarding Pass</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-semibold text-sm ${isPaid ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {isPaid ? '✓ CONFIRMED' : '⏳ PENDING CASH'}
                  </div>
                </div>
              </div>

              {/* Dashed separator */}
              <div className="border-t-2 border-dashed border-gray-200 mx-6"></div>

              <div className="p-6 space-y-6">

                {/* Passenger Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                    <User className="w-4 h-4 mr-1" /> Passenger
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Name</p>
                      <p className="font-semibold text-gray-900">{ticketData.name}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">{ticketData.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Journey Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" /> Journey
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Route</p>
                      <p className="font-bold text-gray-900 text-lg">{ticketData.route}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Bus</p>
                      <p className="font-semibold text-gray-900">{busName}</p>
                      <p className="text-xs text-gray-400">{plateNumber}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Seats</p>
                      <p className="font-bold text-gray-900 text-lg">{ticketData.seats?.join(', ')}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="font-semibold text-gray-900">{departureDate}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Departure Time</p>
                      <p className="font-semibold text-gray-900">{departureTime}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                    <CreditCard className="w-4 h-4 mr-1" /> Payment
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                      <p className="font-bold text-blue-600 text-lg">{ticketData.totalAmount?.toLocaleString()} RWF</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <div className="flex items-center">
                        {isPaid
                          ? <><CheckCircle className="w-4 h-4 text-green-600 mr-1" /><span className="font-semibold text-green-600">Paid</span></>
                          : <><Clock className="w-4 h-4 text-yellow-600 mr-1" /><span className="font-semibold text-yellow-600">Pending</span></>
                        }
                      </div>
                    </div>
                    {ticketData.paymentReference && (
                      <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Reference</p>
                        <p className="font-mono text-sm font-semibold text-gray-900">{ticketData.paymentReference}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code */}
                <div className="text-center border-t border-dashed border-gray-200 pt-6">
                  {ticketData.qrCode ? (
                    <div>
                      <img
                        src={ticketData.qrCode}
                        alt="Boarding QR Code"
                        className="mx-auto w-48 h-48 border-2 border-gray-200 rounded-xl mb-3"
                      />
                      <p className="text-sm font-semibold text-gray-700">Scan at boarding gate</p>
                      <p className="text-xs text-gray-400 mt-1">Show this QR code to the driver</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-yellow-800">QR code will be generated after payment</p>
                      <p className="text-xs text-yellow-600 mt-1">Pay at the terminal to confirm your booking</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{ticketData.qrCode ? 'Download QR' : 'Print Ticket'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </motion.button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 text-center">
                <p className="text-xs text-gray-500">Thank you for choosing Clary Express! Safe travels! 🚌</p>
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">

            {/* Important Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Important</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'Arrive 15 minutes before departure',
                  'Show QR code to driver when boarding',
                  'Keep your ID ready for verification',
                  'Screenshot QR code in case of poor internet',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center mb-3">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                <h3 className="font-semibold text-gray-900">Rate Us</h3>
              </div>
              {ratingSubmitted ? (
                <div className="text-center py-2">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Thanks for rating us {rating} ⭐</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button
                        key={i}
                        onClick={() => handleRating(i)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          i <= rating ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400 hover:bg-yellow-100'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={i <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center">Help us improve our service</p>
                </>
              )}
            </div>

            {/* Back Button */}
            <Link to="/" className="block">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;
