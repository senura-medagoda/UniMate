import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:px-32 pt-11 rounded-xl">
      {/* Banner Image */}
      <img
        src={assets.banner}
        alt="banner"
        className="w-full hidden md:block rounded-xl animate-fade-in"
      />

      <div className="absolute inset-y-0 left-25 flex flex-col items-center justify-center pb-24 mt-[150px] animate-slide-up">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center max-w-2xl md:max-w-3xl lg:max-w-4xl animate-fade-in">
          Satisfy every craving with our exceptional online food delivery
          service
        </h1>

        {/* Button Section */}
        <div className="mt-6">
          <Link
            to="/menu"
            className="flex items-center gap-2 px-4 py-3 bg-[#fc944c] hover:bg-[#ff8636] transition-all transform hover:scale-105 rounded-full text-black cursor-pointer font-poppins font-semibold animate-bounce-in"
          >
            Order Now
            <img
              className="w-4 transition-transform duration-300 ease-in-out transform group-hover:translate-x-2"
              src={assets.arrow}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
