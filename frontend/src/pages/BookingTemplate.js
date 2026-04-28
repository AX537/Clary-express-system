import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, DollarSign, Wifi, Wind, Zap, ArrowRight, Check, X } from 'lucide-react';
import { 
  ModernButton, 
  ModernCard, 
  Badge, 
  animations,
  Container,
  Alert
} from '../components/DesignSystem';

/**
 * MODERN BOOKING PAGE
 * This is a template showing best practices for modernizing pages
 */

function BookingPageTemplate() {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // Sample trip data
  const trips = [
    {
      id: 1,
      busName: 'Volcano Express',
      departure: '08:00 AM',
      arrival: '10:30 AM',
      duration: '2h 30m',
      price: 10000,
      availableSeats: 12,
      rating: 4.8,
      features: ['WiFi', 'AC', 'Charging Port'],
      image: '🚌'
    },
    {
      id: 2,
      busName: 'RITCO Premium',
      departure: '10:00 AM',
      arrival: '12:45 PM',
      duration: '2h 45m',
      price: 12000,
      availableSeats: 8,
      rating: 4.6,
      features: ['WiFi', 'AC', 'Entertainment'],
      image: '🚐'
    },
    {
      id: 3,
      busName: 'Kigali Bus Service',
      departure: '02:00 PM',
      arrival: '05:00 PM',
      duration: '3h 00m',
      price: 8000,
      availableSeats: 15,
      rating: 4.4,
      features: ['AC', 'Comfortable Seats'],
      image: '🚌'
    }
  ];

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip);
    setSelectedSeats([]);
  };

  const handleSeatToggle = (seatNumber) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleBooking = () => {
    if (selectedTrip && selectedSeats.length > 0) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden py-20">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl font-bold mb-4">Book Your Journey</h1>
            <p className="text-xl text-gray-300">Select from available trips and secure your seats</p>
          </motion.div>
        </Container>
      </section>

      {/* Alert */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert type="success" closable={false}>
            ✓ Booking confirmed! Redirecting to payment...
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <Container className="py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trips List */}
          <div className="lg:col-span-2">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Available Trips
            </motion.h2>

            <div className="space-y-4">
              {trips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleTripSelect(trip)}
                  className={`cursor-pointer transition-all ${
                    selectedTrip?.id === trip.id
                      ? 'bg-white/20 dark:bg-white/10 border-purple-400 border'
                      : 'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                  } rounded-xl p-6 hover:shadow-lg dark:hover:border-purple-400/50`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">{trip.image}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {trip.busName}
                        </h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center text-yellow-400">
                            {'★'.repeat(Math.floor(trip.rating))}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {trip.rating} ({trip.availableSeats} seats available)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        RF {trip.price.toLocaleString()}
                      </p>
                      <Badge variant="success" size="sm">
                        Available
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-xs text-gray-500">Departure</p>
                        <p className="font-semibold">{trip.departure}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <ArrowRight className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-semibold">{trip.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-xs text-gray-500">Arrival</p>
                        <p className="font-semibold">{trip.arrival}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {trip.features.map((feature, idx) => (
                      <Badge key={idx} variant="primary" size="sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Booking Summary
              </h3>

              {selectedTrip ? (
                <div className="space-y-6">
                  {/* Trip Details */}
                  <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected Trip</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedTrip.busName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedTrip.departure} - {selectedTrip.arrival}
                    </p>
                  </div>

                  {/* Seat Selection */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Select Seats ({selectedSeats.length})
                    </p>
                    <div className="grid grid-cols-6 gap-2">
                      {Array.from({ length: 30 }, (_, i) => i + 1).map(seat => (
                        <motion.button
                          key={seat}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSeatToggle(seat)}
                          className={`p-2 rounded text-xs font-semibold transition-all ${
                            selectedSeats.includes(seat)
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                              : seat % 3 === 0
                              ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-purple-500/20'
                          }`}
                          disabled={seat % 3 === 0}
                        >
                          {seat}
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <span className="text-gray-600 dark:text-gray-400">Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <span className="text-gray-600 dark:text-gray-400">Selected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <span className="text-gray-600 dark:text-gray-400">Booked</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {selectedSeats.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4"
                    >
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">
                            {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} ×
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            RF {selectedTrip.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            RF {(selectedTrip.price * selectedSeats.length).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">Tax (15%)</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            RF {Math.round((selectedTrip.price * selectedSeats.length) * 0.15).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-purple-500/20 pt-4 flex justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">Total</span>
                        <span className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text">
                          RF {Math.round((selectedTrip.price * selectedSeats.length) * 1.15).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <ModernButton
                    variant="primary"
                    size="lg"
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0}
                    icon={Check}
                    className="w-full"
                  >
                    {selectedSeats.length > 0 ? 'Proceed to Payment' : 'Select Seats'}
                  </ModernButton>

                  <ModernButton
                    variant="secondary"
                    size="lg"
                    onClick={() => setSelectedTrip(null)}
                    className="w-full"
                  >
                    Clear Selection
                  </ModernButton>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a trip to continue
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

export default BookingPageTemplate;
