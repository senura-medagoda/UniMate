import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Utensils, 
  Home, 
  Briefcase, 
  ArrowRight, 
  Users, 
  ChevronLeft
} from "lucide-react";

const UM_MultiStepLogin = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('role-selection');
  const [selectedRole, setSelectedRole] = useState(null);

  const loginOptions = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access your academic dashboard, food ordering, accommodation, and job opportunities',
      icon: GraduationCap,
      features: ['Academic Dashboard', 'Food Ordering', 'Accommodation Search', 'Job Applications'],
      signupRoute: '/stdregister',
      loginRoute: '/login-std',
      dashboardRoute: '/std-dash'
    },
    {
      id: 'food-provider',
      title: 'Food Provider',
      description: 'Manage your restaurant, orders, and delivery services for students',
      icon: Utensils,
      features: ['Order Management', 'Menu Control', 'Delivery Tracking', 'Analytics'],
      signupRoute: '/vendor/signup',
      loginRoute: '/vendor/login',
      dashboardRoute: '/vendor/dashboard'
    },
    {
      id: 'boarding-owner',
      title: 'Boarding Owner',
      description: 'List and manage your properties, handle bookings and tenant communications',
      icon: Home,
      features: ['Property Listings', 'Booking Management', 'Tenant Communication', 'Rent Tracking'],
      signupRoute: '/owner/signup',
      loginRoute: '/owner/login',
      dashboardRoute: '/owner/dashboard'
    },
    {
      id: 'hiring-manager',
      title: 'Hiring Manager',
      description: 'Post jobs, review applications, and manage recruitment for student positions',
      icon: Briefcase,
      features: ['Job Posting', 'Application Review', 'Candidate Management', 'Interview Scheduling'],
      signupRoute: '/hm/signup',
      loginRoute: '/hm/login',
      dashboardRoute: '/hmdash'
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentStep('login-form');
  };

  const handleBack = () => {
    setCurrentStep('role-selection');
    setSelectedRole(null);
  };

  const handleLogin = () => {
    navigate(selectedRole.loginRoute);
  };

  const renderRoleSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 max-w-4xl w-full relative z-10"
    >
      {/* Header */}
      <div className="text-center mb-10 relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-200 rounded-full opacity-60"></div>
        <div className="absolute -top-2 -right-6 w-6 h-6 bg-orange-300 rounded-full opacity-40"></div>
        <div className="absolute -bottom-2 left-1/4 w-4 h-4 bg-orange-400 rounded-full opacity-50"></div>
        
        {/* Main icon with enhanced styling */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mb-6 shadow-lg relative"
        >
          <Users className="w-10 h-10 text-white" />
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-orange-400 opacity-30 animate-pulse"></div>
        </motion.div>
        
        {/* Enhanced title with gradient text */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-3"
        >
          <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Welcome to UniMate
          </span>
        </motion.h1>
        
        {/* Enhanced subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed"
        >
          Your gateway to university life. Choose your role and unlock personalized experiences.
        </motion.p>
        
        {/* Decorative line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mt-4 rounded-full"
        ></motion.div>
      </div>

      {/* Login Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loginOptions.map((option, index) => {
          const IconComponent = option.icon;
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect(option)}
              className="group cursor-pointer bg-white/80 backdrop-blur-sm border-2 border-white/30 hover:border-orange-300/50 rounded-xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl text-left relative overflow-hidden"
            >
              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-100/0 group-hover:from-orange-50/50 group-hover:to-orange-100/30 transition-all duration-300"></div>
              {/* Icon */}
              <div className="relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 group-hover:bg-orange-200 mb-4 transition-colors duration-200">
                <IconComponent className="w-6 h-6 text-orange-600" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-200">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 group-hover:text-gray-700 transition-colors duration-200">
                  {option.description}
                </p>
                
                {/* Features */}
                <div className="space-y-1">
                  {option.features.slice(0, 2).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="relative z-10 flex justify-end mt-4">
                <ArrowRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );

  const renderLoginForm = () => {
    if (!selectedRole) return null;
    const IconComponent = selectedRole.icon;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full relative z-10"
      >
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Role Header */}
        <div className="text-center mb-8 relative">
          {/* Decorative elements */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-orange-200 rounded-full opacity-60"></div>
          <div className="absolute -top-1 -right-3 w-3 h-3 bg-orange-300 rounded-full opacity-40"></div>
          
          <motion.div 
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mb-4 shadow-lg"
          >
            <IconComponent className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-2xl font-bold mb-2"
          >
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              {selectedRole.title} Login
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-gray-600 text-sm"
          >
            {selectedRole.description}
          </motion.p>
        </div>

        {/* Continue to Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-3 mb-6"
        >
          <span>Continue to {selectedRole.title} Login</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => navigate(selectedRole.signupRoute)}
              className="text-orange-600 hover:text-orange-700 font-medium underline"
            >
              Sign up as {selectedRole.title}
            </button>
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative px-4 py-8 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23fef7f0;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23fff7ed;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23fed7aa;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg)'/%3E%3Cg opacity='0.1'%3E%3Cpath d='M0,200 Q480,100 960,200 T1920,200 L1920,0 L0,0 Z' fill='%23fc944c'/%3E%3Cpath d='M0,400 Q480,300 960,400 T1920,400 L1920,200 L0,200 Z' fill='%23fb923c'/%3E%3Cpath d='M0,600 Q480,500 960,600 T1920,600 L1920,400 L0,400 Z' fill='%23f97316'/%3E%3Cpath d='M0,800 Q480,700 960,800 T1920,800 L1920,600 L0,600 Z' fill='%23ea580c'/%3E%3Cpath d='M0,1000 Q480,900 960,1000 T1920,1000 L1920,800 L0,800 Z' fill='%23dc2626'/%3E%3Cpath d='M0,1080 Q480,980 960,1080 T1920,1080 L1920,1000 L0,1000 Z' fill='%23b91c1c'/%3E%3C/g%3E%3Cg opacity='0.05'%3E%3Ccircle cx='200' cy='150' r='80' fill='%23fc944c'/%3E%3Ccircle cx='800' cy='300' r='120' fill='%23fb923c'/%3E%3Ccircle cx='1400' cy='200' r='100' fill='%23f97316'/%3E%3Ccircle cx='300' cy='600' r='90' fill='%23ea580c'/%3E%3Ccircle cx='1200' cy='700' r='110' fill='%23dc2626'/%3E%3Ccircle cx='1600' cy='800' r='70' fill='%23b91c1c'/%3E%3C/g%3E%3Cg opacity='0.08'%3E%3Cpath d='M0,0 L100,0 L50,100 Z' fill='%23fc944c' transform='translate(100,200) rotate(30)'/%3E%3Cpath d='M0,0 L100,0 L50,100 Z' fill='%23fb923c' transform='translate(600,400) rotate(60)'/%3E%3Cpath d='M0,0 L100,0 L50,100 Z' fill='%23f97316' transform='translate(1200,300) rotate(90)'/%3E%3Cpath d='M0,0 L100,0 L50,100 Z' fill='%23ea580c' transform='translate(300,700) rotate(120)'/%3E%3Cpath d='M0,0 L100,0 L50,100 Z' fill='%23dc2626' transform='translate(1500,600) rotate(150)'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Gradient Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-orange-50/60 to-orange-100/70"></div>
      
      {/* Additional decorative elements with animation */}
      <motion.div 
        className="absolute top-10 left-10 w-32 h-32 bg-orange-200/20 rounded-full blur-xl"
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
      <motion.div 
        className="absolute top-20 right-20 w-24 h-24 bg-orange-300/30 rounded-full blur-lg"
        animate={{ 
          y: [0, 15, 0],
          x: [0, -8, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-20 left-1/4 w-40 h-40 bg-orange-400/20 rounded-full blur-2xl"
        animate={{ 
          y: [0, -25, 0],
          x: [0, 15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-10 right-1/3 w-28 h-28 bg-orange-500/25 rounded-full blur-xl"
        animate={{ 
          y: [0, 20, 0],
          x: [0, -12, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      ></motion.div>
      <AnimatePresence mode="wait">
        {currentStep === 'role-selection' && (
          <motion.div
            key="role-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderRoleSelection()}
          </motion.div>
        )}
        {currentStep === 'login-form' && (
          <motion.div
            key="login-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderLoginForm()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UM_MultiStepLogin;