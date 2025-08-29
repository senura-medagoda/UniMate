import React from 'react'
import { Route, Routes } from 'react-router'
import { ToastContainer, toast } from 'react-toastify';

import MarketPlace_Home from "./pages/StudentUI/Marketplace/pages/MarketPlace_Home.jsx"
import MarketPlace_Collection from "./pages/StudentUI/Marketplace/pages/MarketPlace_Collection.jsx"
import MarketPlace_About from "./pages/StudentUI/Marketplace/pages/MarketPlace_About.jsx"
import MarketPlace_Contact from "./pages/StudentUI/Marketplace/pages/MarketPlace_Contact.jsx"
import MarketPlace_Product from "./pages/StudentUI/Marketplace/pages/MarketPlace_Product.jsx"
import MarketPlace_Cart from "./pages/StudentUI/Marketplace/pages/MarketPlace_Cart.jsx"
import MarketPlace_Login from "./pages/StudentUI/Marketplace/pages/MarketPlace_Login.jsx"
import MarketPlace_PlaceOrder from "./pages/StudentUI/Marketplace/pages/MarketPlace_PlaceOrder.jsx"
import MarketPlace_Orders from "./pages/StudentUI/Marketplace/pages/MarketPlace_Orders.jsx"
import MarketPlace_Navbar from './pages/StudentUI/Marketplace/components/MarketPlace_Navbar.jsx'
import M_Footer from './pages/StudentUI/Marketplace/components/M_Footer.jsx'
import M_SearchBar from './pages/StudentUI/Marketplace/components/M_SearchBar.jsx'

const App = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* Navbar - full width */}
      
      
     
      <div className='flex-grow px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer />
        <MarketPlace_Navbar/>
        <M_SearchBar/>
        <Routes>
          <Route path='/' element={<MarketPlace_Home/>}/> {/* Default route */}
          <Route  path='/M_home' element={<MarketPlace_Home/>}/>
          <Route path='/M_collection' element={<MarketPlace_Collection/>}/>
          <Route path='/M_about' element={<MarketPlace_About/>}/>
          <Route path='/M_contact' element={<MarketPlace_Contact/>}/>
          <Route path="/M_product/:productId" element={<MarketPlace_Product />} />
          <Route path="/M_cart" element={<MarketPlace_Cart />} />
          <Route path="/M_login" element={<MarketPlace_Login />} />
          <Route path="/M_placeorder" element={<MarketPlace_PlaceOrder />} />
          <Route path="/M_orders" element={<MarketPlace_Orders />} />
          
          {/* 404 Not Found route */}
          <Route path="*" element={<div className="text-center py-20">
            <h2 className="text-2xl font-bold">Page Not Found</h2>
            <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
          </div>} />
        </Routes>
      </div>
      
      {/* Footer - full width, no padding */}
      <M_Footer/>
    </div>
  )
}

export default App