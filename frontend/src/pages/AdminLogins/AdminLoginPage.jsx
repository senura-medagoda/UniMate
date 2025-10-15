import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UM_Nav from '../landingComponents/UM_Nav.jsx'
import { 
  Shield, 
  Briefcase, 
  Utensils, 
  ShoppingCart, 
  Home, 
  BookOpen,
  ArrowRight,
  Users,
  Settings,
  BarChart3
} from 'lucide-react'

const AdminLoginPage = () => {
  const navigate = useNavigate()

  const adminTypes = [
    {
      id: 'system',
      title: 'System Admin',
      description: 'Master control over the entire platform, user management, and system settings',
      icon: Settings,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      route: '/sa-login'
    },
    {
      id: 'job',
      title: 'Job Portal Admin',
      description: 'Manage job postings, hiring managers, and employment opportunities',
      icon: Briefcase,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-primary',
      route: '/jpadmin-login'
    },
    {
      id: 'food',
      title: 'Food Admin',
      description: 'Oversee food vendors, restaurants, and dining services management',
      icon: Utensils,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      route: '/food/admin/login'
    },
    {
      id: 'marketplace',
      title: 'Marketplace Admin',
      description: 'Control marketplace operations, vendors, and product listings',
      icon: ShoppingCart,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      route: '/A_login'
    },
    {
      id: 'accommodation',
      title: 'Accommodation Admin',
      description: 'Manage boarding places, accommodation bookings, and housing services',
      icon: Home,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      route: '/admin/login'
    },
    {
      id: 'study',
      title: 'Study Material Admin',
      description: 'Oversee study materials, academic resources, and educational content',
      icon: BookOpen,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      route: '/SMAdminDashboard'
    }
  ]

  const handleAdminClick = (route) => {
    navigate(route)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <UM_Nav/>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
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
              Admin Portal Hub
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Choose Your
              <span className="text-primary block">Admin Panel</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Access specialized admin dashboards for different platform modules. 
              Each admin type has tailored controls and management capabilities.
            </motion.p>
          </motion.div>

          {/* Admin Cards Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {adminTypes.map((admin, index) => {
              const IconComponent = admin.icon
              return (
                <motion.div
                  key={admin.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  onClick={() => handleAdminClick(admin.route)}
                >
                  <div className={`${admin.bgColor} rounded-2xl p-6 h-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                    {/* Icon */}
                    <div className={`w-16 h-16 ${admin.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 ${admin.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                      {admin.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {admin.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                      <span>Access Panel</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Bottom Stats */}
          <motion.div 
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-2xl font-bold text-primary mb-2">6</div>
              <div className="text-gray-600 text-sm">Admin Types</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-2xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600 text-sm">Active Users</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-gray-600 text-sm">Uptime</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-2xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600 text-sm">Support</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage