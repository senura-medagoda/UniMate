import React from 'react';
import { assets } from '../assets/assets'; 

const Plate = () => {
  return (
    <div className="relative h-80 sm:h-96 md:h-[28rem] lg:h-[32rem] xl:h-[36rem]">
      <div className="absolute inset-0 flex  justify-center">
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold text-center text-[#FC944C] animate-slide-text whitespace-nowrap px-4">
          Are you craving delicious food?
        </h1>
      </div>

      <div className="absolute inset-0 flex justify-center">
        <img
          src={assets.plate} 
          alt="plate"
          className="animate-rotate-plate w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 object-cover rounded-full" 
        />
      </div>
    </div>
  );
};

export default Plate;
