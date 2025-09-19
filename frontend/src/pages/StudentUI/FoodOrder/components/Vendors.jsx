import React from 'react';
import { assets } from '../assets/assets';

const Vendors = () => {
  return (
    <div className="vendors-container bg-white py-12 mt-[300px] animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Delicious food in popular restaurants</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 px-6 md:px-16 lg:px-24">
        {/* Vendor 1 */}
        <div className="vendor-logo-container flex justify-center items-center">
          <img src={assets.kfc} alt="KFC" className="w-24 h-12 object-contain" />
        </div>

        {/* Vendor 2 */}
        <div className="vendor-logo-container flex justify-center items-center">
          <img src={assets.pizza_hut} alt="Pizza Hut" className="w-24 h-12 object-contain" />
        </div>

        {/* Vendor 3 */}
        <div className="vendor-logo-container flex justify-center items-center">
          <img src={assets.mc} alt="McDonald's" className="w-24 h-12 object-contain" />
        </div>

        {/* Vendor 4 */}
        <div className="vendor-logo-container flex justify-center items-center">
          <img src={assets.kfc} alt="KFC" className="w-24 h-12 object-contain" />
        </div>

        {/* Vendor 5 */}
        <div className="vendor-logo-container flex justify-center items-center">
          <img src={assets.wendys} alt="Wendy's" className="w-24 h-12 object-contain" />
        </div>

        {/* Vendor 6 */}
        <div className="vendor-logo-container flex justify-center items-center">
          <img src={assets.hardees} alt="Hardee's" className="w-24 h-12 object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Vendors;
