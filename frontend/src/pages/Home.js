import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Star, TrendingUp, Shield } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import BusCard from '../components/BusCard';
import { busAPI, routeAPI } from '../services/api';

function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [searchData, setSearchData] = useState({ from: '', to: '', date: '' });
  const { t } = React.useContext(LanguageContext);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const response = await routeAPI.getRoutes();
        const routesData = response.data?.data?.routes || response.data?.routes || [];
        setRoutes(routesData);
        const allDest = new Set();
        routesData.forEach(r => { allDest.add(r.origin); allDest.add(r.destination); });
        setDestinations(Array.from(allDest).sort());
      } catch (error) {
        console.error('Failed to load routes:', error);
      }
    };
    loadRoutes();
  }, []);

  const handleSearch = async (data) => {
    const from = data.from?.trim();
    const to = data.to?.trim();

    if (!from || !to) {
      alert('Please enter both origin and destination');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const response = await busAPI.searchBuses(from, to, data.date || '');
      const tripsData = response.data?.data?.buses || response.data?.buses || [];
      setTrips(tripsData);
    } catch (error) {
      console.error('Failed to search buses:', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
    setSearchData(data);
  };

  const stats = [
    { icon: Users,      label: "Happy Customers", value: "50K+",  color: "blue"   },
    { icon: TrendingUp, label: "Daily Trips",      value: "200+",  color: "green"  },
    { icon: Shield,     label: "Safety Record",    value: "99.9%", color: "purple" },
    { icon: Star,       label: "Customer Rating",  value: "4.8/5", color: "yellow" }
  ];

  const popularRoutes = routes.slice(0, 6).map(route => ({
    from: route.origin,
    to: route.destination,
    price: Number(route.price) || 5000,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center space-y-4 mb-10">
            <h1 className="text-4xl md:text-6xl font-bold">{t('home.title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">{t('home.subtitle')}</p>
          </motion.div>

          {/* Search Form */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text" list="from-dest"
                    placeholder={t('home.fromPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    value={searchData.from}
                    onChange={(e) => setSearchData({...searchData, from: e.target.value})}
                  />
                  <datalist id="from-dest">{destinations.map((d,i) => <option key={i} value={d} />)}</datalist>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text" list="to-dest"
                    placeholder={t('home.toPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    value={searchData.to}
                    onChange={(e) => setSearchData({...searchData, to: e.target.value})}
                  />
                  <datalist id="to-dest">{destinations.map((d,i) => <option key={i} value={d} />)}</datalist>
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    value={searchData.date}
                    onChange={(e) => setSearchData({...searchData, date: e.target.value})}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch(searchData)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>{t('home.searchButton')}</span>
                </motion.button>
              </div>
            </div>

            {/* Quick Routes */}
            {popularRoutes.length > 0 && (
              <div className="mt-4">
                <p className="text-center text-white mb-3 text-sm">{t('home.quickActions')}:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularRoutes.slice(0, 4).map((route, i) => (
                    <motion.button
                      key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const d = { from: route.from, to: route.to, date: '' };
                        setSearchData(d);
                        handleSearch(d);
                      }}
                      className="px-4 py-2 bg-white/20 backdrop-blur-lg text-white rounded-full text-sm hover:bg-white/30 transition-all"
                    >
                      {route.from} to {route.to}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Search Results */}
      {loading && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <LoadingSpinner size="large" text="Searching for available buses..." />
          </div>
        </section>
      )}

      {!loading && searched && trips.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Buses</h2>
              <p className="text-gray-600">{searchData.from} to {searchData.to}{searchData.date ? ` on ${searchData.date}` : ' — all upcoming dates'}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((bus, i) => (
                <motion.div key={bus.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <BusCard bus={bus} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!loading && searched && trips.length === 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('home.noTrips')}</h3>
            <p className="text-gray-600">Try adjusting your search criteria or dates</p>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className={`w-16 h-16 bg-${stat.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      {popularRoutes.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('home.popularRoutes')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('home.popularRoutesDescription')}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularRoutes.map((route, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => { const d = { from: route.from, to: route.to, date: '' }; setSearchData(d); handleSearch(d); }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-lg hover:shadow-xl cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{route.from}</p>
                      <p className="text-sm text-gray-500">to {route.to}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{route.price.toLocaleString()} RWF</p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
