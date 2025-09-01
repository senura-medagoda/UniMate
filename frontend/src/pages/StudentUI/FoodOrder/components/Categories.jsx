import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets.js'; // Assuming images are in your assets folder

const Categories = () => {
  const navigate = useNavigate();

  // Example category data
  const categories = [
    { id: 1, name: 'Sunny side toast', price: '4.50', image: assets.menu_1, route: '/menu/sunny-side-toast' },
    { id: 2, name: 'Tempura sushi roll', price: '12.99', image: assets.menu_2, route: '/menu/sushi-roll' },
    { id: 3, name: 'Margherita pizza', price: '14.00', image: assets.menu_3, route: '/menu/pizza' },
    { id: 4, name: 'Cotton candy cocktail', price: '10.00', image: assets.menu_4, route: '/menu/cocktail' },
  ];

  // Handle category click to navigate to the respective page
  const handleCategoryClick = (route) => {
    navigate(route); // Navigate to the category page
  };

  // Handle the "View Full Menu" button click
  const handleViewMenuClick = () => {
    navigate('/menu');  // Navigate to the main menu or another destination
  };

  return (
    <div className="py-8 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8 animate-fade-in">
          Our Most Loved Dishes and Drinks
        </h2>
        
        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="flex flex-col items-center justify-between bg-white shadow-lg rounded-xl overflow-hidden hover:scale-105 transition-transform duration-500 hover:shadow-xl hover:bg-gray-50 p-4 cursor-pointer animate-fade-in"
              onClick={() => handleCategoryClick(category.route)} // Navigate on card click
            >
              {/* Image */}
              <img src={category.image} alt={category.name} className="w-full h-48 object-cover rounded-t-xl transition-transform duration-300 transform hover:scale-105" />
              
              {/* Content (title and price) */}
              <div className="flex flex-col items-center mt-4 text-center">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-gray-600 mt-2">${category.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Single View Menu Button at the bottom */}
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-2 bg-[#fc944c] hover:bg-[#ffa669] transition-all ease-in-out duration-300 text-white rounded-full animate-bounce-in"
            onClick={handleViewMenuClick}  // Navigate to the main menu or other page
          >
            View Full Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
