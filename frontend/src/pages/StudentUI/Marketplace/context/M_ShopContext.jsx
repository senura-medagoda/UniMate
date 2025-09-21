import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify"
import axios from 'axios'

import { useNavigate } from "react-router";

 export const ShopContext = createContext();

 const ShopContextProvider =(props)=> {

    const currency ='Rs';
    const delivery_fee =250;
    const [search,setSearch] =useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItem] =useState ({});
    const navigate= useNavigate();
    const [token,setToken] = useState('');
    const [products,setProducts] =useState([]);


   const addToCart = async (itemId, size) => {
    const product = products.find(p => p._id === itemId);

    // Only require size if the product has sizes
    if (product.sizes && product.sizes.length > 0 && !size) {
        toast.error('⚠️ Please select a product size before adding to cart');
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

    if (token) {
        try {
            await axios.post('http://localhost:5001/api/cart/MU_add',{itemId,size},{headers:{token}})
            toast.success(`🛒 ${product.name} added to cart successfully!`);
        } catch (error) {
            console.log(error);
            toast.error(`❌ Failed to add to cart: ${error.message}`);
        }
        
    } else {
        // Show success message even if not logged in (local cart)
        toast.success(`🛒 ${product.name} added to cart successfully!`);
    }
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

        if (token) {

            try {

                await axios.post('http://localhost:5001/api/cart/MU_update',{itemId,size,quantity},{headers:{token}})
                



            } catch (error) {
                 console.log(error);
            toast.error(`❌ Failed to update quantity: ${error.message}`);
            }
            
        }

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

    const getProductsData =async ()=>{

        try {
            const response = await axios.get('http://localhost:5001/api/product/M_List')
            if(response.data.success){
                setProducts(response.data.products)
            }
            else{
                toast.error(`❌ Failed to load products: ${response.data.message}`)
            }
        } catch (error) {
            console.log(error);
            toast.error(`❌ Network error: ${error.message}. Please refresh the page.`)
        }
    }

    const getUserCart =async (token) =>{

        try {

           const response = await axios.post('http://localhost:5001/api/cart/MU_get', {}, { headers: { token } })
            
                if (response.data.success) {
                    setCartItem(response.data.cartData)
                    
                }

        } catch (error) {
            console.log(error);
            toast.error(`❌ Failed to load cart: ${error.message}`);
        }

    }



    useEffect(()=>{
        getProductsData()
    },[])

    useEffect(()=>{
        if (!token && localStorage.getItem('token')) {
            const storedToken = localStorage.getItem('token');
            console.log('Found stored token:', storedToken);
            setToken(storedToken)
            getUserCart(storedToken)
        } else if (token) {
            console.log('Token already exists, fetching cart...');
            getUserCart(token)
        }
    },[token])

    const value ={
        products,currency,delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems,addToCart,getCartCount,updateQuantity,getCartAmount,navigate,
        setToken,token,setCartItem


    }

    return(
        <ShopContext.Provider value ={value}>
            {props.children}
        </ShopContext.Provider>
    )

 }
 export default ShopContextProvider;