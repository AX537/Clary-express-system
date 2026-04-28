import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, Inbox, Clock, RefreshCcw } from 'lucide-react';
import { notificationAPI } from '../services/api';
import ModernCard from '../components/ModernCard';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data?.data?.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError(err.response?.data?.message || 'Unable to load notifications at this time.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    setRefreshing(true);
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, isRead: true } : item
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
      setError('Unable to update notification state. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl text-white shadow-lg">
            <Bell className="w-6 h-6 text-blue-300" />
            <div>
              <h1 className="text-4xl font-bold">Notifications</h1>
              <p className="text-gray-300">Review your latest alerts and keep track of updates.</p>
            </div>
          </div>
        </motion.div>

        <ModernCard>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your notifications</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All notifications are up to date.'}
              </p>
            </div>
            <button
              type="button"
              onClick={fetchNotifications}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-white">Loading notifications…</div>
          ) : error ? (
            <div className="py-10 text-center text-red-400">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <Inbox className="mx-auto mb-4 w-16 h-16" />
              <p className="text-lg">No notifications yet.</p>
              <p className="text-sm text-gray-400">Your latest trip updates will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-2xl border p-4 shadow-sm transition-all ${
                    notification.isRead ? 'border-gray-200 bg-white/80 dark:border-gray-700 dark:bg-gray-900' : 'border-blue-400 bg-blue-50/80 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Bell className="w-4 h-4" />
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{notification.messageType || 'Update'}</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{notification.message}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{notification.isRead ? 'Read' : 'Unread'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={refreshing}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark as read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ModernCard>
      </div>
    </div>
  );
}

export default Notifications;
