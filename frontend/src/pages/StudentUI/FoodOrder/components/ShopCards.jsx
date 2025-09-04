import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from './context/context';

const ShopCards = ({ product }) => {
  const { cartItems, addToCart, removeFromCart, currency } = useAppContext();  // Use context for cart operations

  // Get the count from cartItems, default to 0 if product isn't in the cart
  const count = cartItems[product._id] || 0;

  return (
    product && (
      <div className="border border-gray-500/20 rounded-md md:px-4 px-3 py-10 bg-white min-w-48 max-w-full w-full">
        <div className="group cursor-pointer flex items-center justify-center px-2">
          <img
            className="group-hover:scale-105 transition max-w-26 md:max-w-36 rounded-lg"
            src={product.image[0]}
            alt={product.name}
          />
        </div>
        <div className="text-gray-500/60 text-sm">
          <p>{product.category}</p>
          <p className="text-gray-700 font-medium text-lg truncate w-full">
            {product.name}
          </p>
          <div className="flex items-center gap-0.5">
            {Array(5).fill("").map((_, i) => (
              <img key={i} className="md:w-3 w-3" src={i < 4 ? assets.star : assets.star_empty} alt="star" />
            ))}
            <p>({4})</p>
          </div>
          <div className="flex items-end justify-between mt-3">
            <p className="md:text-xl text-base font-medium text-indigo-500">
              {currency} {product.offerPrice}
              <span className="text-gray-500/60 md:text-sm text-xs line-through">
                {currency} {product.price}
              </span>
            </p>
            <div onClick={(e) => {e.stopPropagation();}} className="text-indigo-500">
              {!count ? (
                <button
                  className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 md:w-[80px] w-[64px] h-[34px] rounded text-indigo-600 font-medium cursor-pointer"
                  onClick={() => addToCart(product._id)} 
                >
                  <img src={assets.cart} alt="" className="w-4 h-4" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                  <button
                    onClick={() => removeFromCart(product._id)}  // Use context method to remove from cart
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">{count}</span>
                  <button
                    onClick={() => addToCart(product._id)}  // Use context method to add to cart
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ShopCards;
