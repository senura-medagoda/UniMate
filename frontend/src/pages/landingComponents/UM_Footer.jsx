import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Heart, Shield, Users, Star } from 'lucide-react'

function UM_Footer() {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' }
  ];

  const services = [
    { name: 'Food Delivery', path: '/services' },
    { name: 'Job Portal', path: '/services' },
    { name: 'Accommodation', path: '/services' },
    { name: 'Study Materials', path: '/services' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:bg-blue-600', label: 'Facebook' },
    { icon: Twitter, href: '#', color: 'hover:bg-blue-400', label: 'Twitter' },
    { icon: Instagram, href: '#', color: 'hover:bg-pink-600', label: 'Instagram' },
    { icon: Linkedin, href: '#', color: 'hover:bg-blue-700', label: 'LinkedIn' }
  ];

  const contactInfo = [
    { icon: Mail, text: 'support@unimate.com', href: 'mailto:support@unimate.com' },
    { icon: Phone, text: '+94 77 123 4567', href: 'tel:+94771234567' },
    { icon: MapPin, text: 'University Road, Colombo, Sri Lanka', href: '#' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <img 
                src="/Logo.png" 
                alt="UniMate Logo" 
                className="h-8 w-auto"
              />
              
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              A student-supportive platform that makes your university life easier. 
              Find accommodation, order food, apply for jobs, share study materials, 
              and buy/sell items in one place.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <motion.a
                  key={index}
                  href={contact.href}
                  className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <contact.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{contact.text}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <a 
                    href={link.path} 
                    className="text-gray-300 hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li
                  key={service.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <a 
                    href={service.path} 
                    className="text-gray-300 hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                    {service.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Social */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Stay Connected</h3>
            
            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-4">
                Subscribe to get updates on new features and services.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <motion.button
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-lg transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gray-300">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-700 ${social.color} text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 py-8 border-t border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mx-auto mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">10K+</div>
            <div className="text-sm text-gray-400">Active Students</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mx-auto mb-3">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">500+</div>
            <div className="text-sm text-gray-400">Service Providers</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl mx-auto mb-3">
              <Star className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">4.9/5</div>
            <div className="text-sm text-gray-400">Student Rating</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl mx-auto mb-3">
              <Heart className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">99%</div>
            <div className="text-sm text-gray-400">Satisfaction</div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} UniMate. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-200">Cookie Policy</a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default UM_Footer