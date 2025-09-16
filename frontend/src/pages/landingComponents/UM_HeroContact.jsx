import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

function UM_HeroContact() {
  return (
    <div className="bg-gradient-to-b from-base-100 to-base-200 py-20">
      <div className="container mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-base-content/80">
            We’d love to hear from you! Whether you’re a student looking for support 
            or a provider interested in joining UniMate, reach out anytime.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Contact Info */}
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <ul className="space-y-4 text-base-content/90">
              <li>
                <span className="font-semibold">📧 Email:</span> support@unimate.com
              </li>
              <li>
                <span className="font-semibold">📞 Phone:</span> +94 77 123 4567
              </li>
              <li>
                <span className="font-semibold">📍 Address:</span> University Road, Colombo, Sri Lanka
              </li>
            </ul>

            {/* Socials */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="p-3 rounded-full bg-base-200 hover:bg-primary hover:text-white transition">
                  <FaFacebookF />
                </a>
                <a href="#" className="p-3 rounded-full bg-base-200 hover:bg-primary hover:text-white transition">
                  <FaTwitter />
                </a>
                <a href="#" className="p-3 rounded-full bg-base-200 hover:bg-primary hover:text-white transition">
                  <FaInstagram />
                </a>
                <a href="#" className="p-3 rounded-full bg-base-200 hover:bg-primary hover:text-white transition">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered w-full"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="input input-bordered w-full"
              />
              <textarea
                placeholder="Your Message"
                className="textarea textarea-bordered w-full min-h-[140px]"
              ></textarea>
              <button
                type="submit"
                className="btn btn-primary w-full py-3 text-lg font-medium rounded-xl"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UM_HeroContact