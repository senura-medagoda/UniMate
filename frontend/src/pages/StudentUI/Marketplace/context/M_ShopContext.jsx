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
    const [favorites, setFavorites] = useState([]);
    const navigate= useNavigate();
    const [token,setToken] = useState('');
    const [products,setProducts] =useState([]);

    // Get student token from localStorage
    const getStudentToken = () => {
        return localStorage.getItem('studentToken') || '';
    };

    // Save cart to localStorage
    const saveCartToStorage = (cartData) => {
        try {
            localStorage.setItem('marketplaceCart', JSON.stringify(cartData));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    };

    // Save favorites to localStorage
    const saveFavoritesToStorage = (favoritesData) => {
        try {
            localStorage.setItem('marketplaceFavorites', JSON.stringify(favoritesData));
        } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
        }
    };

    // Load favorites from localStorage
    const loadFavoritesFromStorage = () => {
        try {
            const savedFavorites = localStorage.getItem('marketplaceFavorites');
            if (savedFavorites) {
                return JSON.parse(savedFavorites);
            }
        } catch (error) {
            console.error('Error loading favorites from localStorage:', error);
        }
        return [];
    };

    // Load cart from localStorage
    const loadCartFromStorage = () => {
        try {
            const savedCart = localStorage.getItem('marketplaceCart');
            if (savedCart) {
                return JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        }
        return {};
    };

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
    // Save cart to localStorage
    saveCartToStorage(cartData);

    const studentToken = getStudentToken();
    if (studentToken) {
        try {
            await axios.post('http://localhost:5001/api/cart/MU_add',{itemId,size},{headers:{token: studentToken}})
            toast.success(`🛒 ${product.name} added to cart successfully!`);
        } catch (error) {
            console.log('Cart API not available, using local cart:', error.message);
            // Still show success message even if API fails
            toast.success(`🛒 ${product.name} added to cart successfully!`);
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
        // Save cart to localStorage
        saveCartToStorage(cartData);

        const studentToken = getStudentToken();
        if (studentToken) {

            try {

                await axios.post('http://localhost:5001/api/cart/MU_update',{itemId,size,quantity},{headers:{token: studentToken}})
                



            } catch (error) {
                 console.log('Cart API not available, using local cart:', error.message);
            // Don't show error toast - cart works locally
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

    // Clear entire cart
    const clearCart = () => {
        // Clear localStorage first
        localStorage.removeItem('marketplaceCart');
        // Clear context state
        setCartItem({});
        // Force a small delay to ensure state updates
        setTimeout(() => {
            setCartItem({});
        }, 50);
        toast.success('Cart cleared successfully!');
    }

    // Force refresh cart state
    const refreshCart = () => {
        const savedCart = loadCartFromStorage();
        setCartItem(savedCart);
    }

    // Add to favorites
    const addToFavorites = async (productId) => {
        const product = products.find(p => p._id === productId);
        if (!product) {
            toast.error('Product not found');
            return;
        }

        if (favorites.includes(productId)) {
            toast.info('Product is already in favorites');
            return;
        }

        const newFavorites = [...favorites, productId];
        setFavorites(newFavorites);
        saveFavoritesToStorage(newFavorites);

        const studentToken = getStudentToken();
        if (studentToken) {
            try {
                await axios.post('http://localhost:5001/api/favorites/MU_add', { productId }, { headers: { token: studentToken } });
                toast.success(`❤️ ${product.name} added to favorites!`);
            } catch (error) {
                console.log('Favorites API not available, using local favorites:', error.message);
                toast.success(`❤️ ${product.name} added to favorites!`);
            }
        } else {
            toast.success(`❤️ ${product.name} added to favorites!`);
        }
    };

    // Remove from favorites
    const removeFromFavorites = async (productId) => {
        const product = products.find(p => p._id === productId);
        if (!product) {
            toast.error('Product not found');
            return;
        }

        const newFavorites = favorites.filter(id => id !== productId);
        setFavorites(newFavorites);
        saveFavoritesToStorage(newFavorites);

        const studentToken = getStudentToken();
        if (studentToken) {
            try {
                await axios.post('http://localhost:5001/api/favorites/MU_remove', { productId }, { headers: { token: studentToken } });
                toast.success(`💔 ${product.name} removed from favorites`);
            } catch (error) {
                console.log('Favorites API not available, using local favorites:', error.message);
                toast.success(`💔 ${product.name} removed from favorites`);
            }
        } else {
            toast.success(`💔 ${product.name} removed from favorites`);
        }
    };

    // Check if product is in favorites
    const isFavorite = (productId) => {
        return favorites.includes(productId);
    };

    // Get favorites count
    const getFavoritesCount = () => {
        return favorites.length;
    };

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

    const getUserCart =async (studentToken) =>{

        try {

           const response = await axios.post('http://localhost:5001/api/cart/MU_get', {}, { headers: { token: studentToken } })
            
                if (response.data.success) {
                    setCartItem(response.data.cartData)
                    // Also save to localStorage for persistence
                    saveCartToStorage(response.data.cartData);
                }

        } catch (error) {
            console.log('Cart API not available, loading from localStorage:', error.message);
            // Load cart from localStorage as fallback
            const savedCart = loadCartFromStorage();
            if (Object.keys(savedCart).length > 0) {
                setCartItem(savedCart);
                console.log('Loaded cart from localStorage as fallback:', savedCart);
            }
        }

    }



    useEffect(()=>{
        getProductsData()
    },[])

    useEffect(()=>{
        const studentToken = getStudentToken();
        if (studentToken) {
            console.log('Found student token:', studentToken);
            setToken(studentToken)
            // Try to load cart from API, but don't show errors if it fails
            getUserCart(studentToken)
        } else {
            // Load cart from localStorage if no token
            const savedCart = loadCartFromStorage();
            if (Object.keys(savedCart).length > 0) {
                setCartItem(savedCart);
                console.log('Loaded cart from localStorage:', savedCart);
            }
        }

        // Load favorites from localStorage
        const savedFavorites = loadFavoritesFromStorage();
        if (savedFavorites.length > 0) {
            setFavorites(savedFavorites);
            console.log('Loaded favorites from localStorage:', savedFavorites);
        }
    },[])

    // Listen for storage changes to sync cart across tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'marketplaceCart') {
                const newCart = e.newValue ? JSON.parse(e.newValue) : {};
                setCartItem(newCart);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const value ={
        products,currency,delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems,addToCart,getCartCount,updateQuantity,getCartAmount,clearCart,refreshCart,navigate,
        setToken,token: getStudentToken(),setCartItem,
        favorites,addToFavorites,removeFromFavorites,isFavorite,getFavoritesCount


    }

    return(
        <ShopContext.Provider value ={value}>
            {props.children}
        </ShopContext.Provider>
    )

 }
 export default ShopContextProvider;