import React, { useState } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'

const M_login = ({setToken}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      
      console.log('Attempting login with:', { email, password });
      
      const response = await axios.post("http://localhost:5001/api/user/M_admin", {
        email,
        password
      });
      
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      if (response.data.success) {
        console.log('Login successful, token:', response.data.token);
        
        // CRITICAL FIX: Store token in localStorage
        localStorage.setItem("adminToken", response.data.token);
        
        // Also call setToken if provided
        if (typeof setToken === 'function') {
          setToken(response.data.token);
        }
        
        toast.success('Login successful!');
        
        // Optional: Redirect to admin dashboard or desired page
        // You can use navigate here if you import useNavigate
        
      } else {
        console.log('Login failed:', response.data.message);
        toast.error(response.data.message || 'Login failed');
      }
      
    } catch (error) {
      console.log('Login error:', error);
      console.log('Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
        <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
              type="email"
              placeholder='your@email.com'
              required
            />
          </div>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
              type="password"
              placeholder='Enter your password'
              required
            />
          </div>
          <button
            className='mt-2 w-full py-2 px-4 rounded-md text-white bg-orange-400 hover:bg-orange-500'
            type='submit'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default M_login;