import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Wraps any route that requires the user to be logged in.
 * Optionally restricts to specific roles.
 *
 * Usage:
 *   <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
 *   <Route path="/admin"   element={<ProtectedRoute roles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
 */
function ProtectedRoute({ children, roles = [] }) {
  const { isLoggedIn, user, loading } = useAuth();

  // Still checking localStorage — don't redirect yet
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → go to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → go home
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;