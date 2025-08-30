// components/UM_HeroLoginStd.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UM_HeroLoginStd = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call for student login
      console.log('Student login attempt:', { ...formData, rememberMe });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store authentication data
      if (rememberMe) {
        localStorage.setItem('student_rememberMe', 'true');
      }
      
      // Redirect to student dashboard
      navigate('/student/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Visual Hero Content */}
        <div className="text-center lg:text-left">
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral mb-4">
            Welcome Back,{' '}
            <span className="text-primary">Scholar!</span>
          </h2>
          
          <p className="text-lg text-neutral/70 mb-6 max-w-md mx-auto lg:mx-0">
            Access your student portal and manage your campus life in one place.
          </p>

          {/* Features List */}
          <div className="space-y-3 mb-6">
            {['🏠 Find accommodation', '🍔 Order campus meals', '💼 Discover job opportunities', '📚 Access study materials'].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-lg">{item.split(' ')[0]}</span>
                <span className="text-neutral">{item.substring(2)}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-6 justify-center lg:justify-start">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">10K+</div>
              <div className="text-xs text-neutral/60">Students</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">24/7</div>
              <div className="text-xs text-neutral/60">Support</div>
            </div>
          </div>
        </div>

        {/* Right Side - Compact Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-neutral mb-2">Student Login</h3>
            <p className="text-sm text-neutral/60">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-neutral mb-1">
                University Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.id@university.edu"
                className="input input-bordered w-full input-sm"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-neutral mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="input input-bordered w-full input-sm pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral/60 hover:text-neutral text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="cursor-pointer flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox checkbox-primary checkbox-xs mr-2"
                />
                Remember me
              </label>
              <a href="#" className="text-primary hover:underline text-xs">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary w-full btn-sm ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-4 text-xs">OR</div>

          {/* Google Sign In */}
          <button className="btn btn-outline w-full btn-xs mb-4">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-xs text-neutral/60">
              New student?{' '}
              <a href="/student/register" className="text-primary font-semibold hover:underline">
                Create account
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UM_HeroLoginStd;