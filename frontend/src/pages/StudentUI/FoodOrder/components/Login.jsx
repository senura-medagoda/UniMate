import React, { useState } from 'react';
import { useAppContext } from './context/context.jsx';
import { useToast } from '@/context/ToastContext';

const Login = () => {
  const { setshowUserLogin, setUser } = useAppContext();
  const { success: toastSuccess, error: toastError } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Close form when the "Close" button is clicked
  const closeLogin = () => setshowUserLogin(false);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to authenticate
    // For now, we'll just simulate a successful login
    if (formData.email && formData.password) {
      setUser({ email: formData.email }); // Set user data
      setshowUserLogin(false); // Close the modal
      toastSuccess('Login successful!');
    } else {
      toastError('Please fill in all fields');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-zinc-900 text-3xl font-medium">Login</h1>
        <button 
          onClick={closeLogin} 
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>
      
      <p className="text-zinc-500 text-sm mb-6">
        Please sign in to continue
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center w-full bg-white border border-zinc-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email id"
            className="bg-transparent text-zinc-600 placeholder-zinc-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        <div className="flex items-center w-full bg-white border border-zinc-300 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="bg-transparent text-zinc-600 placeholder-zinc-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full h-11 rounded-full text-white bg-[#fc944c] hover:bg-[#ffa669] transition-colors font-medium"
        >
          Login
        </button>

        <p className="text-zinc-500 text-sm text-center">
          Don't have an account?{' '}
          <button type="button" className="text-[#fc944c] hover:text-[#ffa669] font-medium">
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
