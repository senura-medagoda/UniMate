import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router';

function JPHM_Nav() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar mx-auto max-w-6xl p-4">
        <div className="navbar-start">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            {isMenuOpen && (
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li><Link to ={"/hmdash"}><a>Dashboard</a></Link></li>
                <li><Link to ={"/myjobs"}><a>My Jobs</a></Link></li>
                <li><Link to ={"/applicants"}><a>Applications</a></Link></li>
                <li><Link to ={"/hmprofile"}><a>Profile</a></Link></li>
              </ul>
            )}
          </div>
          <a className=" btn-ghost normal-case text-xl text-primary">
            Unimate Jobs
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to ={"/hmdash"}><a className="font-medium">Dashboard</a></Link></li>
            <li><Link to ={"/myjobs"}><a className="font-medium">My Jobs</a></Link></li>
            <li><Link to ={"/applicants"}><a className="font-medium">Applications</a></Link></li>
            <li><Link to ={"/hmprofile"}><a className="font-medium">Profile</a></Link></li>
          </ul>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://placehold.co/400x400?text=U" alt="User" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
              <li><Link to ={"/hmprofile"}><a>Profile</a></Link></li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JPHM_Nav