import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Bus, MapPin, CreditCard, BarChart3, Settings,
  Plus, Edit, Trash2, Eye, Search, Mail, Phone
} from 'lucide-react';
import { userAPI, busAPI, bookingAPI, paymentAPI, companyAPI, routeAPI } from '../services/api';
import ModernCard from '../components/ModernCard';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuses: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        usersRes, busesRes, bookingsRes, paymentsRes,
        companiesRes, routesRes
      ] = await Promise.all([
        userAPI.getUsers(),
        busAPI.getBuses(),
        bookingAPI.getBookings(),
        paymentAPI.getPayments(),
        companyAPI.getCompanies(),
        routeAPI.getRoutes()
      ]);

      const usersData = usersRes.data.data || [];
      const busesData = busesRes.data.data || [];
      const bookingsData = bookingsRes.data.data || [];
      const paymentsData = paymentsRes.data.data || [];
      const companiesData = companiesRes.data.data || [];
      const routesData = routesRes.data.data || [];

      setUsers(usersData);
      setBuses(busesData);
      setBookings(bookingsData);
      setCompanies(companiesData);
      setRoutes(routesData);

      // Calculate stats
      const totalRevenue = paymentsData
        .filter(payment => payment.status === 'completed')
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

      setStats({
        totalUsers: usersData.length,
        totalBuses: busesData.length,
        totalBookings: bookingsData.length,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${color} p-6 rounded-xl text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className="w-8 h-8 opacity-80" />
      </div>
    </motion.div>
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBuses = buses.filter(bus =>
    bus.plate_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage your e-ticketing system</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Buses"
            value={stats.totalBuses}
            icon={Bus}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={CreditCard}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={BarChart3}
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-lg p-1 flex flex-wrap">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'buses', label: 'Buses', icon: Bus },
              { id: 'bookings', label: 'Bookings', icon: CreditCard },
              { id: 'companies', label: 'Companies', icon: Settings },
              { id: 'routes', label: 'Routes', icon: MapPin }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all m-1 ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-900'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ModernCard>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Booking #{booking.id}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Seat {booking.seat_number}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              </ModernCard>

              <ModernCard>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Database</span>
                    <span className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      Connected
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">API Server</span>
                    <span className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      Running
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Payment Gateway</span>
                    <span className="flex items-center text-yellow-600">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                      Configuring
                    </span>
                  </div>
                </div>
              </ModernCard>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                            Active
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-yellow-600 hover:bg-yellow-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModernCard>
          )}

          {/* Buses Tab */}
          {activeTab === 'buses' && (
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bus Management</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search buses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Bus
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Plate Number</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Company</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Route</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Seats</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Departure</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBuses.map((bus) => (
                      <tr key={bus.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{bus.plate_number}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {companies.find(c => c.id === bus.company_id)?.name || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {routes.find(r => r.id === bus.route_id)?.origin} → {routes.find(r => r.id === bus.route_id)?.destination}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{bus.total_seats}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(bus.departure_date).toLocaleDateString()} {bus.departure_time}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-yellow-600 hover:bg-yellow-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModernCard>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <ModernCard>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Booking Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Booking ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Passenger</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Bus</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Seat</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">#{booking.id}</td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {users.find(u => u.id === booking.passenger_id)?.name || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {buses.find(b => b.id === booking.bus_id)?.plate_number || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{booking.seat_number}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-yellow-600 hover:bg-yellow-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModernCard>
          )}

          {/* Companies Tab */}
          {activeTab === 'companies' && (
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Company Management</h3>
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <div key={company.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{company.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <Mail className="w-4 h-4 inline mr-1" />
                      {company.contact_email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <Phone className="w-4 h-4 inline mr-1" />
                      {company.contact_phone}
                    </p>
                    <div className="flex space-x-2">
                      <button className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4 mx-auto" />
                      </button>
                      <button className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCard>
          )}

          {/* Routes Tab */}
          {activeTab === 'routes' && (
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Route Management</h3>
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Route
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routes.map((route) => (
                  <div key={route.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {route.origin} → {route.destination}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Duration: {Math.floor(route.estimated_duration / 60)}h {route.estimated_duration % 60}m
                    </p>
                    <div className="flex space-x-2">
                      <button className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4 mx-auto" />
                      </button>
                      <button className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;