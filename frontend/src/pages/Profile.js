import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Edit, Save, X, Ticket, CreditCard, MapPin, Bell, Lock, ChevronRight, Bus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { authAPI, bookingAPI } from '../services/api';
import ModernCard from '../components/ModernCard';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user: authUser, logout } = useAuth();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });

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
      const bookingsData = bookingsRes.data?.data?.bookings || bookingsRes.data?.bookings || [];
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update local state since we don't have an update profile endpoint yet
      setUser({ ...user, ...editForm });
      localStorage.setItem('user', JSON.stringify({ ...authUser, ...editForm }));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'confirmed') return 'text-green-600 bg-green-100';
    if (status === 'pending')   return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (status) => {
    if (status === 'confirmed') return <CheckCircle className="w-4 h-4" />;
    if (status === 'pending')   return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
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
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
          <p className="text-gray-300">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded-full capitalize">{user?.role}</span>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-lg p-1 flex flex-wrap gap-1">
            {[
              { id: 'profile',  label: 'Profile',     icon: User   },
              { id: 'bookings', label: 'My Bookings',  icon: Ticket },
              { id: 'settings', label: 'Settings',     icon: Lock   },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-5 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id ? 'bg-white text-purple-900' : 'text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
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
                  <button onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <Edit className="w-4 h-4 mr-2" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setIsEditing(false)}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', name: 'name', icon: User,   type: 'text',  value: user?.name  },
                  { label: 'Email',     name: 'email', icon: Mail,  type: 'email', value: user?.email },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {isEditing ? (
                      <input type={field.type} value={editForm[field.name]}
                        onChange={(e) => setEditForm({...editForm, [field.name]: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <field.icon className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-900">{field.value}</span>
                      </div>
                    )}
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-900 capitalize">{user?.role}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-400 mr-3" />
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
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Ticket className="w-5 h-5 mr-2 text-purple-600" />
                My Bookings ({bookings.length})
              </h2>

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings yet</h3>
                  <p className="text-gray-500 mb-4">You haven't booked any trips yet.</p>
                  <a href="/" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-block">
                    Search Buses
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bus className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            {/* Route */}
                            <p className="font-bold text-gray-900">
                              {booking.bus?.route?.origin || 'N/A'} → {booking.bus?.route?.destination || 'N/A'}
                            </p>
                            {/* Bus & Seat */}
                            <p className="text-sm text-gray-600">
                              Bus: {booking.bus?.plateNumber || booking.bus?.plate_number || 'N/A'} &nbsp;|&nbsp;
                              Seat: <strong>{booking.seatNumber || booking.seat_number}</strong>
                            </p>
                            {/* Departure */}
                            {booking.bus?.departureDate && (
                              <p className="text-sm text-gray-500">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {booking.bus.departureDate} at {booking.bus.departureTime}
                              </p>
                            )}
                            {/* Payment */}
                            {booking.payment && (
                              <p className="text-sm text-gray-500">
                                <CreditCard className="w-3 h-3 inline mr-1" />
                                {Number(booking.payment.amount).toLocaleString()} RWF —
                                <span className={`ml-1 capitalize ${booking.payment.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                  {booking.payment.status}
                                </span>
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Booked on {new Date(booking.createdAt || booking.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </span>
                          <p className="text-xs text-gray-400 mt-1">#{booking.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ModernCard>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Notifications */}
            <ModernCard>
              <div className="flex items-center mb-4">
                <Bell className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Booking confirmations and updates' },
                  { key: 'sms',   label: 'SMS Notifications',   desc: 'Text messages for important updates' },
                  { key: 'push',  label: 'Push Notifications',  desc: 'Browser notifications' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
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

            {/* Security */}
            <ModernCard>
              <div className="flex items-center mb-4">
                <Lock className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Security</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Change Password', desc: 'Update your account password' },
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                ].map(item => (
                  <button key={item.label} className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
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
