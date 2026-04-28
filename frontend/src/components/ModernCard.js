import React from 'react';
import { motion } from 'framer-motion';

const ModernCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  padding = 'p-6',
  rounded = 'rounded-xl',
  shadow = 'shadow-lg'
}) => {
  const baseClasses = `
    bg-white dark:bg-gray-800 
    ${padding} 
    ${rounded} 
    ${shadow}
    border border-gray-200 dark:border-gray-700
    transition-all duration-300
  `;

  const variants = {
    default: baseClasses,
    glass: `
      ${baseClasses}
      bg-white/80 dark:bg-gray-800/80
      backdrop-blur-lg
      border border-white/20 dark:border-gray-700/50
    `,
    gradient: `
      ${baseClasses}
      bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700
      border-0
    `,
    elevated: `
      ${baseClasses}
      ${hover ? 'hover:shadow-2xl' : ''}
      transform hover:-translate-y-1
    `
  };

  const cardClasses = variants[variant] || variants.default;

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      className={`${cardClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export default ModernCard;
