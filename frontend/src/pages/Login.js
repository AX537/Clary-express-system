import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await login(formData.email, formData.password);
      // Redirect based on role
      if (user.role === 'Admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Zap,    text: 'Instant Booking',  color: 'text-yellow-400' },
    { icon: Shield, text: 'Secure Payment',   color: 'text-blue-400' },
    { icon: Clock,  text: '24/7 Support',     color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* Left Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:block"
          >
            <div className="space-y-8">
              <div>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl font-bold text-white mb-4"
                >
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Clary Express Ticketing System
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-lg text-gray-300"
                >
                  Your modern travel companion for seamless bus booking across the country
                </motion.p>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-400/30 transition-all"
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    <span className="text-white font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="pt-6 space-y-2"
              >
                <p className="text-sm text-gray-400">Trusted by over 50,000+ travelers</p>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full" />
                  ))}
                  <span className="text-sm text-gray-300 ml-2">4.8/5 Rating</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Login
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 mb-8"
              >
                Access your travel bookings instantly
              </motion.p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Remember & Forgot */}
                <div className="flex justify-between items-center">
                  <label className="flex items-center text-gray-300">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600" />
                    <span className="ml-2 text-sm">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <span>{loading ? 'Logging in...' : 'Login'}</span>
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </motion.button>
              </form>

              <div className="my-6 flex items-center space-x-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-400 text-sm">New here?</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <Link
                to="/register"
                className="block w-full border border-white/20 text-white font-semibold py-3 rounded-lg text-center hover:bg-white/5 transition-all"
              >
                Create Account
              </Link>

              <p className="text-center text-gray-400 text-xs mt-6">
                By logging in, you agree to our{' '}
                <Link to="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Login;