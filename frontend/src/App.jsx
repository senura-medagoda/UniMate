import React from 'react'
import { Route, Routes } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import IndexPage from "./pages/IndexPage.jsx"
import JP_index from "./pages/StudentUI/JobPortal/JP_index.jsx"
import JP_jobs from './pages/StudentUI/JobPortal/JP_jobs.jsx'
import MarketPlace_Home from "./pages/StudentUI/Marketplace/pages/MarketPlace_Home.jsx"
import MarketPlace_Collection from "./pages/StudentUI/Marketplace/pages/MarketPlace_Collection.jsx"
import MarketPlace_About from "./pages/StudentUI/Marketplace/pages/MarketPlace_About.jsx"
import MarketPlace_Contact from "./pages/StudentUI/Marketplace/pages/MarketPlace_Contact.jsx"
import MarketPlace_Product from "./pages/StudentUI/Marketplace/pages/MarketPlace_Product.jsx"
import MarketPlace_Cart from "./pages/StudentUI/Marketplace/pages/MarketPlace_Cart.jsx"
import MarketPlace_Login from "./pages/StudentUI/Marketplace/pages/MarketPlace_Login.jsx"
import MarketPlace_PlaceOrder from "./pages/StudentUI/Marketplace/pages/MarketPlace_PlaceOrder.jsx"
import MarketPlace_Orders from "./pages/StudentUI/Marketplace/pages/MarketPlace_Orders.jsx"

import M_Add from './pages/SecondryUsersUI/Marketplace/pages/M_Add.jsx'
import Admin_Orders from './pages/SecondryUsersUI/Marketplace/pages/Admin_Orders.jsx'
import M_List from './pages/SecondryUsersUI/Marketplace/pages/M_List.jsx'
import M_login from './pages/SecondryUsersUI/Marketplace/components/M_login.jsx'
import M_Analytics from './pages/SecondryUsersUI/Marketplace/pages/M_Analytics.jsx'

const App = () => {
  return (
    <div data-theme="emerald" className="relative h-full w-full">
      <Routes>
        {/* Student Side */}
        <Route path="/" element={<IndexPage />} />
        <Route path="/jobdash" element={<JP_index />} />
        <Route path="/jobs" element={<JP_jobs />} />
        <Route path="/mphome" element={<MarketPlace_Home />} />
        <Route path="/M_home" element={<MarketPlace_Home />} />
        <Route path="/M_collection" element={<MarketPlace_Collection />} />
        <Route path="/M_about" element={<MarketPlace_About />} />
        <Route path="/M_contact" element={<MarketPlace_Contact />} />
        <Route path="/M_product/:productId" element={<MarketPlace_Product />} />
        <Route path="/M_cart" element={<MarketPlace_Cart />} />
        <Route path="/M_login" element={<MarketPlace_Login />} />
        <Route path="/M_placeorder" element={<MarketPlace_PlaceOrder />} />
        <Route path="/M_orders" element={<MarketPlace_Orders />} />

        {/* Secondary Users / Admin */}
        <Route path="/M_List" element={<M_List />} />
        <Route path="/A_login" element={<M_List />} />
        <Route path="/A_add" element={<M_Add />} />
        <Route path="/Admin_Orders" element={<Admin_Orders />} />
        <Route path='/M_Analytics' element={<M_Analytics/>}/>
      </Routes>

      {/* Toast container for global notifications */}
      <ToastContainer />
    </div>
  )
}

export default App
