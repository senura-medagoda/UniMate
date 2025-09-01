import React from 'react';
import { assets } from '../assets/assets';

const IconBar = () => {
  return (
    <div className="flex justify-center items-center space-x-10 py-8">
      <div className="text-center p-4 border border-gray-200 rounded-lg shadow-md max-w-xs">
        <div className="mb-4">
          <img 
            src={assets.choose_food} 
            alt="Choose your food" 
            className="mx-auto w-12 h-12" 
          />
        </div>
        <h3 className="text-xl font-semibold text-[#fc944c]">Choose your food</h3>
        <p className="text-gray-600 font-light">Pick tasty meals crafted with fresh foods for work or home.</p>
      </div>

      <div className="text-center p-4 border border-gray-200 rounded-lg shadow-md max-w-xs">
        <div className="mb-4">
          <img 
            src={assets.order} 
            alt="Place your order" 
            className="mx-auto w-12 h-12" 
          />
        </div>
        <h3 className="text-xl font-semibold text-[#fc944c]">Place your order</h3>
        <p className="text-gray-600 font-light">Book clean water in safe jugs for you or your whole team.</p>
      </div>

      <div className="text-center p-4 border border-gray-200 rounded-lg shadow-md max-w-xs">
        <div className="mb-4">
          <img 
            src={assets.delivery} 
            alt="Wait for delivery" 
            className="mx-auto w-12 h-12" 
          />
        </div>
        <h3 className="text-xl font-semibold text-[#fc944c]">Wait for delivery</h3>
        <p className="text-gray-600 font-light">Relax—your meals and water will be brought right to your door.</p>
      </div>
    </div>
  );
}

export default IconBar;
