import React, { useState } from 'react';

function UM_HeroRegister() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    uniId: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const universities = [
    'University of Technology',
    'State University',
    'City College',
    'Metropolitan University',
    'Technical Institute',
    'Science and Arts University'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    if (!formData.university) newErrors.university = 'University required';
    if (!formData.uniId.trim()) newErrors.uniId = 'Student ID required';
    if (!formData.password) newErrors.password = 'Password required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Agree to terms required';

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Min 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Need upper, lower, number';
      }
    }

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords mismatch';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      console.log('Form submitted:', formData);
      alert('Registration successful!');
    } else {
      setErrors(formErrors);
    }
  };

  const isFormValid = () => {
    return formData.agreeToTerms && 
           formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.university && 
           formData.uniId && 
           formData.password && 
           formData.confirmPassword && 
           formData.password === formData.confirmPassword &&
           formData.password.length >= 8 &&
           /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Compact Image Section */}
          <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white flex flex-col justify-center">
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-3">Join Unimate</h2>
              <p className="text-sm mb-4 opacity-90">
                Your university life platform for accommodation, food, jobs, and more.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Student accommodation</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Campus food ordering</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Job opportunities</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Form Section */}
          <div className="lg:w-3/5 p-6">
            <div className="text-center lg:text-left mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Student Registration</h1>
              <p className="text-gray-600 text-sm mt-1">Create your account in minutes</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm">First Name*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`input input-bordered input-sm ${errors.firstName ? 'input-error' : ''}`}
                    placeholder="John"
                  />
                  {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName}</span>}
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm">Last Name*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`input input-bordered input-sm ${errors.lastName ? 'input-error' : ''}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm">Email*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input input-bordered input-sm ${errors.email ? 'input-error' : ''}`}
                  placeholder="email@university.edu"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm">University*</span>
                  </label>
                  <select
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className={`select select-bordered select-sm ${errors.university ? 'select-error' : ''}`}
                  >
                    <option value="">Select University</option>
                    {universities.map((uni, index) => (
                      <option key={index} value={uni}>{uni}</option>
                    ))}
                  </select>
                  {errors.university && <span className="text-red-500 text-xs mt-1">{errors.university}</span>}
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm">Student ID*</span>
                  </label>
                  <input
                    type="text"
                    name="uniId"
                    value={formData.uniId}
                    onChange={handleInputChange}
                    className={`input input-bordered input-sm ${errors.uniId ? 'input-error' : ''}`}
                    placeholder="ST123456"
                  />
                  {errors.uniId && <span className="text-red-500 text-xs mt-1">{errors.uniId}</span>}
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm">Password*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`input input-bordered input-sm w-full ${errors.password ? 'input-error' : ''}`}
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password}</span>}
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm">Confirm Password*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`input input-bordered input-sm ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && <span className="text-red-500 text-xs mt-1">{errors.confirmPassword}</span>}
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start py-2">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary checkbox-sm mr-2"
                  />
                  <span className="label-text text-xs">
                    I agree to the <a href="#" className="link link-primary">Terms</a> and <a href="#" className="link link-primary">Privacy Policy</a>
                  </span>
                </label>
                {errors.agreeToTerms && <span className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</span>}
              </div>

              <div className="form-control mt-4">
                <button
                  type="submit"
                  className={`btn btn-primary btn-sm ${!isFormValid() ? 'btn-disabled' : ''}`}
                  disabled={!isFormValid()}
                >
                  Create Account
                </button>
              </div>

              <div className="text-center mt-3">
                <p className="text-gray-600 text-xs">
                  Already have an account? <a href="#" className="link link-primary">Sign in</a>
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