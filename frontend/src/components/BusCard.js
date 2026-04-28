import React from 'react';
import { motion } from 'framer-motion';
import { Bus, Clock, MapPin, Users, Star, Wifi, Wind, Battery, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SeatVisualization from './SeatVisualization';

const BusCard = ({ bus }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Navigate to booking page with bus data
    navigate('/booking', { 
      state: { 
        selectedBus: bus,
        from: bus.from,
        to: bus.to,
        price: bus.price,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        duration: bus.duration
      } 
    });
  };

  const getFeatureIcon = (feature) => {
    const icons = {
      'WiFi': Wifi,
      'AC': Wind,
      'USB Charging': Battery,
      'Entertainment': Coffee,
      'Snacks': Coffee,
      'Reclining Seats': Users,
      'Comfortable Seats': Users
    };
    const IconComponent = icons[feature] || Users;
    return <IconComponent className="w-3 h-3" />;
  };

  const getRouteTypeColor = (routeType) => {
    const colors = {
      'Express': 'from-blue-500 to-purple-600',
      'Premium': 'from-purple-500 to-pink-600',
      'Standard': 'from-green-500 to-teal-600',
      'Economy': 'from-gray-500 to-gray-600'
    };
    return colors[routeType] || 'from-blue-500 to-purple-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 ${
        !bus.isAvailable ? 'opacity-75' : ''
      }`}
    >
      {/* Card Header */}
      <div className={`relative h-48 bg-gradient-to-br ${getRouteTypeColor(bus.routeType)} overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-20">
          <Bus className="absolute inset-0 w-full h-full p-8 text-white opacity-30" />
        </div>
        
        {/* Bus Number and Route Type */}
        <div className="absolute top-4 left-4">
          <div className="bg-white/20 backdrop-blur-lg px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium">{bus.busNumber}</span>
          </div>
          <div className="mt-2 bg-white/20 backdrop-blur-lg px-2 py-1 rounded-full">
            <span className="text-white text-xs">{bus.routeType}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{bus.rating}</span>
          </div>
        </div>

        {/* Bus Name and Company */}
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">{bus.busName}</h3>
          <p className="text-white/80 text-sm">{bus.company}</p>
        </div>

        {/* Availability Status */}
        <div className="absolute bottom-4 right-4">
          {bus.isAvailable ? (
            <div className="bg-green-500 px-3 py-1 rounded-full">
              <span className="text-white text-xs font-medium">Available</span>
            </div>
          ) : (
            <div className="bg-red-500 px-3 py-1 rounded-full">
              <span className="text-white text-xs font-medium">Sold Out</span>
            </div>
          )}
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
              <p className="font-semibold text-gray-900 dark:text-white">{bus.from}</p>
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
              <p className="font-semibold text-gray-900 dark:text-white">{bus.to}</p>
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
            <p className="font-semibold text-gray-900 dark:text-white mt-1">{bus.duration}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-xs">Seats</span>
            </div>
            <p className={`font-semibold mt-1 ${
              bus.availableSeats === 0 ? 'text-red-600 dark:text-red-400' : 
              bus.availableSeats <= 5 ? 'text-yellow-600 dark:text-yellow-400' : 
              'text-green-600 dark:text-green-400'
            }`}>
              {bus.availableSeats} left
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Departure</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white mt-1">{bus.departureTime}</p>
          </div>
        </div>

        {/* Seat Visualization */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Seat Layout</h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {bus.availableSeats} of {bus.totalSeats} available
            </span>
          </div>
          <SeatVisualization bus={bus} size="small" />
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {bus.features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              {getFeatureIcon(feature)}
              <span>{feature}</span>
            </div>
          ))}
          {bus.features.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              +{bus.features.length - 4} more
            </span>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{bus.price.toLocaleString()} RWF</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">per person</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookNow}
            disabled={!bus.isAvailable}
            className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
              bus.isAvailable 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {bus.isAvailable ? 'Book Now' : 'Sold Out'}
          </motion.button>
        </div>
      </div>

      {/* Driver Info */}
      <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700 pt-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Driver: {bus.driverName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 dark:text-gray-400">{bus.driverPhone}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusCard;
