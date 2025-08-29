import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify"


import { useNavigate } from "react-router";

 export const ShopContext = createContext();

 const ShopContextProvider =(props)=> {

    const currency ='Rs';
    const delivery_fee =250;
    const [search,setSearch] =useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItem] =useState ({});
    const navigate= useNavigate();


   const addToCart = async (itemId, size) => {
    const product = products.find(p => p._id === itemId);

    // Only require size if the product has sizes
    if (product.sizes && product.sizes.length > 0 && !size) {
        toast.error('Select Product Size');
        return;
    }

    let cartData = structuredClone(cartItems);

    // If product has sizes
    if (product.sizes && product.sizes.length > 0) {
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
    } else {
        // Product has no sizes, store with a default key
        if (cartData[itemId]) {
            cartData[itemId]["default"] += 1;
        } else {
            cartData[itemId] = { default: 1 };
        }
    }

    setCartItem(cartData);
};

    const getCartCount=()=>{

        let totalCount =0;

        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] >0) {
                        totalCount += cartItems[items][item];
                        
                    }
                    
                } catch (error) {


                    
                }

            }
        }
        return totalCount;

    }

    const updateQuantity = async(itemId,size,quantity)=>{

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] =quantity;


        setCartItem(cartData)

    }

    const getCartAmount =  ()=>
    {
        let totalAmount =0;
        for(const items in cartItems){
            let itemInfor =products.find((product)=>product._id === items);
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfor.price * cartItems[items][item];
                        
                    }
                    
                } catch (error) {
                    
                }
            }

        }
        return totalAmount;
    }



    const value ={
        products,currency,delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems,addToCart,getCartCount,updateQuantity,getCartAmount,navigate


    }

    return(
        <ShopContext.Provider value ={value}>
            {props.children}
        </ShopContext.Provider>
    )

 }
 export default ShopContextProvider;