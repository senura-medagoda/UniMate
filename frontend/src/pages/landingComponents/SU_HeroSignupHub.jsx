import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Home, 
  Utensils, 
  ArrowRight, 
  Users, 
  Star, 
  CheckCircle,
  Building2,
  ChefHat,
  UserCheck
} from 'lucide-react';
import UM_Nav from './UM_Nav.jsx';
import UM_Footer from './UM_Footer.jsx';

const SU_HeroSignupHub = () => {
  const signupCards = [
    {
      id: 'hiring-manager',
      title: 'Hiring Manager',
      subtitle: 'Recruit Top Talent',
      description: 'Post jobs, manage applications, and find the perfect candidates for your organization. Streamline your hiring process with our advanced tools.',
      icon: Briefcase,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      route: '/hm/signup',
      features: ['Job Posting', 'Application Management', 'Candidate Screening', 'Analytics Dashboard'],
      stats: { number: '500+', label: 'Active Managers' }
    },
    {
      id: 'boarding-owner',
      title: 'Boarding Owner',
      subtitle: 'Host Students',
      description: 'List your accommodation, manage bookings, and provide safe housing for students. Build your rental business with our platform.',
      icon: Home,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      route: '/owner/signup',
      features: ['Property Listing', 'Booking Management', 'Payment Processing', 'Student Verification'],
      stats: { number: '200+', label: 'Active Owners' }
    },
    {
      id: 'food-vendor',
      title: 'Food Vendor',
      subtitle: 'Serve Campus',
      description: 'Start your food business, manage your menu, and deliver delicious meals to students. Grow your customer base with our platform.',
      icon: Utensils,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      route: '/vendor/signup',
      features: ['Menu Management', 'Order Processing', 'Delivery Tracking', 'Customer Reviews'],
      stats: { number: '150+', label: 'Active Vendors' }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <UM_Nav />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <UserCheck className="w-4 h-4" />
              Join Our Partner Network
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Choose Your{' '}
              <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                Partner Path
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Become part of the UniMate ecosystem and connect with thousands of students. 
              Whether you're hiring, hosting, or serving - we have the perfect platform for your business.
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">10,000+</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">850+</div>
                <div className="text-sm text-gray-600">Partner Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">50+</div>
                <div className="text-sm text-gray-600">Universities</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Signup Cards */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {signupCards.map((card, index) => (
              <motion.div
                key={card.id}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                {/* Card */}
                <div className={`relative bg-gradient-to-br ${card.bgGradient} rounded-3xl p-8 h-full border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className={`absolute top-4 right-4 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full filter blur-2xl`}></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div 
                      className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 5 }}
                    >
                      <card.icon className={`w-8 h-8 ${card.iconColor}`} />
                    </motion.div>

                    {/* Title & Subtitle */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-4`}>
                      {card.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {card.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex}
                          className="flex items-center gap-2 text-sm text-gray-700"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 + featureIndex * 0.1 }}
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center">
                        <div className={`text-xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                          {card.stats.number}
                        </div>
                        <div className="text-xs text-gray-600">{card.stats.label}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">4.9</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      to={card.route}
                      className={`group/btn w-full bg-gradient-to-r ${card.gradient} hover:shadow-lg text-white px-6 py-4 rounded-xl font-semibold text-center transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Section */}
          <motion.div 
            className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose UniMate?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of successful partners who trust UniMate to grow their business and connect with students.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Large Student Base</h3>
                <p className="text-gray-600 text-sm">Access to thousands of active students across multiple universities</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted Platform</h3>
                <p className="text-gray-600 text-sm">Secure, reliable platform with 24/7 support and verification systems</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Management</h3>
                <p className="text-gray-600 text-sm">Intuitive tools and analytics to manage your business efficiently</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <UM_Footer />
    </div>
  );
};

export default SU_HeroSignupHub;