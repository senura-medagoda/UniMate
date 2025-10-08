// Test script to verify backend API is working
import axios from 'axios';

const testAPI = async () => {
  try {
    console.log('Testing backend API...');
    
    // Test if backend is running
    const response = await axios.get('http://localhost:5001/api/owner/login', {
      method: 'POST',
      data: {
        email: 'test@example.com',
        password: 'testpassword'
      }
    });
    
    console.log('Backend is running and responding');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Backend API test failed:');
    console.error('Error:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
  }
};

testAPI();
