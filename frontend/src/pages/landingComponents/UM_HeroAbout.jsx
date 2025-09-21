import React from 'react'
import { motion } from 'framer-motion'
import { Users, Target, Lightbulb, Shield, CheckCircle, Star, ArrowRight, Heart, BookOpen, Home, Utensils, Briefcase, ShoppingBag } from 'lucide-react'

function UM_HeroAbout() {
  const services = [
    { icon: Utensils, name: "Food Delivery", color: "from-orange-400 to-red-500" },
    { icon: Briefcase, name: "Job Portal", color: "from-blue-400 to-indigo-500" },
    { icon: Home, name: "Accommodation", color: "from-green-400 to-emerald-500" },
    { icon: BookOpen, name: "Study Material", color: "from-purple-400 to-violet-500" },
    { icon: ShoppingBag, name: "Marketplace", color: "from-pink-400 to-rose-500" }
  ];

  const stats = [
    { number: "10,000+", label: "Active Students", icon: Users },
    { number: "500+", label: "Service Providers", icon: Shield },
    { number: "5", label: "Core Services", icon: CheckCircle },
    { number: "99.9%", label: "Uptime", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
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
            <Heart className="w-4 h-4" />
            Built for Students, by Students
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            About{' '}
            <span className="text-primary">UniMate</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            UniMate is an all-in-one, student-focused digital platform built to simplify and enhance 
            every aspect of university life. We create a trusted environment where students can access 
            everything they need for their academic journey.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Our <span className="text-primary">Story</span>
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <p className="text-lg leading-relaxed">
                UniMate was born from a simple observation: university life is complex, and students 
                shouldn't have to juggle multiple apps and platforms to access basic services.
              </p>
              <p className="text-lg leading-relaxed">
                We've carefully designed our platform to be safe and reliable, ensuring that only 
                student-specific services are provided. This protects both students and service 
                providers while creating a trusted ecosystem.
              </p>
              <p className="text-lg leading-relaxed">
                Today, UniMate brings together five essential services into one unified platform, 
                making campus life smoother, more connected, and more productive for thousands of students.
              </p>
            </div>
          </motion.div>

          {/* Right Side - Image Gallery */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="col-span-2 relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/src/pages/landingComponents/Images/std_img1.jpg" 
                    alt="Students working together"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-semibold">Student Community</span>
                    </div>
                    <p className="text-xs opacity-90">Building connections</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src="/src/pages/landingComponents/Images/std_img2.jpg" 
                    alt="Campus life"
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 text-white">
                    <div className="flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      <span className="text-xs font-semibold">Campus Life</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src="/src/pages/landingComponents/Images/std_img3.jpg" 
                    alt="Student success"
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 text-white">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span className="text-xs font-semibold">Success</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Services Overview */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
            Our <span className="text-primary">Services</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Vision & Mission */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Vision */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the leading student-supportive platform that empowers university students 
              worldwide by providing safe, reliable, and accessible digital services that 
              make academic life smoother, more connected, and more productive.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Lightbulb className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to simplify university life by creating a secure, all-in-one digital 
              ecosystem for students. We aim to connect students with essential services while 
              enabling trusted service providers to support student needs directly.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default UM_HeroAbout