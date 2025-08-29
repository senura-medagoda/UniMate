import React, { useContext, useState } from 'react'
import M_Title from '../components/M_Title'
import M_CartTotal from '../components/M_CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/M_ShopContext'
import MarketPlace_Navbar from '../components/MarketPlace_Navbar'

const MarketPlace_PlaceOrder = () => {


  const [method,setMethod] =useState('cod');

  const {navigate} =useContext(ShopContext);

  return (
    <div className='mr-10 ml-10'>
      <MarketPlace_Navbar/>
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      
      {/* --------- Left side--- */}
      
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <M_Title text1={'DELIVERY'} text2={'INFORMATION'} />

        </div>
        <div className=' flex gap-3'>
          <input type="text" placeholder=' First name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input type="text" placeholder=' Last name' className='border border-gray-300 rounded py-1.5  px-3.5   w-full' />

        </div>
           <input type="email" placeholder='Email address' className='border bordder-gray-300 rounded py-1.5 px-3.5  w-full' />
            <input type="text" placeholder='Street' className='border bordder-gray-300 rounded py-1.5 px-3.5  w-full' />

            <div className=' flex gap-3'>
          <input type="text" placeholder=' City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input type="text" placeholder=' State' className='border border-gray-300 rounded py-1.5  px-3.5   w-full' />

        </div>
          <div className=' flex gap-3'>
          <input type="number" placeholder=' Zipcode' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
          <input type="text" placeholder=' District' className='border border-gray-300 rounded py-1.5  px-3.5   w-full' />

        </div>
         <input type="number" placeholder=' Phone' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
      </div>

      {/*----Right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <M_CartTotal/>
        </div>
        <div className='mt-12'>
          <M_Title text1={'PAYMENT'} text2={'METHOD'}/>

          {/*---payment method  */}
          <div className='flex gP-3 flex-col lg:flex-row'>
            <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img  className='h-5 mx-4' src={assets.stripe_logo} alt="" />

            </div>
             <div onClick={()=>setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img  className='h-5 mx-4' src={assets.razorpay_logo} alt="" />

            </div>
             <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full  ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p  className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button onClick={()=>navigate('/M_orders')} className='bg-orange-400 text-white px-16 py-3 text-sm'>PLACE ORDER</button>

          </div>

        </div>

      </div>


</div>
    </div>
  )
}

export default MarketPlace_PlaceOrder
