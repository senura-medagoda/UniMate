import React, { useState } from 'react'
import { NavLink } from 'react-router'
import { assets } from '../assets/assets'

const M_SIdebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-16 right-4 z-50 p-2 rounded-md bg-white shadow-md border border-gray-200"
        aria-label="Toggle Menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
        </div>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40 
        w-64 bg-white shadow-lg lg:shadow-sm border-r border-gray-200
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        h-screen flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className='p-6 border-b border-gray-200 flex-shrink-0'>
          <div className="flex items-center justify-between">
            <h2 className='text-lg font-semibold text-gray-800'>Management</h2>
            {/* Close button for mobile */}
            <button
              onClick={closeSidebar}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
              aria-label="Close Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className='p-4 flex-1 overflow-y-auto'>
          <div className='space-y-2'>
            {/* Add Items */}
            <NavLink 
              to="/A_add"
              onClick={closeSidebar}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <img className='w-5 h-5 flex-shrink-0' src={assets.add_icon} alt="" />
              <span className='font-medium'>Add Items</span>
            </NavLink>

            {/* List Items */}
            <NavLink 
              to="/M_List"
              onClick={closeSidebar}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <img className='w-5 h-5 flex-shrink-0' src={assets.order_icon} alt="" />
              <span className='font-medium'>List Items</span>
            </NavLink>

            {/* Orders */}
            <NavLink 
              to="/Admin_Orders"
              onClick={closeSidebar}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <img className='w-5 h-5 flex-shrink-0' src={assets.order_icon} alt="" />
              <span className='font-medium'>Orders</span>
            </NavLink>

            {/* Analytics */}
            <NavLink 
              to="/M_analytics"
              onClick={closeSidebar}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <svg className='w-5 h-5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z'/>
                <path d='M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z'/>
              </svg>
              <span className='font-medium'>Analytics</span>
            </NavLink>

            {/* Settings */}
        
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className='p-4 border-t border-gray-200 flex-shrink-0'>
          <div className='flex items-center gap-3 px-4 py-2 text-sm text-gray-500'>
            <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0'>
              <span className='text-xs font-semibold'>A</span>
            </div>
            <div className='min-w-0'>
              <p className='font-medium text-gray-700 truncate'>Admin</p>
              <p className='text-xs truncate'>Manager</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default M_SIdebar