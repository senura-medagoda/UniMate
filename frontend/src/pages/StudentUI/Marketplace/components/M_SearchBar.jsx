import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/M_ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router';

const M_SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className="border-t border-b bg-gray-50 py-4 flex justify-center">
      <div className="flex items-center border border-gray-400 px-4 py-2 rounded-full w-3/4 sm:w-1/2 bg-white shadow-sm">
        
        {/* Search Input */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
          type="text"
          placeholder="Search products..."
        />

        {/* Search Icon */}
        <img
          className="w-4 h-4 ml-2 opacity-70 hover:opacity-100 cursor-pointer transition"
          src={assets.search_icon}
          alt="search"
        />

        {/* Close Button */}
        <img
          onClick={() => setShowSearch(false)}
          className="w-4 h-4 ml-3 cursor-pointer opacity-60 hover:opacity-100 transition"
          src={assets.cross_icon}
          alt="close"
        />
      </div>
    </div>
  ) : null;
}

export default M_SearchBar;
