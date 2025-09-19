import { Children,createContext, useContext,useEffect,useState,} from "react";
import { useNavigate } from "react-router-dom";
import { dummy } from "../../assets/assets.js";
import { useToast } from "@/context/ToastContext";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = "Rs.";
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setshowUserLogin] = useState(false);
  const [Products, setProducts] = useState([]);
  const [shops, setShops] = useState([
    // Fallback shop data for development
    {
      _id: 'shop1',
      businessName: 'Pizza Palace',
      cuisineType: 'Italian',
      address: { city: 'New York', street: '123 Main St' },
      averageRating: 4.5,
      totalReviews: 120,
      image: 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=🍕',
      description: 'Authentic Italian pizza and pasta'
    },
    {
      _id: 'shop2',
      businessName: 'Burger House',
      cuisineType: 'American',
      address: { city: 'Los Angeles', street: '456 Oak Ave' },
      averageRating: 4.2,
      totalReviews: 85,
      image: 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=🍔',
      description: 'Classic American burgers and fries'
    },
    {
      _id: 'shop3',
      businessName: 'Sushi Express',
      cuisineType: 'Japanese',
      address: { city: 'Chicago', street: '789 Pine St' },
      averageRating: 4.7,
      totalReviews: 95,
      image: 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=🍣',
      description: 'Fresh sushi and Japanese cuisine'
    }
  ]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cartItems, setCartItems] = useState(() => {
    // Load cart items from localStorage on initialization
    try {
      const savedCartItems = localStorage.getItem('cartItems');
      return savedCartItems ? JSON.parse(savedCartItems) : {};
    } catch (error) {
      console.error('Error loading cart items from localStorage:', error);
      return {};
    }
  });

  const fetchProducts = async () => {
    try {
      setProducts(dummy);
    } catch (error) {
      toastError("Failed to load menu items");
    }
  };

  const fetchShops = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5001/api/shop/all');
      const data = await response.json();
      
      if (data.success) {
        // Handle different response formats
        if (Array.isArray(data.data)) {
          setShops(data.data);
          console.log("🏪 Fetched shops from database:", data.data);
        } else if (data.data && Array.isArray(data.data.shops)) {
          setShops(data.data.shops);
          console.log("🏪 Fetched shops from database:", data.data.shops);
        } else {
          console.warn("Invalid shops data format:", data);
          // Keep the fallback data if API returns invalid format
        }
      } else {
        setError(data.message || "Failed to load shops");
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Failed to load shops:", error);
      setError("Failed to load shops");
      // Keep the fallback data on error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenuItems = async (page = 1, limit = 6) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:5001/api/menu/all?page=${page}&limit=${limit}`);
      const data = await response.json();
      if (data.success) {
        if (page === 1) {
          setMenuItems(data.data);
        } else {
          // For pagination, don't modify the global menuItems state
          // Let the component handle the pagination
        }
        console.log("📋 Fetched menu items from database:", data.data);
        return {
          items: data.data,
          pagination: data.pagination
        };
      } else {
        setError(data.message || "Failed to load menu items");
        return null;
      }
    } catch (error) {
      console.error("Failed to load menu items:", error);
      setError("Failed to load menu items");
      // Set some dummy data for development
      if (page === 1) {
        setMenuItems([
          {
            _id: '1',
            name: 'Chicken Wings',
            description: 'Crispy fried chicken wings with special sauce',
            price: 12.99,
            category: 'Appetizers',
            image: 'https://res.cloudinary.com/ds4u6twep/image/upload/v1756814483/menu-items/vufpsacsoawj9eva@wnc.jpg',
            images: ['https://res.cloudinary.com/ds4u6twep/image/upload/v1756814483/menu-items/vufpsacsoawj9eva@wnc.jpg'],
            rating: 4.5,
            reviewCount: 25,
            isPopular: true,
            isVegetarian: false,
            isSpicy: true,
            preparationTime: 15,
            calories: 350
          },
          {
            _id: '2',
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 18.99,
            category: 'Pizza',
            image: 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=🍕',
            images: ['https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=🍕'],
            rating: 4.8,
            reviewCount: 42,
            isPopular: true,
            isVegetarian: true,
            isSpicy: false,
            preparationTime: 25,
            calories: 450
          },
          {
            _id: '3',
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with Caesar dressing and croutons',
            price: 9.99,
            category: 'Salads',
            image: 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=🥗',
            images: ['https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=🥗'],
            rating: 4.2,
            reviewCount: 18,
            isPopular: false,
            isVegetarian: true,
            isSpicy: false,
            preparationTime: 10,
            calories: 200
          }
        ]);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPopularMenus = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/menu/popular');
      const data = await response.json();
      if (data.success) {
        setMenuItems(data.data);
        console.log("🔥 Fetched popular menu items:", data.data);
      }
    } catch (error) {
      console.error("Failed to load popular menu items:", error);
    }
  };

  //// Function to add item to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    // First try to find in menuItems, then in Products as fallback
    const product = menuItems.find(p => p._id === itemId) || Products.find(p => p._id === itemId);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
      toastSuccess(`${product?.name || 'Item'} quantity increased in cart`);
    } else {
      cartData[itemId] = 1;
      toastSuccess(`${product?.name || 'Item'} added to cart successfully!`);
    }
    setCartItems(cartData);
  };

  ////update cart items on load
  const updateCartItems = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    const product = menuItems.find(p => p._id === itemId) || Products.find(p => p._id === itemId);
    
    if (quantity <= 0) {
      delete cartData[itemId];
      toastSuccess(`${product?.name || 'Item'} removed from cart`);
    } else {
      cartData[itemId] = quantity;
      // Only show toast for significant quantity changes, not every small adjustment
      if (Math.abs(quantity - (cartItems[itemId] || 0)) > 1) {
        toastSuccess(`Cart updated: ${product?.name || 'Item'} quantity set to ${quantity}`);
      }
    }
    setCartItems(cartData);
  };

  ////remove item from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    const product = menuItems.find(p => p._id === itemId) || Products.find(p => p._id === itemId);
    
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
        toastSuccess(`${product?.name || 'Item'} removed from cart`);
      }
      // Don't show toast for every quantity decrease, only for removal
    }
    setCartItems(cartData);
  };

  //// Clear entire cart
  const clearCart = () => {
    setCartItems({});
    toastSuccess("Cart cleared successfully!");
  };

  //// Get cart total
  const getCartTotal = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = menuItems.find(p => p._id === itemId) || Products.find(p => p._id === itemId);
      if (product && cartItems[itemId]) {
        total += product.price * cartItems[itemId];
      }
    }
    return total;
  };

  //// Get cart count
  const getCartCount = () => {
    let count = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId]) {
        count += cartItems[itemId];
      }
    }
    return count;
  };

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart items to localStorage:', error);
    }
  }, [cartItems]);

  useEffect(() => {
    fetchProducts();
    fetchShops();
    fetchMenuItems();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    setIsSeller,
    isSeller,
    showUserLogin,
    setshowUserLogin,
    Products,
    shops,
    menuItems,
    isLoading,
    error,
    currency,
    addToCart,
    cartItems,
    updateCartItems,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    fetchMenuItems, // Expose this for manual refresh
    fetchShops, // Expose this for manual refresh
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
