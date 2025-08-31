import React, { useState, useContext, useEffect } from 'react';
import MarketPlace_Navbar from '../components/MarketPlace_Navbar';
import { ShopContext } from '../context/M_ShopContext';
import axios from 'axios'; // ⬅ use axios directly
import { toast } from 'react-toastify';

const MarketPlace_Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { setToken, navigate,token } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setErr('');
    setLoading(true);

    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(
          'http://localhost:5001/api/user/M_register',
          { name, email, password }
        );
        if (response.data?.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          navigate('/M_home');
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await axios.post(
          'http://localhost:5001/api/user/M_login',
          { email, password }
        );
        if (response.data?.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          navigate('/M_home');
        } else {
           toast.error(response.data.message)
        }
      }
    } catch (e) {
      setErr('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect (()=>{
    if (token) {
      navigate('/M_home')
    }

  },[token])

  return (
    <div className="mr-10 ml-10">
      <MarketPlace_Navbar />
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 mx-auto mt-14 mb-24 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>

        {currentState === 'Login' ? null : (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Name"
            required
          />
        )}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Email"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Password"
          required
        />

        {!!err && <p className="text-red-600 text-sm w-full">{err}</p>}

        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer">Forgot your password?</p>
          {currentState === 'Login' ? (
            <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">
              Create account
            </p>
          ) : (
            <p onClick={() => setCurrentState('Login')} className="cursor-pointer">
              Login Here
            </p>
          )}
        </div>

        <button
          disabled={loading}
          className={`bg-orange-400 text-white font-light px-8 py-2 mt-4 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Please wait…' : currentState === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default MarketPlace_Login;
