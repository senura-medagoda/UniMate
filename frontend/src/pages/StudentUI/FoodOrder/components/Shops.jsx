import React, { useEffect } from 'react';
import ShopCards from './ShopCards';
import { useAppContext } from './context/context';

const Shops = () => {
  const { Products } = useAppContext();  // Corrected 'products' to 'Products'

  useEffect(() => {
    console.log('Products:', Products);  // Ensure the data is correct in the console
  }, [Products]);


  return (
    <div className="px-10 py-6">
      <p className="text-2xl md:text-3xl font-semibold">Best Shops or Cafe</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
  {Products.filter((product) => product.inStock).slice(0, 5).map((product, index) => (
    <ShopCards key={index} product={product} /> 
        ))}
        {/* {Products.map((product) => (
          <ShopCards key={product.id} product={product} />  // Ensure we are passing the correct product object
        ))} */}
      </div>
    </div>
  );
};

export default Shops;
