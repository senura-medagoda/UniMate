import React from 'react'
import M_Title from '../components/M_Title'
import { assets } from '../assets/assets'
import M_NewsletterBox from'../components/M_NewsletterBox'
import MarketPlace_Navbar from '../components/MarketPlace_Navbar'
import M_Footer from '../components/M_Footer'

const MarketPlace_About = () => {
  return (
    <div>
    <div className='mr-10 ml-10'>
      <MarketPlace_Navbar/>
      
      <div className='text-2xl text-center pt-8 border-t mt-20'>
        <M_Title text1={'ABOUT'} text2={'US'}/>

      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className="w-full  md:max-w-[450px]" src={assets.AB} alt="" />
   
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Your one-stop platform for everything you need as a university student. From textbooks to tech gear, 
              connect with fellow students and find amazing deals on campus essentials.</p>
        <p>Your one-stop platform for everything you need as a university student. From textbooks to tech gear, 
              connect with fellow students and find amazing deals on campus essentials.</p>
              <b className='text-gray-800'>Our Mission</b>
              <p>Your one-stop platform for everything you need as a university student. From textbooks to tech gear, 
              connect with fellow students and find amazing deals on campus essentials</p>

        </div>

      </div>

      <div className='text-2xl py-4'>
        <M_Title text1={'WHY'} text2={'CHOOSE US'}/>
        </div>
        <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>
            <p className='text-gray-600'>Your one-stop platform for everything you need as a university student. From textbooks to tech gear, 
              connect with fellow students and find amazing deals on campus essentials</p>

          </div>
           <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p className='text-gray-600'>YContrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old</p>

          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Student Service:</b>
            <p className='text-gray-600'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
          </div>
        </div>
        
        </div>
        <M_NewsletterBox/>
      <M_Footer/>
    </div>
  )
}

export default MarketPlace_About
