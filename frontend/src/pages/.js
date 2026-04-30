import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Bus, MapPin, CreditCard, BarChart3, Settings,
  Plus, Edit, Trash2, Eye, Search, Mail, Phone, X
} from 'lucide-react';
import { userAPI, busAPI, bookingAPI, companyAPI, routeAPI } from '../services/api';
import ModernCard from '../components/ModernCard';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalBuses: 0, totalBookings: 0, totalRevenue: 0 });
  const [users, setUsers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'bus' | 'company' | 'route'
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, busesRes, bookingsRes, companiesRes, routesRes] = await Promise.all([
        userAPI.getUsers(),
        busAPI.getAllBuses(),       // Fixed: was busAPI.getBuses() which doesn't exist
        bookingAPI.getBookings(),
        companyAPI.getCompanies(),
        routeAPI.getRoutes()
      ]);

      const usersData    = usersRes.data?.data?.users || usersRes.data?.users || [];
      const busesData    = busesRes.data?.data?.buses || busesRes.data?.buses || [];
      const bookingsData = bookingsRes.data?.data?.bookings || bookingsRes.data?.bookings || [];
      const companiesData = companiesRes.data?.data?.companies || companiesRes.data?.companies || [];
      const routesData   = routesRes.data?.data?.routes || routesRes.data?.routes || [];

      setUsers(usersData);
      setBuses(busesData);
      setBookings(bookingsData);
      setCompanies(companiesData);
      setRoutes(routesData);

      setStats({
        totalUsers: usersData.length,
        totalBuses: busesData.length,
        totalBookings: bookingsData.length,
        totalRevenue: 0 // Removed paymentAPI.getPayments() which doesn't exist
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setFormError('');
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (modalType === 'company') {
        await companyAPI.createCompany(formData);
      } else if (modalType === 'route') {
        await routeAPI.createRoute({ ...formData, estimatedDuration: parseInt(formData.estimatedDuration) });
      } else if (modalType === 'bus') {
        await busAPI.createBus({
          ...formData,
          totalSeats: parseInt(formData.totalSeats),
          companyId: parseInt(formData.companyId),
          routeId: parseInt(formData.routeId)
        });
      }
      closeModal();
      fetchDashboardData(); // Refresh data
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      if (type === 'company') await companyAPI.deleteCompany(id);
      else if (type === 'route') await routeAPI.deleteRoute(id);
      else if (type === 'bus') await busAPI.deleteBus(id);
      else if (type === 'user') await userAPI.deleteUser(id);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete.');
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
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBuses = buses.filter(bus =>
    (bus.plateNumber || bus.plate_number || '').toLowerCase().includes(searchTerm.toLowerCase())
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage your e-ticketing system</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users"    value={stats.totalUsers}    icon={Users}    color="from-blue-500 to-blue-600" />
          <StatCard title="Total Buses"    value={stats.totalBuses}    icon={Bus}      color="from-green-500 to-green-600" />
          <StatCard title="Total Bookings" value={stats.totalBookings} icon={CreditCard} color="from-purple-500 to-purple-600" />
          <StatCard title="Companies"      value={companies.length}    icon={BarChart3} color="from-orange-500 to-orange-600" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-lg p-1 flex flex-wrap">
            {[
              { id: 'overview',   label: 'Overview',   icon: BarChart3 },
              { id: 'users',      label: 'Users',      icon: Users     },
              { id: 'buses',      label: 'Buses',      icon: Bus       },
              { id: 'bookings',   label: 'Bookings',   icon: CreditCard },
              { id: 'companies',  label: 'Companies',  icon: Settings  },
              { id: 'routes',     label: 'Routes',     icon: MapPin    }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all m-1 ${
                  activeTab === tab.id ? 'bg-white text-purple-900' : 'text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ModernCard>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Booking #{booking.id}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Seat {booking.seatNumber || booking.seat_number}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending'   ? 'bg-yellow-100 text-yellow-800' :
                                                         'bg-red-100 text-red-800'
                      }`}>{booking.status}</span>
                    </div>
                  ))}
                  {bookings.length === 0 && <p className="text-gray-500 text-center py-4">No bookings yet</p>}
                </div>
              </ModernCard>

              <ModernCard>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Status</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Database',        status: 'Connected',    color: 'green'  },
                    { label: 'API Server',       status: 'Running',      color: 'green'  },
                    { label: 'Payment Gateway',  status: 'Configuring',  color: 'yellow' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className={`flex items-center text-${item.color}-600`}>
                        <div className={`w-2 h-2 bg-${item.color}-600 rounded-full mr-2`}></div>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </ModernCard>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h3>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Search users..." value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{user.role}</span>
                        </td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleDelete('user', user.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && <p className="text-center text-gray-500 py-4">No users found</p>}
              </div>
            </ModernCard>
          )}

          {/* Buses */}
          {activeTab === 'buses' && (
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bus Management</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input type="text" placeholder="Search buses..." value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button onClick={() => openModal('bus')}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Bus
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">Plate Number</th>
                      <th className="text-left py-3 px-4 text-gray-700">Company</th>
                      <th className="text-left py-3 px-4 text-gray-700">Route</th>
                      <th className="text-left py-3 px-4 text-gray-700">Seats</th>
                      <th className="text-left py-3 px-4 text-gray-700">Departure</th>
                      <th className="text-left py-3 px-4 text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBuses.map((bus) => (
                      <tr key={bus.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">{bus.plateNumber || bus.plate_number}</td>
                        <td className="py-3 px-4 text-gray-600">{bus.company?.name || companies.find(c => c.id === (bus.companyId || bus.company_id))?.name || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {bus.route ? `${bus.route.origin} to ${bus.route.destination}` :
                            (() => { const r = routes.find(r => r.id === (bus.routeId || bus.route_id)); return r ? `${r.origin} to ${r.destination}` : 'N/A'; })()
                          }
                        </td>
                        <td className="py-3 px-4 text-gray-600">{bus.totalSeats || bus.total_seats}</td>
                        <td className="py-3 px-4 text-gray-600">{bus.departureDate || bus.departure_date} {bus.departureTime || bus.departure_time}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleDelete('bus', bus.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredBuses.length === 0 && <p className="text-center text-gray-500 py-4">No buses found</p>}
              </div>
            </ModernCard>
          )}

          {/* Bookings */}
          {activeTab === 'bookings' && (
            <ModernCard>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Booking Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 text-gray-700">Passenger</th>
                      <th className="text-left py-3 px-4 text-gray-700">Bus</th>
                      <th className="text-left py-3 px-4 text-gray-700">Seat</th>
                      <th className="text-left py-3 px-4 text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">#{booking.id}</td>
                        <td className="py-3 px-4 text-gray-600">{booking.passenger?.name || users.find(u => u.id === (booking.passengerId || booking.passenger_id))?.name || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-600">{booking.bus?.plateNumber || buses.find(b => b.id === (booking.busId || booking.bus_id))?.plateNumber || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-600">{booking.seatNumber || booking.seat_number}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending'   ? 'bg-yellow-100 text-yellow-800' :
                                                             'bg-red-100 text-red-800'
                          }`}>{booking.status}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{new Date(booking.createdAt || booking.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && <p className="text-center text-gray-500 py-4">No bookings yet</p>}
              </div>
            </ModernCard>
          )}

          {/* Companies */}
          {activeTab === 'companies' && (
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Company Management</h3>
                <button onClick={() => openModal('company')}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Company
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <div key={company.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{company.name}</h4>
                    <p className="text-sm text-gray-600 mb-1"><Mail className="w-4 h-4 inline mr-1" />{company.contactEmail || company.contact_email}</p>
                    <p className="text-sm text-gray-600 mb-3"><Phone className="w-4 h-4 inline mr-1" />{company.contactPhone || company.contact_phone}</p>
                    <button onClick={() => handleDelete('company', company.id)} className="w-full p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                ))}
                {companies.length === 0 && <p className="text-gray-500 col-span-3 text-center py-4">No companies yet</p>}
              </div>
            </ModernCard>
          )}

          {/* Routes */}
          {activeTab === 'routes' && (
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Route Management</h3>
                <button onClick={() => openModal('route')}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Route
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routes.map((route) => (
                  <div key={route.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-gray-900">{route.origin} to {route.destination}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Duration: {Math.floor((route.estimatedDuration || route.estimated_duration) / 60)}h {(route.estimatedDuration || route.estimated_duration) % 60}m
                    </p>
                    <button onClick={() => handleDelete('route', route.id)} className="w-full p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                ))}
                {routes.length === 0 && <p className="text-gray-500 col-span-3 text-center py-4">No routes yet</p>}
              </div>
            </ModernCard>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 capitalize">
                Add {modalType}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Company Form */}
              {modalType === 'company' && <>
                <input name="name" placeholder="Company Name" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500" />
                <input name="contactEmail" type="email" placeholder="Contact Email" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500" />
                <input name="contactPhone" placeholder="Contact Phone" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500" />
              </>}

              {/* Route Form */}
              {modalType === 'route' && <>
                <input name="origin" placeholder="Origin (e.g. Kigali)" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500" />
                <input name="destination" placeholder="Destination (e.g. Musanze)" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500" />
                <input name="estimatedDuration" type="number" placeholder="Duration in minutes (e.g. 120)" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500" />
              </>}

              {/* Bus Form */}
              {modalType === 'bus' && <>
                <input name="plateNumber" placeholder="Plate Number (e.g. RAB 123A)" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500" />
                <input name="totalSeats" type="number" placeholder="Total Seats (e.g. 40)" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500" />
                <select name="companyId" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500">
                  <option value="">Select Company</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select name="routeId" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500">
                  <option value="">Select Route</option>
                  {routes.map(r => <option key={r.id} value={r.id}>{r.origin} to {r.destination}</option>)}
                </select>
                <input name="departureDate" type="date" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500" />
                <input name="departureTime" type="time" required onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500" />
              </>}

              {formError && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{formError}</p>
              )}

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400">
                  {formLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
