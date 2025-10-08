import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  User,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  Utensils,
  Home,
  ShoppingCart,
  BookOpen
} from 'lucide-react';

const SA_HeroAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Mock data - in real app, this would come from API
  const admins = [
    {
      id: 1,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@unimate.com',
      phone: '+94 77 123 4567',
      role: 'Job Portal Admin',
      subsystem: 'Job Portal',
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '2024-01-20'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      email: 'mike.johnson@unimate.com',
      phone: '+94 71 234 5678',
      role: 'Food Admin',
      subsystem: 'Food Services',
      status: 'active',
      joinDate: '2024-01-12',
      lastActive: '2024-01-19'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@unimate.com',
      phone: '+94 76 345 6789',
      role: 'Accommodation Admin',
      subsystem: 'Accommodation',
      status: 'inactive',
      joinDate: '2024-01-08',
      lastActive: '2024-01-15'
    }
  ];

  const subsystems = [
    { name: 'Job Portal', icon: <Briefcase className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
    { name: 'Food Services', icon: <Utensils className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
    { name: 'Accommodation', icon: <Home className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
    { name: 'Marketplace', icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' },
    { name: 'Study Materials', icon: <BookOpen className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600' }
  ];

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || admin.subsystem === filterRole;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200'
      case 'inactive': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'inactive': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  };

  const getSubsystemIcon = (subsystem) => {
    const subsystemData = subsystems.find(s => s.name === subsystem);
    return subsystemData ? subsystemData.icon : <Shield className="w-5 h-5" />;
  };

  const getSubsystemColor = (subsystem) => {
    const subsystemData = subsystems.find(s => s.name === subsystem);
    return subsystemData ? subsystemData.color : 'bg-gray-100 text-gray-600';
  };

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'active').length,
    inactive: admins.filter(a => a.status === 'inactive').length,
    subsystems: subsystems.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Admin <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Management</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Manage subsystem administrators, assign roles, and oversee admin permissions across all UniMate platforms.
            </p>
          </div>
          <motion.div
            className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Shield className="w-6 h-6 text-orange-600" />
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Admins</div>
              <div className="font-semibold text-gray-900">{stats.total}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Users className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Admins</h3>
            <p className="text-xs text-gray-500">All administrators</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <CheckCircle className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.active}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Active</h3>
            <p className="text-xs text-gray-500">Currently active</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <XCircle className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.inactive}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Inactive</h3>
            <p className="text-xs text-gray-500">Not active</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(252, 148, 76, 0.1)' }}>
                <Shield className="w-6 h-6" style={{ color: '#fc944c' }} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.subsystems}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Subsystems</h3>
            <p className="text-xs text-gray-500">Managed systems</p>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search admins by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Subsystems</option>
                {subsystems.map(subsystem => (
                  <option key={subsystem.name} value={subsystem.name}>{subsystem.name}</option>
                ))}
              </select>
              <button className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Add Admin Button */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Admin
          </button>
        </motion.div>

        {/* Admins Table */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-6 h-6" style={{ color: '#fc944c' }} />
              Admin List ({filteredAdmins.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subsystem</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdmins.map((admin, index) => (
                  <motion.tr 
                    key={admin.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                          <div className="text-xs text-gray-400">{admin.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getSubsystemColor(admin.subsystem)}`}>
                          {getSubsystemIcon(admin.subsystem)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{admin.role}</div>
                          <div className="text-xs text-gray-500">{admin.subsystem}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(admin.status)}`}>
                        {getStatusIcon(admin.status)}
                        {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(admin.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(admin.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SA_HeroAdmin;