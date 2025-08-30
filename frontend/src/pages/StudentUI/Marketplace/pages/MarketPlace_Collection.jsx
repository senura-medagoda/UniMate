import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/M_ShopContext'
import { assets } from '../assets/assets';
import M_Title from '../components/M_Title';
import M_ProductItem from '../components/M_ProductItem';
import MarketPlace_Navbar from '../components/MarketPlace_Navbar';
import M_SearchBar from '../components/M_SearchBar'
import M_Footer from '../components/M_Footer';

const MarketPlace_Collection = () => {
  

  const {products,search,showSearch} =useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setShowFilterProducts] = useState([]);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState("relavent");

  // --- Toggle category ---
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  // --- Toggle subCategory ---
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
  };

  // --- Filter + Sort ---
  useEffect(() => {
  let filtered = [...products];

  //  Search filter
  if (showSearch && search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  //  Category filter
  if (category.length > 0) {
    filtered = filtered.filter(item => category.includes(item.category));
  }

  //  SubCategory filter
  if (subCategory.length > 0) {
    filtered = filtered.filter(item => subCategory.includes(item.subCategory));
  }

  //  Sorting
  if (sortOption === "low-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === "high-low") {
    filtered.sort((a, b) => b.price - a.price);
  }
  // "relevant" keeps original order

  setShowFilterProducts(filtered);
}, [products, search, showSearch, category, subCategory, sortOption]);


  return (
    <div>
    <div className='mr-10 ml-10'>
      <MarketPlace_Navbar/>
      <M_SearchBar/>
      
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Left Filters */}
      <div className='min-w-60'>
        <p
          onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2'
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filter */}
        <div className={`bg-gradient-to-br from-orange-50/90 to-yellow-50/90 backdrop-blur-md rounded-xl p-5 mt-6 border border-orange-200/40 shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-4 text-sm font-semibold text-orange-800 uppercase tracking-wide'>Categories</p>
          <div className='flex flex-col gap-3 text-sm'>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input 
                type="checkbox" 
                value="Electronics" 
                onChange={toggleCategory}
                className='w-4 h-4 text-orange-600 bg-white/60 border-orange-300 rounded focus:ring-orange-400 focus:ring-2'
              /> 
              <span className='text-gray-700 group-hover:text-orange-700 transition-colors font-medium'>Electronics</span>
            </label>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input 
                type="checkbox" 
                value="Furniture" 
                onChange={toggleCategory}
                className='w-4 h-4 text-orange-600 bg-white/60 border-orange-300 rounded focus:ring-orange-400 focus:ring-2'
              /> 
              <span className='text-gray-700 group-hover:text-orange-700 transition-colors font-medium'>Furniture</span>
            </label>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input 
                type="checkbox" 
                value="Clothing" 
                onChange={toggleCategory}
                className='w-4 h-4 text-orange-600 bg-white/60 border-orange-300 rounded focus:ring-orange-400 focus:ring-2'
              /> 
              <span className='text-gray-700 group-hover:text-orange-700 transition-colors font-medium'>Clothing</span>
            </label>
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className={`bg-gradient-to-br from-orange-50/90 to-yellow-50/90 backdrop-blur-md rounded-xl p-5 mt-4 border border-orange-200/40 shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-4 text-sm font-semibold text-orange-800 uppercase tracking-wide'>Type</p>
          <div className='flex flex-col gap-3 text-sm'>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input 
                type="checkbox" 
                value="Laptop" 
                onChange={toggleSubCategory}
                className='w-4 h-4 text-orange-600 bg-white/60 border-orange-300 rounded focus:ring-orange-400 focus:ring-2'
              /> 
              <span className='text-gray-700 group-hover:text-orange-700 transition-colors font-medium'>Laptop</span>
            </label>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input 
                type="checkbox" 
                value="Accessories" 
                onChange={toggleSubCategory}
                className='w-4 h-4 text-orange-600 bg-white/60 border-orange-300 rounded focus:ring-orange-400 focus:ring-2'
              /> 
              <span className='text-gray-700 group-hover:text-orange-700 transition-colors font-medium'>Accessories</span>
            </label>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input 
                type="checkbox" 
                value="Topwear" 
                onChange={toggleSubCategory}
                className='w-4 h-4 text-orange-600 bg-white/60 border-orange-300 rounded focus:ring-orange-400 focus:ring-2'
              /> 
              <span className='text-gray-700 group-hover:text-orange-700 transition-colors font-medium'>Topwear</span>
            </label>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input 
                type="checkbox" 
                value="Bottomwear" 
                onChange={toggleSubCategory}
                className='w-4 h-4 text-orange-600 bg-white/60 border-orange-300 rounded focus:ring-orange-400 focus:ring-2'
              /> 
              <span className='text-gray-700 group-hover:text-orange-700 transition-colors font-medium'>Bottomwear</span>
            </label>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input 
                type="checkbox" 
                value="Footwear" 
                onChange={toggleSubCategory}
                className='w-4 h-4 text-orange-600 bg-white/60 border-orange-300 rounded focus:ring-orange-400 focus:ring-2'
              /> 
              <span className='text-gray-700 group-hover:text-orange-700 transition-colors font-medium'>Footwear</span>
            </label>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <M_Title text1="ALL" text2="COLLECTIONS" />

          {/* Sort Dropdown */}
          <select
            className='border-2 border-gray-300 text-sm px-2'
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <M_ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
    </div>
    <M_Footer/>
    </div>
  )
}

export default MarketPlace_Collection