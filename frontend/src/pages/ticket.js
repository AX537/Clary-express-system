// FrontEnd/eticketing-ui/src/pages/Ticket.js

import React from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Bus, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  QrCode, 
  Download, 
  Share2, 
  ArrowLeft,
  Shield,
  Star,
  AlertCircle
} from 'lucide-react';
import ModernCard from "../components/ModernCard";

function Ticket() {
  const location = useLocation();
  const ticketData = location.state;

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <ModernCard variant="gradient" className="max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Ticket Data Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please make a booking first to generate your ticket.</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </ModernCard>
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Your E-Ticket</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Volcano Express - Your Journey Starts Here</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Ticket */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <ModernCard variant="elevated" className="overflow-hidden">
              {/* Ticket Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Volcano Express</h2>
                    <p className="text-blue-100">Electronic Ticket</p>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      <Bus className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Body */}
              <div className="p-8">
                {/* Passenger Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Passenger Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Name</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{ticketData.name}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{ticketData.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Journey Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Journey Details
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Route</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{ticketData.route}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{ticketData.date}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Seats</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{ticketData.seats?.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    Payment Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount Paid</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{ticketData.totalAmount?.toLocaleString()} RWF</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reference</p>
                        <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                          {ticketData.paymentReference || "CASH-" + Date.now()}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Status</p>
                      <div className="flex items-center">
                        {ticketData.paymentStatus === "paid" ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <span className="font-semibold text-green-600 dark:text-green-400">Paid</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                            <span className="font-semibold text-yellow-600 dark:text-yellow-400">Pending Cash</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="text-center">
                  <ModernCard variant="glass" className="mb-6">
                    <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">QR Code</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Show this ticket to the driver</p>
                  </ModernCard>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Ticket
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Share Ticket
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Ticket Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 px-8 py-4 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Thank you for choosing Volcano Express! Safe travels! 
                </p>
              </div>
            </ModernCard>
          </motion.div>

          {/* Right Column - Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ModernCard variant="gradient" className="mb-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Important Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">Please arrive 30 minutes before departure</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">Present this ticket (digital or printed) to board</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">Keep your ID ready for verification</p>
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="elevated" className="mb-6">
              <div className="flex items-center mb-4">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rate Your Experience</h3>
              </div>
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-white transition-colors"
                  >
                    <Star className="w-5 h-5" />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Help us improve our service
              </p>
            </ModernCard>

            <Link
              to="/"
              className="block w-full"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
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