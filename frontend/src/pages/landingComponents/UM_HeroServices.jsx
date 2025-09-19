import React from 'react'
import { FaUtensils, FaBriefcase, FaHome, FaBook, FaShoppingBag } from "react-icons/fa";

function UM_HeroServices() {
  return (
    <div className="bg-base-100 text-base-content py-8">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Services We Provide for Students
        </h1>
        <p className="max-w-2xl mx-auto text-lg mb-12">
          UniMate is your one-stop platform designed to make university life easier.  
          Explore the services we offer to support students in every aspect of their academic journey.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          
          <div className="p-6 rounded-2xl shadow-md bg-base-200 hover:shadow-lg transition">
            <FaUtensils className="text-4xl mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-xl">Food Delivery</h3>
            <p className="text-sm mt-2">Order meals from local providers directly to your hostel or university.</p>
          </div>

          <div className="p-6 rounded-2xl shadow-md bg-base-200 hover:shadow-lg transition">
            <FaBriefcase className="text-4xl mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-xl">Job Portal</h3>
            <p className="text-sm mt-2">Find internships, part-time and full-time opportunities tailored for students.</p>
          </div>

          <div className="p-6 rounded-2xl shadow-md bg-base-200 hover:shadow-lg transition">
            <FaHome className="text-4xl mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-xl">Accommodation</h3>
            <p className="text-sm mt-2">Browse and book safe, affordable accommodation near your campus.</p>
          </div>

          <div className="p-6 rounded-2xl shadow-md bg-base-200 hover:shadow-lg transition">
            <FaBook className="text-4xl mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-xl">Study Material</h3>
            <p className="text-sm mt-2">Access past papers, notes, and resources shared by fellow students.</p>
          </div>

          <div className="p-6 rounded-2xl shadow-md bg-base-200 hover:shadow-lg transition">
            <FaShoppingBag className="text-4xl mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-xl">Student Marketplace</h3>
            <p className="text-sm mt-2">Buy and sell items like books, electronics, and essentials within your campus.</p>
          </div>
        </div>

        {/* Secondary Users Section */}
        <div className="bg-base-200 p-8 rounded-2xl shadow-md max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Be a Part of UniMate</h2>
          <p className="text-md mb-6">
            Are you a <span className="font-semibold">Food Provider</span>, <span className="font-semibold">Property Owner</span>, or 
            <span className="font-semibold"> Hiring Manager</span>?  
            Join UniMate and start offering your services to thousands of students today.
          </p>
          <button className="btn btn-primary px-8">
            Register as a Service Provider
          </button>
        </div>
      </div>
    </div>
  )
}

export default UM_HeroServices