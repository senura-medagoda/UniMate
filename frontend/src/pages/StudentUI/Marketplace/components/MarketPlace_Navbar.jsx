import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { Link ,NavLink } from 'react-router'
import { ShopContext } from '../context/M_ShopContext';
import M_Footer from '../components/M_Footer'

const MarketPlace_Navbar = () => {
   const [visible,setVisible] =useState(false);
   const {setShowSearch ,getCartCount} = useContext(ShopContext);

  return (
    <div className='flex items-center justify-between py-5 font-medium relative z-50'>
     <Link to ='/M_home'><img src={assets.unilogo1} className='w-25 h-10' alt="" /></Link> 
     <ul className='hidden sm:flex gap-5 text-sm text-gray-700' >
      <NavLink to='/M_home' className='flex flex-col items-center gap-1' >
      <p>HOME</p>
        <hr className="w-2/4 border-none h-[2px] bg-gray-700 rounded-full hidden " />
      </NavLink>
      <NavLink to='/M_collection' className='flex flex-col items-center gap-1' >
        <p>COLLECTION</p>
        <hr className="w-2/4 border-none h-[2px] bg-gray-700 rounded-full hidden" />
      </NavLink>
      <NavLink to='/M_about' className='flex flex-col items-center gap-1' >
        <p>ABOUT</p>
        <hr className="w-2/4 border-none h-[2px] bg-gray-700 rounded-full hidden" />
      </NavLink>
      <NavLink to='/M_contact' className='flex flex-col items-center gap-1' >
        <p>CONTACT</p>
        <hr className="w-2/4 border-none h-[2px] bg-gray-700 rounded-full hidden" />
      </NavLink>
     

    </ul>
     <div className='flex items-center gap-6' >

      <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

      <div className='group relative' >
       <Link to ='/M_login'> <img src={assets.profile_icon} className='w-5 cursor-pointer' alt="" /></Link>
        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-[100]'>
          <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded-lg shadow-xl border border-gray-200' >
            <p className='cursor-pointer hover:text-black transition-colors duration-200' >My Profile</p>
            <p className='cursor-pointer hover:text-black transition-colors duration-200' >Orders</p>
            <p className='cursor-pointer hover:text-black transition-colors duration-200' >Logout</p>
          </div>
        </div>
      </div>
      <Link to='/M_cart'className='relative' >
      <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
 <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>    
      </Link>
      <img  onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />

    </div>
    {/*Side bar menu for smaller screen */}
 <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-[9999] shadow-2xl ${visible ? 'w-full' : 'w-0'}`}>

    <div className='flex flex-col text-gray-600'>
                <div className='flex items-center gap-4 p-3' onClick={()=>setVisible(false)}>
                    <img className='h-4 rotate-180' src={assets.dropdown_icon} alt=''/>
                    <p className=''>Back</p>
                </div>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `py-2 pl-6 border transition-colors duration-200 ${isActive ? 'sm:bg-transparent sm:text-gray-600 bg-orange-400 text-white' : 'hover:bg-gray-50'}`} to='/'>Home</NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `py-2 pl-6 border transition-colors duration-200 ${isActive ? 'sm:bg-transparent sm:text-gray-600 bg-orange-400 text-white' : 'hover:bg-gray-50'}`} to='/M_collection'>Collection</NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `py-2 pl-6 border transition-colors duration-200 ${isActive ? 'sm:bg-transparent sm:text-gray-600 bg-orange-400 text-white' : 'hover:bg-gray-50'}`} to='/M_about'>About</NavLink>
                <NavLink onClick={()=>setVisible(false)} className={({isActive}) => `py-2 pl-6 border transition-colors duration-200 ${isActive ? 'sm:bg-transparent sm:text-gray-600 bg-orange-400 text-white' : 'hover:bg-gray-50'}`} to='/M_contact'>Contact</NavLink>
               
        </div>




 </div>

    
        
      

    </div>
  )
}

export default MarketPlace_Navbar