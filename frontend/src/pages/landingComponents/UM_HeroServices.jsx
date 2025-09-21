import React from 'react'
import { motion } from 'framer-motion'
import { Utensils, Briefcase, Home, BookOpen, ShoppingBag, ArrowRight, CheckCircle, Star, Users, Shield } from 'lucide-react'

function UM_HeroServices() {
  const services = [
    {
      icon: Utensils,
      title: "Food Delivery",
      description: "Order meals from local providers directly to your hostel or university.",
      image: "/src/pages/StudentUI/FoodOrder/assets/choose_food.png",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: Briefcase,
      title: "Job Portal",
      description: "Find internships, part-time and full-time opportunities tailored for students.",
      image: "/src/pages/landingComponents/Images/std_img2.jpg",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: Home,
      title: "Accommodation",
      description: "Browse and book safe, affordable accommodation near your campus.",
      image: "/src/pages/landingComponents/Images/std_img1.jpg",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: BookOpen,
      title: "Study Material",
      description: "Access past papers, notes, and resources shared by fellow students.",
      image: "/src/pages/landingComponents/Images/std_img3.jpg",
      color: "from-purple-400 to-violet-500"
    },
    {
      icon: ShoppingBag,
      title: "Student Marketplace",
      description: "Buy and sell items like books, electronics, and essentials within your campus.",
      image: "/src/pages/StudentUI/FoodOrder/assets/order.png",
      color: "from-pink-400 to-rose-500"
    }
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
            <Shield className="w-4 h-4" />
            Trusted by 10,000+ Students
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Services We Provide for{' '}
            <span className="text-primary block">Students</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            UniMate is your one-stop platform designed to make university life easier.  
            Explore the services we offer to support students in every aspect of their academic journey.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Service Image */}
              <div className="relative mb-6 overflow-hidden rounded-2xl">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-20`}></div>
                <div className="absolute top-4 right-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Service Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <motion.button 
                  className="group/btn inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors duration-200"
                  whileHover={{ x: 5 }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Users Section */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div>
              <motion.h2 
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Be a Part of{' '}
                <span className="text-primary">UniMate</span>
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                Are you a <span className="font-semibold text-primary">Food Provider</span>, <span className="font-semibold text-primary">Property Owner</span>, or 
                <span className="font-semibold text-primary"> Hiring Manager</span>?  
                Join UniMate and start offering your services to thousands of students today.
              </motion.p>

              <motion.button 
                className="group inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register as a Service Provider
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </div>

            {/* Visual Elements */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-primary/10 rounded-2xl p-4 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-sm text-gray-600">Providers</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-2xl p-4 text-center">
                    <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-500">4.9/5</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-green-500/10 rounded-2xl p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-500">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                  <div className="bg-purple-500/10 rounded-2xl p-4 text-center">
                    <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-500">100%</div>
                    <div className="text-sm text-gray-600">Secure</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UM_HeroServices