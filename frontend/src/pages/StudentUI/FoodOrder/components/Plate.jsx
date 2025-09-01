import React from 'react';
import { assets } from '../assets/assets'; 

const Plate = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-[12rem] font-bold text-center text-[#FC944C] animate-slide-text whitespace-nowrap">
          Are you craving delicious food?
        </h1>
      </div>

      <div className="absolute inset-0 flex justify-center items-center">
        <img
          src={assets.plate} 
          alt="plate"
          className="animate-rotate-plate w-64 h-64 object-cover rounded-full" 
        />
      </div>
    </div>
  );
};

export default Plate;
