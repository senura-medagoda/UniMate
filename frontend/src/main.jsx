<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router";
import {Toaster} from "react-hot-toast";
=======

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppContextProvider } from './pages/StudentUI/FoodOrder/components/context/context.jsx'; 
import {BrowserRouter} from "react-router";
import { ToastContainer } from 'react-toastify';  // Change this
import 'react-toastify/dist/ReactToastify.css';
import ShopContextProvider from './pages/StudentUI/Marketplace/context/M_ShopContext.jsx';

>>>>>>> b8c2d87ecff27f4069e77943cff526e971908ad8

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
<<<<<<< HEAD
      <App />
      <Toaster/>
      
=======

      <AppContextProvider>
        <App />
        <Toaster />



    <ShopContextProvider>
 <App />
      <ToastContainer />

    </ShopContextProvider>
     
      

>>>>>>> b8c2d87ecff27f4069e77943cff526e971908ad8
    </BrowserRouter>
  </StrictMode>
);
