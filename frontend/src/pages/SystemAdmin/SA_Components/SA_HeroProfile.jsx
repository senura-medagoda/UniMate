import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Settings, 
  Edit, 
  Save, 
  X,
  BarChart3,
  Users,
  Briefcase,
  Utensils,
  Home,
  ShoppingCart,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity
} from 'lucide-react';

const SA_HeroProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@unimate.com',
    phone: '+94 77 123 4567',
    department: 'System Administration',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-20 14:30'
  });

  // Mock system statistics
  const systemStats = [
    { label: 'Total Students', value: '12,450', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Active Admins', value: '24', icon: Shield, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'Total Reports', value: '1,234', icon: BarChart3, color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ];

  const subsystemStats = [
    { name: 'Job Portal', icon: Briefcase, activeJobs: 156, totalApplications: 2340, color: 'bg-blue-500' },
    { name: 'Food Services', icon: Utensils, activeVendors: 23, totalOrders: 5670, color: 'bg-green-500' },
    { name: 'Accommodation', icon: Home, availableRooms: 89, totalBookings: 1234, color: 'bg-purple-500' },
    { name: 'Marketplace', icon: ShoppingCart, activeProducts: 456, totalSales: 7890, color: 'bg-orange-500' },
    { name: 'Study Materials', icon: BookOpen, totalMaterials: 234, downloads: 5670, color: 'bg-indigo-500' }
  ];

  const quickActions = [
    { name: 'View Reports', icon: BarChart3, color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Manage Admins', icon: Users, color: 'bg-green-500 hover:bg-green-600' },
    { name: 'System Settings', icon: Settings, color: 'bg-purple-500 hover:bg-purple-600' },
    { name: 'Security Logs', icon: Shield, color: 'bg-red-500 hover:bg-red-600' }
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Profile Info */}
              <div className="flex items-center gap-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {editData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </motion.div>

                <div className="space-y-2">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-transparent border-b-2 border-blue-500 focus:outline-none"
                      />
                    ) : (
                      editData.name
                    )}
                  </motion.h1>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-medium">System Administrator</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Last active: {editData.lastLogin}</span>
                  </motion.div>
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex gap-3"
              >
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </motion.div>
            </div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-transparent border-b border-blue-500 focus:outline-none w-full"
                    />
                  ) : (
                    <p className="font-medium">{editData.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-transparent border-b border-blue-500 focus:outline-none w-full"
                    />
                  ) : (
                    <p className="font-medium">{editData.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium">{editData.joinDate}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* System Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {systemStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Subsystem Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subsystem Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subsystemStats.map((subsystem, index) => (
                <motion.div
                  key={subsystem.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${subsystem.color} text-white`}>
                      <subsystem.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{subsystem.name}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Items</span>
                      <span className="font-semibold text-gray-900">
                        {subsystem.activeJobs || subsystem.activeVendors || subsystem.availableRooms || subsystem.activeProducts || subsystem.totalMaterials}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Activity</span>
                      <span className="font-semibold text-gray-900">
                        {subsystem.totalApplications || subsystem.totalOrders || subsystem.totalBookings || subsystem.totalSales || subsystem.downloads}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className={`${action.color} text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="flex items-center gap-3">
                    <action.icon className="w-6 h-6" />
                    <span className="font-medium">{action.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SA_HeroProfile;

