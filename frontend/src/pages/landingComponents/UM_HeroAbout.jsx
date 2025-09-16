import React from 'react'
import { FaUtensils, FaBriefcase, FaHome, FaBook, FaShoppingBag } from "react-icons/fa";

function UM_HeroAbout() {
  return (
    <div className="bg-base-100 text-base-content py-16">
      <div className="container mx-auto px-4 text-center md:text-left max-w-6xl">
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">About UniMate</h1>
        
        {/* Long Description */}
        <p className="text-lg leading-7 mb-10 text-justify">
          UniMate is an all-in-one, student-focused digital platform built to simplify and enhance 
          every aspect of university life. The system is carefully designed to be safe and reliable, 
          ensuring that only student-specific services are provided, protecting both students and 
          service providers in the process. Our goal is to create a trusted environment where students 
          can access everything they need for their university journey without the stress of juggling 
          multiple apps or platforms. <br /><br />
          The platform brings together five key services into a single, unified system. Students can 
          order food from reliable providers and have it delivered to their hostels or university; 
          search and apply for internships, part-time roles, and job opportunities through the job 
          portal; browse and book safe accommodation options verified by property owners; access a 
          growing library of study materials including lecture notes and past papers; and finally, 
          buy and sell second-hand items such as books, electronics, and other essentials via the 
          student marketplace. <br /><br />
          In addition to student benefits, UniMate also welcomes trusted secondary users such as food 
          providers, property owners, and hiring managers to become part of the system. By registering 
          with UniMate, these service providers gain direct access to a vibrant student community, 
          enabling them to grow their services while ensuring that students receive tailored, 
          student-specific solutions. Every feature is built with security and user experience at 
          the forefront, making UniMate not just a platform, but a digital companion for every 
          university student.
        </p>

        {/* Vision */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-center">Our Vision</h2>
          <p className="text-md leading-7">
            To become the leading student-supportive platform that empowers university students 
            worldwide by providing safe, reliable, and accessible digital services that 
            make academic life smoother, more connected, and more productive.
          </p>
        </div>

        {/* Mission */}
        <div>
          <h2 className="text-2xl font-bold mb-3 text-center">Our Mission</h2>
          <p className="text-md leading-7">
            Our mission is to simplify university life by creating a secure, all-in-one digital 
            ecosystem for students. We aim to connect students with essential services such as 
            food, jobs, accommodation, study materials, and marketplaces, while also enabling 
            trusted service providers to support student needs directly. By combining safety, 
            accessibility, and innovation, UniMate ensures that students can focus on what truly 
            matters – their education and personal growth.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UM_HeroAbout