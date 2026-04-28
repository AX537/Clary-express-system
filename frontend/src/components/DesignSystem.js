import React from 'react';
import { motion } from 'framer-motion';

/**
 * MODERN FINTECH DESIGN SYSTEM FOR CLARY EXPRESS
 * This file contains reusable modern components and utilities
 */

// ============ COLORS & THEME ============
export const colors = {
  primary: {
    light: '#3b82f6',      // Blue
    main: '#1e40af',       // Darker Blue
    dark: '#1e3a8a',       // Very Dark Blue
  },
  secondary: {
    light: '#a78bfa',      // Purple
    main: '#7c3aed',       // Main Purple
    dark: '#5b21b6',       // Dark Purple
  },
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Amber
  error: '#ef4444',        // Red
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
};

// ============ GRADIENT BACKGROUNDS ============
export const gradients = {
  hero: 'from-slate-900 via-purple-900 to-slate-900',
  button: 'from-purple-500 to-blue-500',
  buttonHover: 'from-purple-600 to-blue-600',
  card: 'from-white/10 to-white/5',
};

// ============ ANIMATIONS ============
export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  pulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity }
  },
};

// ============ MODERN INPUT COMPONENT ============
export const ModernInput = ({ 
  icon: Icon, 
  label, 
  error, 
  ...props 
}) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-200 mb-2">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />}
      <input
        {...props}
        className={`w-full bg-white/5 border text-white placeholder-gray-400 rounded-lg ${
          Icon ? 'pl-10' : 'px-4'
        } pr-4 py-3 focus:outline-none transition-all ${
          error
            ? 'border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
            : 'border-white/10 focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-400/20'
        }`}
      />
    </div>
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);

// ============ MODERN BUTTON COMPONENT ============
export const ModernButton = ({ 
  variant = 'primary', 
  size = 'md',
  children,
  loading = false,
  icon: Icon,
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all focus:outline-none';
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white disabled:from-gray-500 disabled:to-gray-600',
    secondary: 'border border-white/20 text-white hover:bg-white/5',
    danger: 'bg-red-500/20 text-red-200 hover:bg-red-500/30 border border-red-500/30',
    success: 'bg-green-500/20 text-green-200 hover:bg-green-500/30 border border-green-500/30',
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${baseClasses} ${sizes[size]} ${variants[variant]}`}
    >
      {loading ? <span>Loading...</span> : children}
      {Icon && !loading && <Icon className="w-5 h-5" />}
    </button>
  );
};

// ============ MODERN CARD COMPONENT ============
export const ModernCard = ({ children, hover = true, ...props }) => (
  <motion.div
    {...animations.fadeInUp}
    whileHover={hover ? { y: -5 } : {}}
    className={`bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:border-purple-400/30 transition-all ${
      hover ? 'cursor-pointer' : ''
    }`}
    {...props}
  >
    {children}
  </motion.div>
);

// ============ STAT CARD COMPONENT ============
export const StatCard = ({ icon: Icon, label, value, color = 'blue', trend }) => (
  <ModernCard hover={false}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-300 text-sm mb-2">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {trend && <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% this month
        </p>}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-500/20`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
    </div>
  </ModernCard>
);

// ============ FEATURE CARD COMPONENT ============
export const FeatureCard = ({ icon: Icon, title, description, color = 'purple' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center space-y-4"
  >
    <div className={`w-16 h-16 mx-auto rounded-full bg-${color}-500/20 flex items-center justify-center`}>
      <Icon className={`w-8 h-8 text-${color}-400`} />
    </div>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </motion.div>
);

// ============ BADGE COMPONENT ============
export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variants = {
    primary: 'bg-purple-500/20 text-purple-200 border border-purple-500/30',
    success: 'bg-green-500/20 text-green-200 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-200 border border-red-500/30',
  };

  return (
    <span className={`rounded-full font-medium ${sizes[size]} ${variants[variant]}`}>
      {children}
    </span>
  );
};

// ============ PROGRESS BAR COMPONENT ============
export const ProgressBar = ({ value, color = 'purple' }) => (
  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1 }}
      className={`h-full bg-gradient-to-r from-${color}-500 to-blue-500`}
    />
  </div>
);

// ============ ALERT COMPONENT ============
export const Alert = ({ type = 'info', children, closable = true, onClose }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!isOpen) return null;

  const variants = {
    success: 'bg-green-500/20 border-green-500/30 text-green-200',
    error: 'bg-red-500/20 border-red-500/30 text-red-200',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 rounded-lg border ${variants[type]} flex items-center justify-between`}
    >
      <span>{children}</span>
      {closable && (
        <button
          onClick={() => {
            setIsOpen(false);
            onClose?.();
          }}
          className="text-lg font-bold opacity-50 hover:opacity-100"
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

// ============ LOADING SKELETON ============
export const Skeleton = ({ className = '' }) => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`bg-white/5 rounded-lg ${className}`}
  />
);

// ============ CONTAINER ============
export const Container = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export default {
  colors,
  gradients,
  animations,
  ModernInput,
  ModernButton,
  ModernCard,
  StatCard,
  FeatureCard,
  Badge,
  ProgressBar,
  Alert,
  Skeleton,
  Container,
};
