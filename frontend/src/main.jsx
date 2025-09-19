
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
//import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from './pages/StudentUI/FoodOrder/components/context/context.jsx';
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';  // Change this
import 'react-toastify/dist/ReactToastify.css';
import ShopContextProvider from './pages/StudentUI/Marketplace/context/M_ShopContext.jsx';
import { OwnerAuthProvider } from './context/ownerAuthContext.jsx';



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>


      <AppContextProvider>
        <ShopContextProvider>
          <OwnerAuthProvider>
            <App />
            <ToastContainer />
          </OwnerAuthProvider>
        </ShopContextProvider>
      </AppContextProvider>
      <Toaster />
    </BrowserRouter>

  </StrictMode>
);
