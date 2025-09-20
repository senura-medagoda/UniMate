import React from 'react'
import { assets} from '../assets/assets'

const Admin_Navbar = () => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 lg:px-8 h-16">
        {/* Logo */}
        <img 
          className="h-20 w-auto" 
          src={assets?.admin_uni} 
          alt="UniMate Admin" 
        />
        
        {/* Logout Button */}
        <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium">
          Logout
        </button>
      </div>
    </div>
  )
}

export default Admin_Navbar
