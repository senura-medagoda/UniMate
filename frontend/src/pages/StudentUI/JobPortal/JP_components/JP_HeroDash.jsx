import React from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  Building2, 
  Users, 
  Search, 
  Lightbulb, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'
import emp1 from '../../../landingComponents/Images/emp1.jpg'

const JP_HeroDash = () => {
  return (
    <div 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${emp1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-indigo-900/80"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Find Your Perfect{' '}
            <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Student Job
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            UniMate's Job Portal connects students with on-campus employment opportunities, 
            internships, and local part-time jobs. Build your career while balancing your studies.
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button className="group text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}>
              <Search className="w-5 h-5" />
              Browse Jobs
            </button>
            <button className="group bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3">
              <Lightbulb className="w-5 h-5" />
              Application Tips
            </button>
          </motion.div>
          
          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {/* Available Jobs */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">256</div>
                <div className="text-white font-medium mb-1">Available Jobs</div>
                <div className="text-gray-300 text-sm">Updated today</div>
              </div>
            </div>
            
            {/* Employers */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <Building2 className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">42</div>
                <div className="text-blue-300 font-medium mb-1">Employers</div>
                <div className="text-gray-300 text-sm">On campus</div>
              </div>
            </div>
            
            {/* Active Students */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1,234</div>
                <div className="text-purple-300 font-medium mb-1">Active Students</div>
                <div className="text-gray-300 text-sm">Seeking jobs</div>
              </div>
            </div>
            
            {/* Success Rate */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-orange-500/20 p-3 rounded-full">
                  <TrendingUp className="w-8 h-8 text-orange-400" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">89%</div>
                <div className="text-orange-300 font-medium mb-1">Success Rate</div>
                <div className="text-gray-300 text-sm">Job placement</div>
              </div>
            </div>
          </motion.div>
          
          {/* Additional Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 text-gray-200">
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="text-sm sm:text-base">Verified Employers</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-200">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-sm sm:text-base">Real-time Updates</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-200">
              <Briefcase className="w-5 h-5 text-white" />
              <span className="text-sm sm:text-base">Career Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default JP_HeroDash