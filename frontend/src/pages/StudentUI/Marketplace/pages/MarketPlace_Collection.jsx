import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/M_ShopContext'
import { assets } from '../assets/assets';
import M_Title from '../components/M_Title';
import M_ProductItem from '../components/M_ProductItem';
import MarketPlace_Navbar from '../components/MarketPlace_Navbar';
import M_SearchBar from '../components/M_SearchBar'
import M_Footer from '../components/M_Footer';
import M_ResellRequestForm from '../components/M_ResellRequestForm';
import M_ResellItem from '../components/M_ResellItem';

const MarketPlace_Collection = ({ user, setUser }) => {
  

  const {products,search,showSearch,navigate} =useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setShowFilterProducts] = useState([]);
  const [showResellForm, setShowResellForm] = useState(false);
  const [resellItems, setResellItems] = useState([]);
  const [filteredResellItems, setFilteredResellItems] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'resell'

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState("relavent");

  // Category and subcategory mapping
  const categorySubcategories = {
    "Electronics": [
      "Laptops", "Desktop Computers", "Mobile Phones", "Tablets", "Headphones & Audio", 
      "Chargers & Cables", "Computer Accessories", "Gaming Equipment", "Cameras", "Smart Watches"
    ],
    "Furniture": [
      "Study Tables", "Office Chairs", "Beds & Mattresses", "Wardrobes", "Bookshelves", 
      "Storage Units", "Desk Lamps", "Bean Bags", "Folding Chairs", "Bedside Tables"
    ],
    "Clothing & Fashion": [
      "Casual Wear", "Formal Wear", "Sports Wear", "Winter Clothing", "Summer Clothing", 
      "Footwear", "Accessories", "Bags & Backpacks", "Jewelry", "Watches"
    ],
    "Books & Stationery": [
      "Textbooks", "Reference Books", "Novels & Fiction", "Academic Papers", "Notebooks", 
      "Pens & Pencils", "Art Supplies", "Calculators", "Study Guides", "Exam Materials"
    ],
    "Hostel & Dorm Essentials": [
      "Kitchen Items", "Bedding & Linens", "Toiletries", "Cleaning Supplies", "Storage Boxes", 
      "Laundry Items", "Room Decor", "Study Lamps", "Extension Cords", "Mirrors"
    ],
    "Sports & Fitness": [
      "Gym Equipment", "Sports Clothing", "Balls & Equipment", "Fitness Accessories", 
      "Outdoor Gear", "Water Bottles", "Sports Shoes", "Yoga Mats", "Resistance Bands", "Dumbbells"
    ],
    "Transportation": [
      "Bicycles", "Scooters", "Motorcycles", "Car Accessories", "Helmets", 
      "Locks & Security", "Repair Tools", "Bike Lights", "Reflectors", "Bike Bags"
    ],
    "Entertainment": [
      "Board Games", "Video Games", "Musical Instruments", "Speakers", "Gaming Consoles", 
      "Movies & DVDs", "Books & Magazines", "Art & Crafts", "Puzzles", "Party Supplies"
    ],
    "Health & Wellness": [
      "First Aid", "Supplements", "Fitness Trackers", "Massage Tools", "Meditation Items", 
      "Health Monitors", "Personal Care", "Sleep Aids", "Stress Relief", "Wellness Books"
    ],
    "Academic Supplies": [
      "Lab Equipment", "Scientific Calculators", "Graphing Tools", "Protractors", "Compasses", 
      "Lab Coats", "Safety Equipment", "Research Materials", "Presentation Tools", "Academic Software"
    ]
  };

  // --- Toggle category ---
  const toggleCategory = (e) => {
    const selectedCategory = e.target.value;
    if (category.includes(selectedCategory)) {
      // Remove category and its subcategories
      setCategory(prev => prev.filter(item => item !== selectedCategory));
      setSubCategory(prev => {
        const categorySubcats = categorySubcategories[selectedCategory] || [];
        return prev.filter(subcat => !categorySubcats.includes(subcat));
      });
    } else {
      // Add category
      setCategory(prev => [...prev, selectedCategory]);
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

  // --- Clear subcategories when no categories are selected ---
  useEffect(() => {
    if (category.length === 0) {
      setSubCategory([]);
    }
  }, [category]);

  // --- Get available subcategories based on selected categories ---
  const getAvailableSubcategories = () => {
    if (category.length === 0) {
      return Object.values(categorySubcategories).flat();
    }
    return category.map(cat => categorySubcategories[cat] || []).flat();
  };

  // --- Get subcategories with their parent category info ---
  const getSubcategoriesWithParent = () => {
    if (category.length === 0) {
      return Object.entries(categorySubcategories)
        .flatMap(([parentCat, subcats]) => 
          subcats.map(subcat => ({ subcat, parentCat }))
        );
    }
    return category.flatMap(cat => 
      (categorySubcategories[cat] || []).map(subcat => ({ subcat, parentCat: cat }))
    );
  };

  // --- Clear all filters ---
  const clearAllFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortOption("relavent");
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

  // --- Filter Resell Items ---
  useEffect(() => {
    let filtered = [...resellItems];

    // Search filter for resell items
    if (showSearch && search) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter for resell items
    if (category.length > 0) {
      filtered = filtered.filter(item => category.includes(item.category));
    }

    // SubCategory filter for resell items
    if (subCategory.length > 0) {
      filtered = filtered.filter(item => subCategory.includes(item.subCategory));
    }

    // Sorting for resell items
    if (sortOption === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredResellItems(filtered);
  }, [resellItems, search, showSearch, category, subCategory, sortOption]);

  // Fetch resell items
  const fetchResellItems = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/resell/items');
      const data = await response.json();
      if (data.success) {
        setResellItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching resell items:', error);
    }
  };

  // Load resell items on component mount
  useEffect(() => {
    fetchResellItems();
  }, []);

  const handleResellSuccess = () => {
    fetchResellItems(); // Refresh the list after successful submission
    // Show success message and suggest checking My Requests
    setTimeout(() => {
      if (window.confirm('Request submitted successfully! Would you like to check your requests?')) {
        navigate('/M_my-requests');
      }
    }, 1000);
  };


  return (
    <div>
      <MarketPlace_Navbar user={user} setUser={setUser}/>
      <div className='mr-10 ml-10 pt-20'>
        <M_SearchBar/>
      
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Left Filters */}
      <div className='min-w-60'>
        <div className='flex items-center justify-between my-2'>
          <p
            onClick={() => setShowFilter(!showFilter)}
            className='text-xl flex items-center cursor-pointer gap-2'
          >
            FILTERS
            <img
              className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
              src={assets.dropdown_icon}
              alt=""
            />
          </p>
          {(category.length > 0 || subCategory.length > 0) && (
            <div className='flex items-center gap-2'>
              <span className='text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full'>
                {category.length + subCategory.length} active
              </span>
              <button
                onClick={clearAllFilters}
                className='text-sm text-orange-600 hover:text-orange-800 font-medium'
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className={`bg-gradient-to-br from-orange-50/90 to-yellow-50/90 backdrop-blur-md rounded-xl p-5 mt-6 border border-orange-200/40 shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-4 text-sm font-semibold text-orange-800 uppercase tracking-wide'>Categories</p>
          <div className='flex flex-col gap-3 text-sm'>
            {Object.keys(categorySubcategories).map((cat) => (
              <label key={cat} className='flex items-center gap-3 cursor-pointer group'>
                <input 
                  type="checkbox" 
                  value={cat} 
                  onChange={toggleCategory}
                  checked={category.includes(cat)}
                  className='w-4 h-4 text-orange-600 bg-white/60 border-orange-300 rounded focus:ring-orange-400 focus:ring-2'
                /> 
                <span className='text-gray-700 group-hover:text-orange-700 transition-colors font-medium'>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className={`bg-gradient-to-br from-orange-50/90 to-yellow-50/90 backdrop-blur-md rounded-xl p-5 mt-4 border border-orange-200/40 shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-4 text-sm font-semibold text-orange-800 uppercase tracking-wide'>
            Subcategories
            {category.length > 0 && (
              <span className='text-xs text-orange-600 ml-2'>
                (from selected categories)
              </span>
            )}
          </p>
          <div className='flex flex-col gap-3 text-sm max-h-64 overflow-y-auto'>
            {getSubcategoriesWithParent().map(({ subcat, parentCat }) => (
              <label key={subcat} className='flex items-center gap-3 cursor-pointer group'>
                <input 
                  type="checkbox" 
                  value={subcat} 
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(subcat)}
                  className='w-4 h-4 text-orange-600 bg-white/60 border-orange-300 rounded focus:ring-orange-400 focus:ring-2'
                /> 
                <div className='flex flex-col'>
                  <span className='text-gray-700 group-hover:text-orange-700 transition-colors font-medium'>{subcat}</span>
                  {category.length > 0 && (
                    <span className='text-xs text-gray-500'>{parentCat}</span>
                  )}
                </div>
              </label>
            ))}
          </div>
          {category.length === 0 && (
            <p className='text-xs text-gray-500 mt-2 italic'>
              Select a category to see its subcategories
            </p>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>
        {/* Tabs */}
        <div className='flex justify-between items-center mb-6'>
          <div className='flex space-x-4'>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('resell')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'resell'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resell Items
            </button>
          </div>

          {/* Resell Request Button */}
          <button
            onClick={() => setShowResellForm(true)}
            className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium'
          >
            Submit Resell Request
          </button>
        </div>

        {activeTab === 'products' ? (
          <>
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
          </>
        ) : (
          <>
            <div className='text-base sm:text-2xl mb-4'>
              <M_Title text1="RESELL" text2="ITEMS" />
            </div>

            {/* Resell Items Grid */}
            {filteredResellItems.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredResellItems.map((item, index) => (
                  <M_ResellItem key={index} item={item} />
                ))}
              </div>
            ) : resellItems.length > 0 ? (
              <div className='text-center py-12'>
                <div className='text-gray-400 mb-4'>
                  <svg className='w-16 h-16 mx-auto' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' />
                  </svg>
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>No resell items match your filters</h3>
                <p className='text-gray-500'>Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className='text-center py-12'>
                <div className='text-gray-400 mb-4'>
                  <svg className='w-16 h-16 mx-auto' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z' clipRule='evenodd' />
                  </svg>
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>No resell items available</h3>
                <p className='text-gray-500'>Be the first to submit a resell request!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </div>
    
    {/* Resell Request Form Modal */}
    {showResellForm && (
      <M_ResellRequestForm
        onClose={() => setShowResellForm(false)}
        onSuccess={handleResellSuccess}
        user={user}
      />
    )}
    
      <M_Footer/>
    </div>
  )
}

export default MarketPlace_Collection