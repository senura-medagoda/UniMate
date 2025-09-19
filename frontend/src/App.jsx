import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { ToastProvider } from './context/ToastContext'
import IndexPage from "./pages/IndexPage.jsx"
import Navbar from './pages/landingComponents/Navbar.jsx'
import FD_Home from './pages/StudentUI/FoodOrder/pages/FD_Home.jsx'
import MenuPage from './pages/StudentUI/FoodOrder/pages/MenuPage.jsx'
import ShopsPage from './pages/StudentUI/FoodOrder/pages/ShopsPage.jsx'
import CartPage from './pages/StudentUI/FoodOrder/pages/CartPage.jsx'
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
import UM_stdLogin from './pages/UM_stdLogin.jsx'


import VendorLogin from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/VendorLogin.jsx'
import VendorSignup from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/VendorSignup.jsx'
import ForgotPassword from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/ForgotPassword.jsx'
import ResetPassword from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/ResetPassword.jsx'
import ShopDetails from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/ShopDetails.jsx'
import MenuDetails from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/MenuDetails.jsx'
import MenuManagement from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/pages/MenuManagement.jsx'
import VendorDashboard from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/pages/VendorDashboard.jsx'
import ProtectedVendorRoute from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/components/ProtectedVendorRoute.jsx'
import { VendorAuthProvider } from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/context/VendorAuthContext.jsx'

// Admin imports
import { 
  AdminLogin, 
  AdminDashboard, 
  VendorsManagement, 
  ShopsManagement, 
  Analytics,
  ProfileSettings,
  AdminAuthProvider,
  ProtectedAdminRoute 
} from './pages/SecondryUsersUI/FoodOrder/FDAdmin'

const App = () => {
  return (
    <ToastProvider>
      <VendorAuthProvider>
        <AdminAuthProvider>
          <div data-theme="emerald" className="relative h-full w-full">
        
        <Routes>
          
          <Route path="/" element={<IndexPage/>}/>
          <Route path="/food" element={<FD_Home/>}/>
          <Route path="/login-std" element={<UM_stdLogin/>}/>

          <Route path="/menu" element={<MenuPage/>}/>
          <Route path="/shops" element={<ShopsPage/>}/>
          <Route path="/cart" element={<CartPage/>}/>

          <Route path="/vendor/login" element={<VendorLogin/>}/>
          <Route path="/vendor/signup" element={<VendorSignup/>}/>
          <Route path="/vendor/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/vendor/reset-password" element={<ResetPassword/>}/>
     
          <Route path="/vendor/dashboard" element={
            <ProtectedVendorRoute>
              <VendorDashboard/>
            </ProtectedVendorRoute>
          }/>
          <Route path="/vendor/shop-details" element={
            <ProtectedVendorRoute>
              <ShopDetails/>
            </ProtectedVendorRoute>
          }/>
          <Route path="/vendor/menu" element={
            <ProtectedVendorRoute>
              <MenuDetails/>
            </ProtectedVendorRoute>
          }/>
          <Route path="/vendor/menu-management" element={
            <ProtectedVendorRoute>
              <MenuManagement/>
            </ProtectedVendorRoute>
          }/>

          <Route path="/jobdash" element = {<JP_index/>}/>
          <Route path="/jobs" element = {<JP_jobs/>}/>
          <Route path='/mphome' element={<MarketPlace_Home/>}/> 
          <Route  path='/M_home' element={<MarketPlace_Home/>}/>
          <Route path='/M_collection' element={<MarketPlace_Collection/>}/>
          <Route path='/M_about' element={<MarketPlace_About/>}/>
          <Route path='/M_contact' element={<MarketPlace_Contact/>}/>
          <Route path="/M_product/:productId" element={<MarketPlace_Product />} />
          <Route path="/M_cart" element={<MarketPlace_Cart />} />
          <Route path="/M_login" element={<MarketPlace_Login />} />
          <Route path="/M_placeorder" element={<MarketPlace_PlaceOrder />} />
          <Route path="/M_orders" element={<MarketPlace_Orders />} />
          <Route path="/A_add" element={<M_Add/>}/>
          <Route path='/Admin_Orders' element={<Admin_Orders/>}/>
          <Route path='/M_List' element={<M_List/>}/>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/admin/dashboard" element={
            <ProtectedAdminRoute>
              <AdminDashboard/>
            </ProtectedAdminRoute>
          }/>
          <Route path="/admin/vendors" element={
            <ProtectedAdminRoute requiredPermission="manage_vendors">
              <VendorsManagement/>
            </ProtectedAdminRoute>
          }/>
          <Route path="/admin/shops" element={
            <ProtectedAdminRoute requiredPermission="manage_shops">
              <ShopsManagement/>
            </ProtectedAdminRoute>
          }/>
          <Route path="/admin/analytics" element={
            <ProtectedAdminRoute requiredPermission="view_analytics">
              <Analytics/>
            </ProtectedAdminRoute>
          }/>
          <Route path="/admin/profile" element={
            <ProtectedAdminRoute>
              <ProfileSettings/>
            </ProtectedAdminRoute>
          }/>

        </Routes>

        </div>
        </AdminAuthProvider>
      </VendorAuthProvider>
    </ToastProvider>
  )
}

export default App
