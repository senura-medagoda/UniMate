import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Home, Utensils, Briefcase, BookOpen, Shield, Star, CheckCircle } from 'lucide-react';

const UM_HeroIndex = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side - Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Shield className="w-4 h-4" />
              Trusted by 10,000+ Students
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Your All-in-One{' '}
              <span className="text-primary block">University Ecosystem</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Connect, discover, and thrive. UniMate brings everything a student needs into one seamless platform - from housing and meals to jobs and study materials.
            </motion.p>

            {/* Features List */}
            <motion.div 
              className="space-y-3 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">Find & book accommodation</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">Order campus meals & food</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">Discover job opportunities</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">Access study materials</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                to="/stdregister" 
                className="group inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105"
              >
                Explore Services
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="text-center">
                <div className="text-xl font-bold text-primary mb-1">5+</div>
                <div className="text-xs text-gray-600">Essential Services</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary mb-1">10K+</div>
                <div className="text-xs text-gray-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary mb-1">50+</div>
                <div className="text-xs text-gray-600">Partner Businesses</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Visual Gallery */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Main Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Student Image 1 - Large */}
              <motion.div 
                className="col-span-2 relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/images/std_img1.jpg" 
                    alt="Students studying together"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">Study Together</span>
                    </div>
                    <p className="text-xs opacity-90">Connect with peers</p>
                  </div>
                </div>
              </motion.div>

              {/* Student Image 2 - Small */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src="/images/std_img2.jpg" 
                    alt="Student accommodation"
                    className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 text-white">
                    <div className="flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      <span className="text-xs font-semibold">Housing</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Food Image - Small */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src="/src/pages/StudentUI/FoodOrder/assets/choose_food.png" 
                    alt="Campus food ordering"
                    className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 text-white">
                    <div className="flex items-center gap-1">
                      <Utensils className="w-3 h-3" />
                      <span className="text-xs font-semibold">Food</span>
              </div>
            </div>
          </div>
              </motion.div>

              {/* Student Image 3 - Full Width */}
              <motion.div 
                className="col-span-2 relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src="/images/std_img3.jpg" 
                    alt="Students in campus life"
                    className="w-full h-20 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 text-white">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span className="text-xs font-semibold">Campus Life</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              </div>
              
            {/* Floating Elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <BookOpen className="w-8 h-8 text-primary" />
            </motion.div>

            <motion.div 
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center"
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <Briefcase className="w-6 h-6 text-blue-500" />
            </motion.div>

            {/* Trust Badge */}
            <motion.div 
              className="absolute -bottom-2 -right-2 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">4.9/5</div>
                  <div className="text-xs text-gray-600">Student Rating</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Features Section */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Secure & Safe</h3>
            <p className="text-gray-600 text-xs">Your data is protected with enterprise-grade security</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-gray-600 text-xs">Intuitive interface designed for students</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Community Driven</h3>
            <p className="text-gray-600 text-xs">Join thousands of students already using UniMate</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UM_HeroIndex;