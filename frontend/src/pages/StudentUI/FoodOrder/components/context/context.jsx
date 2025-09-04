import { Children,createContext, useContext,useEffect,useState,} from "react";
import { useNavigate } from "react-router-dom";
import { dummy } from "../../assets/assets.js";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = "Rs.";

  const navigate = useNavigate();
  const [user, setUser] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setshowUserLogin] = useState(false);
  const [Products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState([]);


  const fetchProducts = async () => {
    setProducts(dummy);
  };

  //// Function to add item to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Item added to cart");
  };

  ////update cart items on load
  const updateCartItems = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  ////remove item from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Item removed from cart");
    setCartItems(cartData);
  };

  useEffect(() => {
    fetchProducts();
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
    currency,
    addToCart,
    cartItems,
    updateCartItems,
    removeFromCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
