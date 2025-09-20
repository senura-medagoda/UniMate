import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

function UM_Footer() {
  return (
    <footer className="bg-base-200 text-base-content mt-10">
      <div className="container mx-auto px-4 py-10">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Brand / About */}
          <div>
            <h2 className="text-xl font-bold mb-3">UniMate</h2>
            <p className="text-sm leading-6">
              A student-supportive platform that makes your university life easier.
              Find accommodation, order food, apply for jobs, share study materials, and
              buy/sell items in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="link link-hover">Home</a></li>
              <li><a href="/about" className="link link-hover">About</a></li>
              <li><a href="/services" className="link link-hover">Services</a></li>
              <li><a href="/contact" className="link link-hover">Contact</a></li>
            </ul>
          </div>

          {/* Contact / Social */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
            <p>Email: support@unimate.com</p>
            <div className="flex justify-center md:justify-start gap-4 mt-3">
              <a href="#" className="btn btn-ghost btn-circle text-xl">
                <FaFacebookF />
              </a>
              <a href="#" className="btn btn-ghost btn-circle text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="btn btn-ghost btn-circle text-xl">
                <FaInstagram />
              </a>
              <a href="#" className="btn btn-ghost btn-circle text-xl">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-base-300 mt-8 pt-4 text-center text-sm">
          © {new Date().getFullYear()} UniMate. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default UM_Footer