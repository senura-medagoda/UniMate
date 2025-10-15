import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../lib/axios.js'
import toast from "react-hot-toast"
import stdImg4 from './Images/std_img4.jpg'

function UM_HeroRegister() {
  const [s_fname, setFname] = useState("");
  const [s_lname, setLname] = useState("");
  const [s_email, setEmail] = useState("");
  const [s_password, setPass] = useState("");
  const [s_uni, setUni] = useState("");
  const [s_uniID, setUID] = useState("");
  const [confirmPassword, setConfPass] = useState("");
  const [agreeToTerms, setTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Update the corresponding state based on the input name
    switch (name) {
      case 'firstName':
        setFname(value);
        break;
      case 'lastName':
        setLname(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'university':
        setUni(value);
        break;
      case 'uniId':
        setUID(value);
        break;
      case 'password':
        setPass(value);
        break;
      case 'confirmPassword':
        setConfPass(value);
        break;
      case 'agreeToTerms':
        setTerms(checked);
        break;
      default:
        break;
    }

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!s_fname.trim()) newErrors.firstName = 'First name required';
    if (!s_lname.trim()) newErrors.lastName = 'Last name required';
    if (!s_email.trim()) newErrors.email = 'Email required';
    if (!s_uni.trim()) newErrors.university = 'University required';
    if (!s_uniID.trim()) newErrors.uniId = 'Student ID required';
    if (!s_password) newErrors.password = 'Password required';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm password';
    if (!agreeToTerms) newErrors.agreeToTerms = 'Agree to terms required';

    if (s_email && !/\S+@\S+\.\S+/.test(s_email)) {
      newErrors.email = 'Invalid email';
    }

    if (s_password) {
      if (s_password.length < 8) {
        newErrors.password = 'Min 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(s_password)) {
        newErrors.password = 'Need upper, lower, number';
      }
    }

    if (s_password && confirmPassword && s_password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords mismatch';
    }

    return newErrors;
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      try {
        await api.post("/students", {
          s_fname,
          s_lname,
          s_email,
          s_uni,
          s_uniID,
          s_password
        });
        toast.success("Registered Successfully!")
        navigate("/login-std")
      } catch (error) {
        console.error('Registration error:', error);
        // Handle error
      }
    } else {
      setErrors(formErrors);
    }
  };

  const isFormValid = () => {
    return agreeToTerms && 
           s_fname.trim() && 
           s_lname.trim() && 
           s_email.trim() && 
           s_uni.trim() && 
           s_uniID.trim() && 
           s_password && 
           confirmPassword && 
           s_password === confirmPassword &&
           s_password.length >= 8 &&
           /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(s_password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Image Section with std_img4.jpg */}
          <div 
            className="lg:w-2/5 relative bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${stdImg4})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-blue-900/70 to-purple-900/80"></div>
            
            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8 text-white flex flex-col justify-center h-full min-h-[300px] lg:min-h-full">
              <div className="text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-6">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-14 sm:w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  Join UniMate
                </h2>
                <p className="text-sm sm:text-base mb-6 opacity-95 leading-relaxed">
                  Your comprehensive university life platform for accommodation, food ordering, job opportunities, and academic success.
                </p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="bg-emerald-500/20 p-1 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Student accommodation</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="bg-emerald-500/20 p-1 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Campus food ordering</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="bg-emerald-500/20 p-1 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Job opportunities</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <div className="bg-emerald-500/20 p-1 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Academic support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:w-3/5 p-6 sm:p-8 lg:p-10">
            <div className="text-center lg:text-left mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Student Registration</h1>
              <p className="text-gray-600 text-sm sm:text-base">Create your account in minutes and start your university journey</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm font-medium">First Name*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={s_fname}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full ${errors.firstName ? 'input-error border-red-500' : 'border-gray-300 focus:border-emerald-500'} transition-colors`}
                    placeholder="John"
                  />
                  {errors.firstName && <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.firstName}
                  </span>}
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm font-medium">Last Name*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={s_lname}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full ${errors.lastName ? 'input-error border-red-500' : 'border-gray-300 focus:border-emerald-500'} transition-colors`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.lastName}
                  </span>}
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium">Email*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={s_email}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${errors.email ? 'input-error border-red-500' : 'border-gray-300 focus:border-emerald-500'} transition-colors`}
                  placeholder="email@university.edu"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm font-medium">University*</span>
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={s_uni}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full ${errors.university ? 'input-error border-red-500' : 'border-gray-300 focus:border-emerald-500'} transition-colors`}
                    placeholder="Enter your university name"
                  />
                  {errors.university && <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.university}
                  </span>}
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm font-medium">Student ID*</span>
                  </label>
                  <input
                    type="text"
                    name="uniId"
                    value={s_uniID}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full ${errors.uniId ? 'input-error border-red-500' : 'border-gray-300 focus:border-emerald-500'} transition-colors`}
                    placeholder="ST123456"
                  />
                  {errors.uniId && <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.uniId}
                  </span>}
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium">Password*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={s_password}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full pr-12 ${errors.password ? 'input-error border-red-500' : 'border-gray-300 focus:border-emerald-500'} transition-colors`}
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </span>}
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium">Confirm Password*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error border-red-500' : 'border-gray-300 focus:border-emerald-500'} transition-colors`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword}
                </span>}
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start py-2">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary checkbox-sm mr-3"
                  />
                  <span className="label-text text-xs sm:text-sm">
                    I agree to the <a href="#" className="link link-primary hover:link-hover">Terms</a> and <a href="#" className="link link-primary hover:link-hover">Privacy Policy</a>
                  </span>
                </label>
                {errors.agreeToTerms && <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.agreeToTerms}
                </span>}
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn w-full ${!isFormValid() ? 'btn-disabled bg-gray-300 text-gray-500 cursor-not-allowed' : 'btn-primary bg-emerald-600 hover:bg-emerald-700 text-white'} transition-all duration-200 font-medium py-3`}
                  disabled={!isFormValid()}
                >
                  {!isFormValid() ? 'Complete all fields to continue' : 'Create Account'}
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Already have an account? <a href="/login-std" className="link link-primary hover:link-hover font-medium">Sign in</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UM_HeroRegister;