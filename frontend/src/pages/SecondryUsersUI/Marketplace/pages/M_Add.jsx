import React from 'react'
import Admin_Navbar from '../components/Admin_Navbar'
import M_SIdebar from '../components/M_SIdebar'

const M_Add = () => {
  return (
    <div className="min-h-screen bg-gray-50">
     
      <Admin_Navbar />
      
     
      <div className="flex">
        {/* Sidebar -  */}
        <div className="w-55 bg-white shadow-sm border-r border-gray-200">
          <M_SIdebar />
        </div>
        

        
        {/* Main Content - Flexible Width */}
        <div className="flex-1 p-6">
          {/* Your main content goes here */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Product</h1>
            {/* Add your form or content here */}
            <p className="text-gray-600">Your add product form will go here...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default M_Add