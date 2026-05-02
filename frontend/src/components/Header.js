import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bus, Menu, X, User, LogOut, Bell, Settings, Ticket } from 'lucide-react';

function Header() {
  const { user, logout, isAdmin, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Bus className="w-7 h-7 text-purple-400" />
            <span className="font-bold text-lg text-white">Clary Express</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            <Link to="/help" className="text-gray-300 hover:text-white transition-colors">Help</Link>
            {isLoggedIn && (
              <Link to="/booking" className="text-gray-300 hover:text-white transition-colors">Booking</Link>
            )}
            {isLoggedIn && (
              <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">My Tickets</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <Link to="/notifications" className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                  <Bell className="w-5 h-5" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all"
                  >
                    <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{user?.role}</span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 mr-2" /> Profile
                      </Link>
                      <Link
                        to="/profile"
                        state={{ tab: 'bookings' }}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Ticket className="w-4 h-4 mr-2" /> My Bookings
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="w-4 h-4 mr-2" /> Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
                  Login
                </Link>
                <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Home</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">About</Link>
            <Link to="/help" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Help</Link>
            {isLoggedIn && <>
              <Link to="/booking" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Booking</Link>
              <Link to="/notifications" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Notifications</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Profile</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-purple-400 hover:text-purple-300 hover:bg-white/10 rounded-lg">Admin Dashboard</Link>}
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg">
                Logout
              </button>
            </>}
            {!isLoggedIn && <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-purple-400 hover:text-purple-300 hover:bg-white/10 rounded-lg">Register</Link>
            </>}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
