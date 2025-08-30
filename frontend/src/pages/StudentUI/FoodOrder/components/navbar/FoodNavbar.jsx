import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../context/context.jsx"; // ✅ Import fixed

const Navbar = () => {
  const { user, setUser, setshowUserLogin, navigate } = useAppContext();

  const logout = () => {
    setUser(null); // Log the user out
    navigate("/"); // Navigate back to home
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-10 py-4 border-b border-gray-300 bg-white relative transition-all">
      {/* Logo */}
      <NavLink to="/">
        <img className="h-10" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/shops">Shops</NavLink>

        {/* Search */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search Foods"
          />
        </div>

        {/* Cart */}
        <div className="relative cursor-pointer">
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#fc944c]"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <button onClick={ ()=> navigate("/cart")} className="absolute -top-2 -right-3 text-xs text-white bg-[#fc944c] w-[18px] h-[18px] rounded-full">
            3
          </button>
        </div>

        {/* Login / Profile / Logout */}
        {!user ? (
          <button
            onClick={() => setshowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-[#fc944c] hover:bg-[#ffa669] transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            {/* Profile Icon */}
            <img
              src={assets.profile}
              className="w-10 rounded-full cursor-pointer"
              alt="profile"
            />

            {/* Dropdown Menu with Hover Effect */}
            <div className=" absolute top-12 right-0 bg-white shadow-md py-2 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ul className="list-none">
                <li onClick={()=> navigate("my-profile")} className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                  My Profile
                </li>
                <li onClick={()=> navigate("my-orders")} className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                  My Orders
                </li>
                <li onClick={logout} className="py-2  mx-7 hover:bg-gray-100 cursor-pointer">
                  Logout
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="sm:hidden"
      >
        <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm md:hidden">
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/menu" onClick={() => setOpen(false)}>
            Menus
          </NavLink>
          {user && (
            <NavLink to="/shops" onClick={() => setOpen(false)}>
              Shops
            </NavLink>
          )}
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setshowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-[#fc944c] hover:bg-[#ffa669] transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-[#fc944c] hover:bg-[#ffa669] transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
