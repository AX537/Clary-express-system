// FrontEnd/eticketing-ui/src/pages/AboutUs.js

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Bus, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  Star, 
  Award, 
  Target, 
  Globe, 
  ArrowLeft,
  Heart,
  Zap
} from 'lucide-react';
import ModernCard from "../components/ModernCard";

function AboutUs() {

  const features = [
    {
      icon: Shield,
      title: "Safe Travel",
      description: "Your safety is our top priority with modern buses and experienced drivers"
    },
    {
      icon: Zap,
      title: "Quick Booking",
      description: "Modern e-ticketing system for instant booking and confirmation"
    },
    {
      icon: Users,
      title: "Customer Care",
      description: "24/7 support team ready to assist you with any queries"
    },
    {
      icon: Award,
      title: "Trusted Service",
      description: "Serving over 50,000+ satisfied customers across the country"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "100+", label: "Daily Routes" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About Clary Express Ticketing System</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Your trusted travel companion in the country</p>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <ModernCard variant="gradient" className="text-center py-12">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Leading Bus Transport Company</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              We are the premier bus transport platform connecting travelers across the country with 
              safe, reliable, and affordable transportation services.
            </p>
          </ModernCard>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ModernCard variant="elevated" className="h-full">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To provide safe, reliable, and affordable bus transportation with modern 
                e-ticketing convenience, making travel accessible and enjoyable for everyone.
              </p>
            </ModernCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ModernCard variant="elevated" className="h-full">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To become the country's most trusted and innovative transportation network, 
                setting the standard for excellence in bus travel services.
              </p>
            </ModernCard>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <ModernCard key={index} variant="glass" className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </ModernCard>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <ModernCard variant="elevated" className="text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </ModernCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <ModernCard variant="elevated">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-semibold text-gray-900 dark:text-white">+250 793680562</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-semibold text-gray-900 dark:text-white">ishimweclaryaxel@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Headquarters</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Kigali, the country</p>
                </div>
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="elevated">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Working Hours</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Monday - Friday</span>
                <span className="font-semibold text-gray-900 dark:text-white">6:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                <span className="font-semibold text-gray-900 dark:text-white">6:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                <span className="font-semibold text-gray-900 dark:text-white">6:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-medium">24/7 Support</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Available</span>
              </div>
            </div>
          </ModernCard>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <ModernCard variant="glass" className="inline-block">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <p className="text-gray-600 dark:text-gray-400">
                Made with love for travelers across the country
              </p>
            </div>
          </ModernCard>
        </motion.div>
      </div>
    </div>
  );
}

export default AboutUs;