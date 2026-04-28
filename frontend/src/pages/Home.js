import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Star, TrendingUp, Shield, Bus } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import BusCard from '../components/BusCard';
import { busAPI, routeAPI } from '../services/api';

function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });
  const { t } = React.useContext(LanguageContext);

  // Load routes and destinations on component mount
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const response = await routeAPI.getRoutes();
        const routesData = response.data?.routes || [];
        setRoutes(routesData);
        
        // Extract unique destinations for autocomplete
        const allDestinations = new Set();
        routesData.forEach(route => {
          allDestinations.add(route.origin);
          allDestinations.add(route.destination);
        });
        setDestinations(Array.from(allDestinations).sort());
      } catch (error) {
        console.error('Failed to load routes:', error);
        // Fallback to empty arrays if API fails
        setRoutes([]);
        setDestinations([]);
      }
    };

    loadRoutes();
  }, []);

  const handleSearch = async (data) => {
    // 1. Normalize user inputs
    const from = data.from?.trim().toLowerCase();
    const to = data.to?.trim().toLowerCase();

    // 2. Fetch buses from backend API based on search criteria
    if (!from || !to) {
      alert('Please enter both origin and destination');
      return;
    }
    try {
      const response = await busAPI.searchBuses(from, to, data.date);
      const tripsData = response.data?.buses || [];
      setTrips(tripsData);
      } catch (error) {
        console.error('Failed to load trips:', error);
        setTrips([]);
        return;
      }
    }

    // 3. Fix filtering logic
    const normalize = (t) => (t || "").trim().toLowerCase();

    // Calculate dates for today, tomorrow, and day after tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const formatDate = (date) => date.toISOString().split('T')[0]; // YYYY-MM-DD

    const availableDates = [formatDate(today), formatDate(tomorrow), formatDate(dayAfterTomorrow)];

    const results = trips.filter(trip => {
      const tripFrom = normalize(trip.from || trip.origin);
      const tripTo = normalize(trip.to || trip.destination);
      const tripDate = trip.departureDate || trip.date;

      return tripFrom === normalize(from) &&
             tripTo === normalize(to) &&
             availableDates.includes(tripDate);
    });

    // 5. Log debug info
    console.log("Trips:", trips);
    console.log("User input:", from, to);
    console.log("Results:", results);

    // 6. Store results in state
    setTrips(results);
    setSearchData(data);
  };

  // Helper functions for data transformation
  const calculateArrivalTime = (departureTime, durationMinutes) => {
    if (!departureTime || !durationMinutes) return 'N/A';
    
    const [hours, minutes] = departureTime.split(':').map(Number);
    const departureDate = new Date();
    departureDate.setHours(hours, minutes, 0, 0);
    
    const arrivalDate = new Date(departureDate.getTime() + durationMinutes * 60000);
    return arrivalDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculatePrice = (durationMinutes) => {
    // Simple pricing based on duration (you can adjust this logic)
    if (!durationMinutes) return 5000;
    return Math.max(3000, Math.min(15000, durationMinutes * 20));
  };

  const stats = [
    { icon: Users, label: "Happy Customers", value: "50K+", color: "blue" },
    { icon: TrendingUp, label: "Daily Trips", value: "200+", color: "green" },
    { icon: Shield, label: "Safety Record", value: "99.9%", color: "purple" },
    { icon: Star, label: "Customer Rating", value: "4.8/5", color: "yellow" }
  ];

  // Generate popular routes from API data
  const popularRoutes = routes.slice(0, 6).map(route => ({
    from: route.origin,
    to: route.destination,
    price: route.price || calculatePrice(route.estimatedDuration),
    company: 'Various'
  }));

  // Show some available buses (you might want to fetch actual available buses from API)
  const availableBuses = routes.slice(0, 6).map((route, index) => ({
    id: index + 1,
    busName: `Bus ${index + 1}`,
    company: 'Express Lines',
    from: route.origin,
    to: route.destination,
    departureTime: '08:00 AM',
    arrivalTime: calculateArrivalTime('08:00', route.estimatedDuration),
    duration: formatDuration(route.estimatedDuration),
    price: route.price || calculatePrice(route.estimatedDuration),
    availableSeats: 25,
    totalSeats: 40,
    isAvailable: true,
    rating: 4.5,
    features: ['WiFi', 'AC', 'Reclining Seats'],
    image: '/logo.png'
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {t('home.subtitle')}
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('home.fromPlaceholder')}
                    list="from-destinations"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    value={searchData.from}
                    onChange={(e) => setSearchData({...searchData, from: e.target.value})}
                  />
                  <datalist id="from-destinations">
                    {destinations.map((dest, index) => (
                      <option key={index} value={dest} />
                    ))}
                  </datalist>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('home.toPlaceholder')}
                    list="to-destinations"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    value={searchData.to}
                    onChange={(e) => setSearchData({...searchData, to: e.target.value})}
                  />
                  <datalist id="to-destinations">
                    {destinations.map((dest, index) => (
                      <option key={index} value={dest} />
                    ))}
                  </datalist>
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    value={searchData.date}
                    onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                    aria-label={t('home.datePlaceholder')}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch(searchData)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>{t('home.searchButton')}</span>
                </motion.button>
              </div>
              
              {/* Test Search Button */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    console.log('Testing search with sample data');
                    const testData = { from: 'Kigali', to: 'Musanze', date: '', passengers: 1 };
                    handleSearch(testData);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                >
                  Test: Kigali → Musanze
                </button>
                <button
                  onClick={() => {
                    console.log('Testing search with sample data');
                    const testData = { from: 'Kigali', to: 'Gisenyi', date: '', passengers: 1 };
                    handleSearch(testData);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                >
                  Test: Kigali → Gisenyi
                </button>
                <button
                  onClick={() => {
                    console.log('Available routes from API:', routes);
                    console.log('Available destinations:', destinations);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                >
                  Debug Data
                </button>
              </div>
            </div>

          {/* Quick Actions - Popular Routes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6"
          >
            <p className="text-center text-white mb-3 text-sm">{t('home.quickActions')}:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularRoutes.slice(0, 4).map((route, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchData({ from: route.from, to: route.to, date: '', passengers: 1 });
                    handleSearch({ from: route.from, to: route.to, date: '', passengers: 1 });
                  }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-lg text-white rounded-full text-sm hover:bg-white/30 transition-all duration-300"
                >
                  {route.from} → {route.to}
                </motion.button>
              ))}
            </div>
          </motion.div>
          </motion.div>

          {/* Available Buses - Right after search */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{t('home.availableBuses')}</h2>
              <p className="text-blue-100">{t('home.availableBusesDescription')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableBuses.map((bus, index) => (
                <motion.div
                  key={bus.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <BusCard bus={bus} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('home.popularRoutes')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.popularRoutesDescription')}</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route, index) => (
              <motion.div
                key={`${route.from}-${route.to}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{route.from}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">to {route.to}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{route.price}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">from</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Results */}
      {loading && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoadingSpinner size="large" text="Searching for available trips..." />
          </div>
        </section>
      )}

      {trips.length > 0 && !loading && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Search Results</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {searchData.from} to {searchData.to} {searchData.date && `on ${searchData.date}`}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((bus, index) => (
                <motion.div
                  key={bus.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BusCard bus={bus} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!loading && trips.length === 0 && searchData.from && searchData.to && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('home.noTrips')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or dates
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
