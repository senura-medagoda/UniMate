import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  User, 
  Mail, 
  Lock, 
  Building2, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const HM_Signup = () => {
  const [formData, setFormData] = useState({
    hm_fname: '',
    hm_lname: '',
    hm_email: '',
    hm_password: '',
    confirmPassword: '',
    hm_company: '',
    hm_workID: '',
    hm_phone: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hm_fname.trim()) newErrors.hm_fname = 'First name is required';
    if (!formData.hm_lname.trim()) newErrors.hm_lname = 'Last name is required';
    if (!formData.hm_email.trim()) newErrors.hm_email = 'Email is required';
    if (!formData.hm_password) newErrors.hm_password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    if (!formData.hm_company.trim()) newErrors.hm_company = 'Company name is required';
    if (!formData.hm_workID.trim()) newErrors.hm_workID = 'Work ID is required';
    if (!formData.hm_phone.trim()) newErrors.hm_phone = 'Phone number is required';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Please accept the terms and conditions';

    if (formData.hm_email && !/\S+@\S+\.\S+/.test(formData.hm_email)) {
      newErrors.hm_email = 'Please enter a valid email address';
    }

    if (formData.hm_password) {
      if (formData.hm_password.length < 6) {
        newErrors.hm_password = 'Password must be at least 6 characters long';
      }
    }

    if (formData.hm_password && formData.confirmPassword && formData.hm_password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.hm_phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.hm_phone.replace(/\s/g, ''))) {
      newErrors.hm_phone = 'Please enter a valid phone number';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5001/api/hm/register', {
        hm_fname: formData.hm_fname,
        hm_lname: formData.hm_lname,
        hm_email: formData.hm_email,
        hm_password: formData.hm_password,
        hm_company: formData.hm_company,
        hm_workID: formData.hm_workID,
        hm_phone: formData.hm_phone
      });

      if (response.data.success) {
        toast.success('Registration successful! Please login to continue.');
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-3xl p-6 sm:p-8 max-w-2xl w-full"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Login</span>
        </motion.button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
            <Briefcase className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Hiring Manager Signup
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Create your account to start posting jobs and managing applications
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hm_fname" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="hm_fname"
                  name="hm_fname"
                  type="text"
                  required
                  value={formData.hm_fname}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.hm_fname ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
              </div>
              {errors.hm_fname && <p className="mt-1 text-sm text-red-600">{errors.hm_fname}</p>}
            </div>

            <div>
              <label htmlFor="hm_lname" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="hm_lname"
                  name="hm_lname"
                  type="text"
                  required
                  value={formData.hm_lname}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.hm_lname ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
              </div>
              {errors.hm_lname && <p className="mt-1 text-sm text-red-600">{errors.hm_lname}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="hm_email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="hm_email"
                name="hm_email"
                type="email"
                required
                value={formData.hm_email}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                  errors.hm_email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.hm_email && <p className="mt-1 text-sm text-red-600">{errors.hm_email}</p>}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hm_password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="hm_password"
                  name="hm_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.hm_password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.hm_password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.hm_password && <p className="mt-1 text-sm text-red-600">{errors.hm_password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Company and Work ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hm_company" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="hm_company"
                  name="hm_company"
                  type="text"
                  required
                  value={formData.hm_company}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.hm_company ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter company name"
                />
              </div>
              {errors.hm_company && <p className="mt-1 text-sm text-red-600">{errors.hm_company}</p>}
            </div>

            <div>
              <label htmlFor="hm_workID" className="block text-sm font-medium text-gray-700 mb-2">
                Work ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="hm_workID"
                  name="hm_workID"
                  type="text"
                  required
                  value={formData.hm_workID}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                    errors.hm_workID ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your work ID"
                />
              </div>
              {errors.hm_workID && <p className="mt-1 text-sm text-red-600">{errors.hm_workID}</p>}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="hm_phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="hm_phone"
                name="hm_phone"
                type="tel"
                required
                value={formData.hm_phone}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
                  errors.hm_phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.hm_phone && <p className="mt-1 text-sm text-red-600">{errors.hm_phone}</p>}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptTerms" className="text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-orange-600 hover:text-orange-500 underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-orange-600 hover:text-orange-500 underline">
                  Privacy Policy
                </a>
              </label>
              {errors.acceptTerms && <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Create Hiring Manager Account</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link
              to="/hm/login"
              className="text-orange-600 hover:text-orange-700 font-medium underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Back to Main Login */}
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Login Options
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default HM_Signup;
