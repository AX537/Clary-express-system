import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Edit, Save, X, Ticket, MapPin, Bell, Lock, Settings, ChevronRight, Bus, Calendar, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import { authAPI, bookingAPI } from '../services/api';
import ModernCard from '../components/ModernCard';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });
  const navigate = useNavigate();

  useEffect(() => { fetchUserData(); }, []);

  const fetchUserData = async () => {
    try {
      const [userRes, bookingsRes] = await Promise.all([
        authAPI.getProfile(),
        bookingAPI.getBookings()
      ]);

      const userData = userRes.data?.data?.user || {};
      setUser(userData);
      setEditForm({ name: userData.name || '', email: userData.email || '' });

      // Handle different response structures
      const bookingsData =
        bookingsRes.data?.data?.bookings ||
        bookingsRes.data?.bookings ||
        bookingsRes.data?.data ||
        [];
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Update name in localStorage
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, name: editForm.name }));
      setUser(prev => ({ ...prev, ...editForm }));
      setIsEditing(false);
      alert('Profile updated!');
    } catch (error) {
      alert('Failed to update profile.');
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'confirmed') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'pending')   return <Clock className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusColor = (status) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-800';
    if (status === 'pending')   return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
          <p className="text-gray-400">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded-full">{user?.role}</span>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-lg p-1 flex flex-wrap gap-1">
            {[
              { id: 'profile',  label: 'Profile',     icon: User    },
              { id: 'bookings', label: 'My Bookings',  icon: Ticket  },
              { id: 'settings', label: 'Settings',     icon: Settings },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-5 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id ? 'bg-white text-purple-900' : 'text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.id === 'bookings' && bookings.length > 0 && (
                  <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{bookings.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ModernCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button onClick={handleSave} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" /> Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  {isEditing ? (
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-purple-500" />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{user?.name}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{user?.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Account Type</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{user?.role}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </ModernCard>
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ModernCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
                <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  + Book New Trip
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings yet</h3>
                  <p className="text-gray-500 mb-4">You haven't made any bookings. Start by searching for a bus!</p>
                  <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Search Buses
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const origin      = booking.bus?.route?.origin      || 'N/A';
                    const destination = booking.bus?.route?.destination  || 'N/A';
                    const company     = booking.bus?.company?.name       || 'N/A';
                    const plate       = booking.bus?.plateNumber || booking.bus?.plate_number || 'N/A';
                    const depDate     = booking.bus?.departureDate || booking.bus?.departure_date || 'N/A';
                    const depTime     = booking.bus?.departureTime || booking.bus?.departure_time || '';
                    const seat        = booking.seatNumber || booking.seat_number;

                    return (
                      <div key={booking.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Bus className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{origin} → {destination}</h3>
                              <p className="text-sm text-gray-600">{company} · {plate}</p>
                              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{depDate} {depTime}</span>
                                <span className="flex items-center"><CreditCard className="w-3 h-3 mr-1" />Seat {seat}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              <span className="capitalize ml-1">{booking.status}</span>
                            </span>
                            <p className="text-xs text-gray-400 mt-1">#{booking.id}</p>
                          </div>
                        </div>

                        {/* Payment info if available */}
                        {booking.payment && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm text-gray-600">Payment</span>
                            <span className={`text-sm font-semibold ${booking.payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {Number(booking.payment.amount).toLocaleString()} RWF · {booking.payment.status}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ModernCard>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <ModernCard>
              <div className="flex items-center mb-4">
                <Bell className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', sub: 'Booking confirmations via email' },
                  { key: 'sms',   label: 'SMS Notifications',   sub: 'Text messages for updates' },
                  { key: 'push',  label: 'Push Notifications',  sub: 'Browser notifications' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.sub}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.key] ? 'bg-purple-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </ModernCard>

            <ModernCard>
              <div className="flex items-center mb-4">
                <Lock className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Security</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Change Password', sub: 'Update your account password' },
                  { label: 'Two-Factor Authentication', sub: 'Add extra security to your account' },
                ].map((item, i) => (
                  <button key={i} className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.sub}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </ModernCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Profile;
