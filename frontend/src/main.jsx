import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router";
import { ToastContainer } from 'react-toastify';  // Change this
import 'react-toastify/dist/ReactToastify.css';
import ShopContextProvider from './pages/StudentUI/Marketplace/context/M_ShopContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>

    <ShopContextProvider>
 <App />
      <ToastContainer />

    </ShopContextProvider>
     
      
    </BrowserRouter>
    
  </StrictMode>,
)
