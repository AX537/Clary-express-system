import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Share, 
  Share2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Bus,
  Clock,
  Shield,
  Users
} from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

const ModernFooter = () => {
  const { t } = React.useContext(LanguageContext);

  const footerSections = [
    {
      title: 'Company',
      links: [
        { to: '/about', label: t('footer.about') },
        { to: '/help', label: t('footer.help') },
        { to: '/privacy', label: t('footer.privacy') },
        { to: '/terms', label: t('footer.terms') }
      ]
    },
    {
      title: 'Services',
      links: [
        { to: '/booking', label: t('footer.busBooking') },
        { to: '/routes', label: t('footer.ourRoutes') },
        { to: '/cargo', label: t('footer.cargoServices') },
        { to: '/corporate', label: t('footer.corporateTravel') }
      ]
    },
    {
      title: 'Support',
      links: [
        { to: '/faq', label: t('footer.faq') },
        { to: '/contact', label: t('footer.contact') },
        { to: '/feedback', label: t('footer.feedback') },
        { to: '/complaints', label: t('footer.complaints') }
      ]
    }
  ];

  const socialLinks = [
    { icon: Share, href: '#', label: 'Share' },
    { icon: Share2, href: '#', label: 'Twitter' },
    { icon: Globe, href: '#', label: 'Instagram' }
  ];

  const features = [
    { icon: Shield, text: 'Safe Travel' },
    { icon: Clock, text: 'On Time' },
    { icon: Users, text: '24/7 Support' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Clary Express Ticketing System</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted travel partner in the country, providing safe, comfortable, and affordable bus services across the country.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-blue-400 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-3 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{feature.text}</h4>
                  <p className="text-gray-400 text-sm">
                    {feature.text === 'Safe Travel' && 'Your safety is our priority'}
                    {feature.text === 'On Time' && 'Punctuality guaranteed'}
                    {feature.text === '24/7 Support' && 'Always here to help'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Phone className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Hotline</p>
                <p className="text-white font-medium">+250 788 123 456</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium">info@claryexpress.rw</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Head Office</p>
                <p className="text-white font-medium">Kigali, the country</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <p className="text-gray-300 text-sm">
                © {new Date().getFullYear()} Clary Express Ticketing System. {t('footer.rights')}.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex space-x-6 text-sm"
            >
              <Link to="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-gray-300 hover:text-blue-400 transition-colors">
                Sitemap
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
