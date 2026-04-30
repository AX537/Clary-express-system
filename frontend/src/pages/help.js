import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HelpCircle, Phone, MessageCircle, Mail, Clock,
  ChevronDown, ChevronUp, ArrowLeft, Users, Ticket,
  CreditCard, Shield, AlertCircle, CheckCircle, Star,
  Search, User, Send, MapPin, Bus
} from 'lucide-react';
import ModernCard from "../components/ModernCard";

function Help() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("faq");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState(''); // 'sending' | 'sent' | 'error'

  const faqs = [
    {
      question: "How do I book a ticket?",
      answer: "Go to the Home page, search for your route by entering origin and destination, select a bus, choose your seat, fill in passenger details, and complete payment. The whole process takes less than 5 minutes!",
      icon: Ticket,
      category: "booking"
    },
    {
      question: "How can I cancel my booking?",
      answer: "Go to your Profile or 'My Bookings' section, find the trip you want to cancel, and click 'Cancel Booking'. Cancellation is free if done more than 24 hours before departure.",
      icon: AlertCircle,
      category: "booking"
    },
    {
      question: "What is the refund policy?",
      answer: "100% refund if cancelled 24hrs before departure. 75% refund for 12hrs before. 50% refund for 4hrs before. 25% refund for 1hr before. No refund within 1 hour of departure.",
      icon: CreditCard,
      category: "payment"
    },
    {
      question: "How do I pay with Mobile Money?",
      answer: "Select Mobile Money as your payment method during booking. Enter your MTN MoMo or Airtel Money phone number on the payment page and click Pay. You will receive a USSD prompt on your phone — enter your PIN to approve the payment.",
      icon: Phone,
      category: "payment"
    },
    {
      question: "How long does Mobile Money payment take?",
      answer: "The USSD prompt appears on your phone within seconds. Once you enter your PIN, the payment is confirmed instantly and your ticket QR code is generated automatically.",
      icon: Clock,
      category: "payment"
    },
    {
      question: "Do I need to print my ticket?",
      answer: "No! Just show the QR code on your phone screen to the driver or supervisor at boarding. Digital tickets are fully accepted on all Clary Express buses.",
      icon: Shield,
      category: "ticket"
    },
    {
      question: "Can I change my seat after booking?",
      answer: "Seat changes are not currently supported online. Please contact our customer care at +250 793680562 at least 2 hours before departure and we will assist you.",
      icon: Users,
      category: "booking"
    },
    {
      question: "What if my payment fails?",
      answer: "If your Mobile Money payment fails, your booking is still created but unpaid. You can retry payment by going to My Bookings and clicking 'Pay Now'. If the problem persists, contact our support team.",
      icon: AlertCircle,
      category: "payment"
    },
    {
      question: "How do I view my booking history?",
      answer: "Log in to your account and go to your Profile page. You will see all your past and upcoming bookings with their status and payment details.",
      icon: User,
      category: "account"
    },
    {
      question: "What buses are available?",
      answer: "We operate buses between major Rwandan cities including Kigali, Musanze, Rubavu, Huye, Muhanga, and more. Search your route on the home page to see all available buses and departure times.",
      icon: Bus,
      category: "general"
    }
  ];

  const contactInfo = [
    { method: "Customer Care", details: "+250 793680562", hours: "24/7", icon: Phone, color: "from-green-500 to-teal-600", action: "tel:+250793680562" },
    { method: "WhatsApp", details: "+250 793680562", hours: "6AM - 10PM", icon: MessageCircle, color: "from-green-400 to-green-600", action: "https://wa.me/250793680562" },
    { method: "Email", details: "ishimweclaryaxel@gmail.com", hours: "Response within 2hrs", icon: Mail, color: "from-blue-500 to-purple-600", action: "mailto:ishimweclaryaxel@gmail.com" },
    { method: "Office", details: "Kigali, Rwanda", hours: "Mon-Sat 8AM-6PM", icon: MapPin, color: "from-orange-500 to-red-500", action: null }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill in all required fields');
      return;
    }
    setFormStatus('sending');
    // Simulate sending (in production, connect to email API)
    setTimeout(() => {
      setFormStatus('sent');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-600 text-lg">How can we help you today?</p>
        </motion.div>

        {/* Back Button */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-xl shadow mb-8">
          {[
            { id: 'faq',     label: 'FAQs',       icon: HelpCircle },
            { id: 'contact', label: 'Contact Us',  icon: Phone      },
            { id: 'guide',   label: 'User Guide',  icon: Star       }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                activeSection === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              />
            </div>

            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No FAQs match your search. Try different keywords or contact us.</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                {filteredFAQs.map((faq, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <div
                      onClick={() => toggleFAQ(index)}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <faq.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                            {expandedFAQ === index && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-gray-600 mt-2 text-sm leading-relaxed"
                              >
                                {faq.answer}
                              </motion.p>
                            )}
                          </div>
                        </div>
                        {expandedFAQ === index
                          ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                          : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                        }
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">

            {/* Contact Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {contactInfo.map((contact, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <div
                    onClick={() => contact.action && window.open(contact.action, '_blank')}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${contact.action ? 'cursor-pointer hover:shadow-md transition-all' : ''}`}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${contact.color} rounded-lg flex items-center justify-center mr-3`}>
                        <contact.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.method}</h3>
                        <p className="text-xs text-gray-500">{contact.hours}</p>
                      </div>
                    </div>
                    <p className="font-mono text-gray-800 bg-gray-50 px-3 py-2 rounded-lg text-sm">{contact.details}</p>
                    {contact.action && (
                      <p className="text-xs text-blue-600 mt-2">Click to {contact.method === 'Email' ? 'send email' : contact.method === 'Office' ? 'view map' : 'contact'} →</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
                <Send className="w-5 h-5 mr-2 text-blue-600" />
                Send us a Message
              </h2>

              {formStatus === 'sent' ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-4">We'll get back to you within 2 hours.</p>
                  <button onClick={() => setFormStatus('')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text" placeholder="Your name" required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email" placeholder="your@email.com" required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text" placeholder="What is your issue about?"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      rows={5} placeholder="Describe your issue or question in detail..." required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    type="submit" disabled={formStatus === 'sending'}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    {formStatus === 'sending' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>

            {/* Emergency */}
            <div className="mt-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-5 text-center text-white">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-bold text-lg mb-1">Emergency Support</h3>
              <p className="text-red-100 text-sm mb-3">For urgent issues during travel</p>
              <a href="tel:+250793680562" className="text-2xl font-bold hover:underline">+250 793680562</a>
              <p className="text-red-100 text-xs mt-1">Available 24/7</p>
            </div>
          </motion.div>
        )}

        {/* User Guide Section */}
        {activeSection === 'guide' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">How to Use Clary Express</h2>

            <div className="space-y-4">
              {[
                { step: 1, title: "Create an Account", desc: "Register with your name, email and password. It's free and takes less than 1 minute.", icon: User, color: "from-blue-500 to-blue-600", action: () => navigate('/register'), actionLabel: "Register Now" },
                { step: 2, title: "Search for a Bus", desc: "Enter your origin and destination on the home page. Browse available buses, departure times and prices.", icon: Search, color: "from-purple-500 to-purple-600", action: () => navigate('/'), actionLabel: "Search Buses" },
                { step: 3, title: "Select Your Seat", desc: "Click on any available seat (shown in gray) on the seat map. Green means selected, red means already booked.", icon: Users, color: "from-green-500 to-green-600", action: null, actionLabel: null },
                { step: 4, title: "Fill Passenger Details", desc: "Enter your full name and phone number. These will appear on your ticket.", icon: User, color: "from-yellow-500 to-orange-500", action: null, actionLabel: null },
                { step: 5, title: "Pay with Mobile Money", desc: "Enter your MTN MoMo or Airtel Money number. You'll receive a USSD prompt — just enter your PIN to confirm.", icon: Phone, color: "from-green-600 to-teal-600", action: null, actionLabel: null },
                { step: 6, title: "Get Your QR Ticket", desc: "After payment, a QR code is generated. Show it to the driver when boarding. No printing needed!", icon: CheckCircle, color: "from-blue-600 to-purple-600", action: null, actionLabel: null },
              ].map((step, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg`}>
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-600 text-sm">{step.desc}</p>
                        {step.action && (
                          <button
                            onClick={step.action}
                            className="mt-2 text-sm text-blue-600 font-medium hover:underline"
                          >
                            {step.actionLabel} →
                          </button>
                        )}
                      </div>
                      <step.icon className="w-6 h-6 text-gray-300 flex-shrink-0" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                <Star className="w-5 h-5 mr-2 text-blue-600" /> Tips for a smooth experience
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" /><span>Book early to get the best seat selection</span></li>
                <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" /><span>Make sure your MoMo account has sufficient balance before paying</span></li>
                <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" /><span>Arrive at the bus station at least 15 minutes before departure</span></li>
                <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" /><span>Keep your phone charged to show the QR code at boarding</span></li>
                <li className="flex items-start space-x-2"><CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" /><span>Screenshot your QR code in case of poor internet connection</span></li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Help;
