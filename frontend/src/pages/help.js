// FrontEnd/eticketing-ui/src/pages/Help.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  HelpCircle, 
  Phone, 
  MessageCircle, 
  Mail, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  Users,
  Ticket,
  CreditCard,
  Shield,
  AlertCircle,
  CheckCircle,
  Star,
  Search,
  User
} from 'lucide-react';
import ModernCard from "../components/ModernCard";

function Help() {
  const [activeSection, setActiveSection] = useState("faq");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I book a ticket?",
      answer: "Select your route, choose a seat, enter passenger details, and complete payment. The process takes less than 5 minutes!",
      icon: Ticket
    },
    {
      question: "How can I cancel my booking?",
      answer: "Go to 'My Bookings', select the trip, and click 'Cancel'. Cancellation fees apply based on time before departure.",
      icon: AlertCircle
    },
    {
      question: "What is the refund policy?",
      answer: "100% refund if cancelled 24hrs before, 75% for 12hrs, 50% for 4hrs, 25% for 1hr. No refund within 1 hour of departure.",
      icon: CreditCard
    },
    {
      question: "Can I change my seat?",
      answer: "Yes, you can modify your seat up to 2 hours before departure, subject to availability.",
      icon: Users
    },
    {
      question: "Do I need to print my ticket?",
      answer: "No, just show the QR code on your phone to the driver. Digital tickets are fully accepted.",
      icon: Shield
    }
  ];

  const contactInfo = [
    { 
      method: "Customer Care", 
      details: "+250 793680562", 
      hours: "24/7",
      icon: Phone,
      color: "from-green-500 to-teal-600"
    },
    { 
      method: "WhatsApp", 
      details: "+250 793680562", 
      hours: "6AM - 8PM",
      icon: MessageCircle,
      color: "from-green-500 to-green-600"
    },
    { 
      method: "Email", 
      details: "ishimweclaryaxel@gmail.com", 
      hours: "Response within 2hrs",
      icon: Mail,
      color: "from-blue-500 to-purple-600"
    },
    { 
      method: "Twitter/X", 
      details: "@Clary Axel", 
      hours: "8AM - 6PM",
      icon: MessageCircle,
      color: "from-blue-400 to-blue-600"
    }
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/10 to-blue-300/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <img 
                src="/logo.png" 
                alt="Clary Express Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Clary Express Ticketing System</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">We're here to help you 24/7</p>
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

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg">
            {[
              { id: "faq", label: "FAQs", icon: HelpCircle },
              { id: "contact", label: "Contact Us", icon: Phone },
              { id: "guide", label: "User Guide", icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  activeSection === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        {activeSection === "faq" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <ModernCard variant="elevated" className="cursor-pointer" hover={false} onClick={() => toggleFAQ(index)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <faq.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                          {expandedFAQ === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="text-gray-600 dark:text-gray-400 mt-2"
                            >
                              {faq.answer}
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <div className="ml-3">
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </ModernCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contact Section */}
        {activeSection === "contact" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <ModernCard variant="elevated" className="h-full">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-lg flex items-center justify-center mr-4`}>
                        <contact.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{contact.method}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{contact.hours}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="font-mono text-gray-900 dark:text-white">{contact.details}</p>
                    </div>
                  </ModernCard>
                </motion.div>
              ))}
            </div>

            {/* Emergency Support */}
            <ModernCard variant="gradient" className="text-center py-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Emergency Support</h3>
              <p className="text-blue-100 mb-4">For urgent issues during travel</p>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg p-4">
                <p className="text-xl font-bold text-white">+250 793680562</p>
                <p className="text-blue-100 text-sm">Available 24/7</p>
              </div>
            </ModernCard>
          </motion.div>
        )}

        {/* User Guide Section */}
        {activeSection === "guide" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">How to Use Clary Express Ticketing System</h2>
            
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Search for a Trip",
                  description: "Enter your origin, destination, and travel date to see available buses.",
                  icon: Search
                },
                {
                  step: 2,
                  title: "Select Your Seat",
                  description: "Choose your preferred seat from the interactive seat map.",
                  icon: Users
                },
                {
                  step: 3,
                  title: "Enter Passenger Details",
                  description: "Provide your name and phone number for the ticket.",
                  icon: User
                },
                {
                  step: 4,
                  title: "Make Payment",
                  description: "Pay via Mobile Money (MTN/Airtel) or Credit Card.",
                  icon: CreditCard
                },
                {
                  step: 5,
                  title: "Show Your Ticket",
                  description: "Present the QR code to the driver when boarding.",
                  icon: CheckCircle
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <ModernCard variant="elevated">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">{step.step}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  </ModernCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Help;