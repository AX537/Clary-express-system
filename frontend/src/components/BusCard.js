import React from 'react';
import { motion } from 'framer-motion';
import { Bus, Clock, MapPin, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BusCard = ({ bus }) => {
  const navigate = useNavigate();

  // Normalize bus data — handles both backend API format and legacy mock format
  const from         = bus.route?.origin      || bus.from        || 'N/A';
  const to           = bus.route?.destination || bus.to          || 'N/A';
  const company      = bus.company?.name      || bus.company     || 'N/A';
  const plateNumber  = bus.plateNumber        || bus.plate_number|| bus.busName || 'N/A';
  const totalSeats   = bus.totalSeats         || bus.total_seats || 0;
  const availSeats   = bus.availableSeats     ?? bus.availableSeats ?? totalSeats;
  const departure    = bus.departureTime      || bus.departure_time || 'N/A';
  const duration     = bus.route?.estimatedDuration
    ? `${Math.floor(bus.route.estimatedDuration / 60)}h ${bus.route.estimatedDuration % 60}m`
    : bus.duration || 'N/A';
  const price        = bus.route?.price || bus.price || 5000;
  const rating       = bus.rating             || 4.5;
  const isAvailable  = availSeats > 0;

  const handleBookNow = () => {
    navigate('/booking', {
      state: {
        selectedBus: bus,
        from,
        to,
        price,
        departureTime: departure,
        duration
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${!isAvailable ? 'opacity-75' : ''}`}
    >
      {/* Header */}
      <div className="relative h-36 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <Bus className="w-20 h-20 text-white opacity-20" />
        </div>

        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-lg px-3 py-1 rounded-full">
          <span className="text-white text-sm font-medium">{plateNumber}</span>
        </div>

        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{rating}</span>
        </div>

        <div className="absolute bottom-4 left-4">
          <p className="text-white font-bold text-lg">{company}</p>
        </div>

        <div className="absolute bottom-4 right-4">
          <div className={`px-3 py-1 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}>
            <span className="text-white text-xs font-medium">{isAvailable ? 'Available' : 'Sold Out'}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Route */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">From</p>
            <p className="font-bold text-gray-900 dark:text-white">{from}</p>
          </div>
          <div className="flex-1 mx-3 h-0.5 bg-gray-200 dark:bg-gray-600 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <Bus className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">To</p>
            <p className="font-bold text-gray-900 dark:text-white">{to}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
              <Clock className="w-3 h-3" />
              <span className="text-xs">Duration</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{duration}</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
              <Users className="w-3 h-3" />
              <span className="text-xs">Seats</span>
            </div>
            <p className={`font-semibold text-sm ${
              availSeats === 0 ? 'text-red-600' :
              availSeats <= 5 ? 'text-yellow-600' : 'text-green-600'
            }`}>{availSeats} left</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
              <Clock className="w-3 h-3" />
              <span className="text-xs">Departs</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{departure}</p>
          </div>
        </div>

        {/* Departure Date */}
        {(bus.departureDate || bus.departure_date) && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{bus.departureDate || bus.departure_date}</span>
          </div>
        )}

        {/* Price & Book */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {typeof price === 'number' ? price.toLocaleString() : price} RWF
            </p>
            <p className="text-xs text-gray-500">per person</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookNow}
            disabled={!isAvailable}
            className={`px-5 py-2.5 font-medium rounded-lg transition-all ${
              isAvailable
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'Book Now' : 'Sold Out'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BusCard;
