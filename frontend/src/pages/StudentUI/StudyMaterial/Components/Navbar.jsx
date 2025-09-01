import React, { useState } from "react";
import { Link } from "react-router-dom";


const Navbar = () => {


    return (
        <div class="bg-orange-900">
            <nav className="navbar flex justify-between px-10 py-6  shadow">
                <div className="logo">Logo</div>


          
                    <ul className="nav-links flex-col-4 gap-8 text-white flex">
                        <li><Link to="/">Study Materials</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/uploads">My Uploads</Link></li>
                        <li><img
                        src="https://via.placeholder.com/40 h-[20px] w-[20px]"
                        alt="profile"
                        className="profile-img"
                        onClick={() => setOpenProfile(!openProfile)}
                

                    /></li>
                    </ul>
                   

            </nav>
        </div>

    );
};

export default Navbar;
