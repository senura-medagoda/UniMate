// src/pages/landingComponents/UM_HeroLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Utensils, 
  Home, 
  Briefcase, 
  ArrowRight, 
  Users, 
  Shield, 
  BookOpen,
  ChevronLeft,
  Info
} from "lucide-react";

const UM_HeroLogin = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginOptions = [
    {
      id: 'student',
      title: 'Student',
      description: 'Access your academic dashboard, food ordering, accommodation, and job opportunities',
      icon: GraduationCap,
      color: 'emerald',
      route: '/login-std',
      features: ['Academic Dashboard', 'Food Ordering', 'Accommodation Search', 'Job Applications']
    },
    {
      id: 'food-provider',
      title: 'Food Provider',
      description: 'Manage your restaurant, orders, and delivery services for students',
      icon: Utensils,
      color: 'orange',
      route: '/food-login',
      features: ['Order Management', 'Menu Control', 'Delivery Tracking', 'Analytics']
    },
    {
      id: 'property-owner',
      title: 'Property Owner',
      description: 'List and manage your properties, handle bookings and tenant communications',
      icon: Home,
      color: 'blue',
      route: '/owner-login',
      features: ['Property Listings', 'Booking Management', 'Tenant Communication', 'Rent Tracking']
    },
    {
      id: 'hiring-manager',
      title: 'Hiring Manager',
      description: 'Post jobs, review applications, and manage recruitment for student positions',
      icon: Briefcase,
      color: 'purple',
      route: '/hm-login',
      features: ['Job Posting', 'Application Review', 'Candidate Management', 'Interview Scheduling']
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleLogin = async (route) => {
    setIsLoading(true);
    // Add a small delay for better UX
    setTimeout(() => {
      navigate(route);
      setIsLoading(false);
    }, 300);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  if (selectedRole) {
    const role = loginOptions.find(r => r.id === selectedRole);
    const IconComponent = role.icon;
    
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-3xl p-6 sm:p-8 max-w-2xl w-full"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Login Options</span>
          </motion.button>

          {/* Role Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              role.id === 'student' 
                ? 'bg-emerald-700' 
                : `bg-${role.color}-100`
            } mb-4`}>
              <IconComponent className={`w-8 h-8 ${
                role.id === 'student' 
                  ? 'text-white drop-shadow-sm' 
                  : `text-${role.color}-600`
              }`} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {role.title} Login
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {role.description}
            </p>
          </div>

          {/* Features List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">What you can do:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {role.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <div className={`w-2 h-2 rounded-full bg-${role.color}-500`} />
                  <span className="text-sm text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLogin(role.route)}
            disabled={isLoading}
            className={`w-full bg-${role.color}-600 hover:bg-${role.color}-700 disabled:bg-${role.color}-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <span>Continue to {role.title} Login</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 max-w-6xl w-full"
      >
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 mb-6"
          >
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Uni Mate
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Your centralized hub for university life. Choose your role below to access personalized services and dashboards tailored to your needs.
          </p>
        </div>

        {/* Login Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loginOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect(option.id)}
                className={`group cursor-pointer bg-gradient-to-br from-${option.color}-50 to-${option.color}-100 hover:from-${option.color}-100 hover:to-${option.color}-200 border border-${option.color}-200 hover:border-${option.color}-300 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleRoleSelect(option.id);
                  }
                }}
                aria-label={`Select ${option.title} login option`}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${
                  option.id === 'student' 
                    ? 'bg-emerald-700 group-hover:bg-emerald-800' 
                    : `bg-${option.color}-500 group-hover:bg-${option.color}-600`
                } mb-4 transition-colors duration-300`}>
                  <IconComponent className="w-6 h-6 text-white drop-shadow-sm" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                  {option.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-700 transition-colors">
                  {option.description}
                </p>

                {/* Arrow Indicator */}
                <div className="flex items-center text-gray-500 group-hover:text-gray-700 transition-colors">
                  <span className="text-sm font-medium">Select Role</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">University Verified</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Info className="w-5 h-5" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UM_HeroLogin;
