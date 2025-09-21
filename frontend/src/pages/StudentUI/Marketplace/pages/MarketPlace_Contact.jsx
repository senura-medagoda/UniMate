import React from 'react'
import M_Title from '../components/M_Title'
import { assets } from '../assets/assets'
import M_NewsletterBox from '../components/M_NewsletterBox'
import MarketPlace_Navbar from '../components/MarketPlace_Navbar'

const MarketPlace_Contact = () => {
  return (
    <div className='mr-10 ml-10'>
      <MarketPlace_Navbar/>
      <div className='text-center text-2xl pt-10 border-t mt-20'>
        <M_Title text1={'CONTACT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contactussv} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>No:89, <br/>Main Street , Kandy</p>
          <p className='text-gray-500'> Tel :(+94) 76-257-8974<br/>Email :MarketPlace_ad@gmail.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at UniMate</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-orange-400 hover:text-white hover:border-white transition-all duration-200'>Explore Jobs</button>
        </div>
      </div>
      <M_NewsletterBox/>
      
    </div>
  )
}

export default MarketPlace_Contact
