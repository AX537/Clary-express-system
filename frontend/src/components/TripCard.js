import React from 'react';
import { motion } from 'framer-motion';
import { Bus, Clock, MapPin, Users, Star } from 'lucide-react';

const TripCard = ({ trip, onSelect }) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(trip);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      {/* Card Header with Bus Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20">
          <Bus className="absolute inset-0 w-full h-full p-8 text-white opacity-50" />
        </div>
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{trip.rating || '4.8'}</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">{trip.busName}</h3>
          <p className="text-blue-100 text-sm">{trip.company}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4">
        {/* Route Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
              <p className="font-semibold text-gray-900 dark:text-white">{trip.from}</p>
            </div>
          </div>
          <div className="flex-1 mx-4">
            <div className="h-0.5 bg-gray-300 dark:bg-gray-600 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Bus className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
              <p className="font-semibold text-gray-900 dark:text-white">{trip.to}</p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Duration</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white mt-1">{trip.duration}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-xs">Seats</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white mt-1">{trip.availableSeats} left</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Departure</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white mt-1">{trip.departureTime}</p>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">RWF {trip.price}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">per person</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSelect}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Select Trip
          </motion.button>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">WiFi</span>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">AC</span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">Reclining Seats</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
