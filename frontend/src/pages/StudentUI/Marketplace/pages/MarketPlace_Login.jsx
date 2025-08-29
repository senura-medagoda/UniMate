import React, { useState } from 'react'
import MarketPlace_Navbar from '../components/MarketPlace_Navbar';

const MarketPlace_Login = () => {
  const [currentState, setCurrentState] = useState('Sign up');
  const onSubmitHandler = async(event)=>{
        event.preventDefault();
  }

  return (
    <div className='mr-10 ml-10'>
      <MarketPlace_Navbar/>
   <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 mx-auto mt-14 mb-24 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
                <p className="prata-regular text-3xl">{currentState}</p>
                <hr className="border-none h-[1.5px] w-8 bg-gray-800"/>
      </div>
             {currentState === 'Login' ? '' : <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />} 
              <input type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
              <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <p className='cursor-pointer'>Forgot your password?</p>
          {
            currentState ==='Login'
            ? <p  onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
            : <p onClick={()=>setCurrentState('Login')}  className='cursor-pointer'>Login Here</p>
          }

        </div>
        <button className='bg-orange-400 text-white font-light px-8 py-2 mt-4'>{currentState ==='Login' ? 'Sign In' : 'Sign Up'}</button>
     
      </form>
</div>

  )
}

export default MarketPlace_Login
