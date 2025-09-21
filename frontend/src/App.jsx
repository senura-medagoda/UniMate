import React, { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/* ----------------- Common Pages ----------------- */
import IndexPage from "./pages/IndexPage.jsx"
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import UM_stdLogin from './pages/UM_stdLogin.jsx'
import UM_stdRegister from './pages/UM_stdRegister.jsx'
import StudentDash from './pages/StudentUI/StudentDash.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx'

/* ----------------- Job Portal (Student) ----------------- */
import JP_index from "./pages/StudentUI/JobPortal/JP_index.jsx"
import JP_jobs from './pages/StudentUI/JobPortal/JP_jobs.jsx'
import JP_application from './pages/StudentUI/JobPortal/JP_application.jsx'
import JP_profile from './pages/StudentUI/JobPortal/JP_profile.jsx'

/* ----------------- Job Portal (Hiring Manager) ----------------- */
import HM_dash from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_dash.jsx'
import HM_myjobs from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_myjobs.jsx'
import HM_applicants from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_applicants.jsx'
import HM_profile from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_profile.jsx'
import HM_newjob from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_newjob.jsx'

/* ----------------- Job Portal (Admin) ----------------- */
import JPA_Dash from './pages/SecondryUsersUI/JobPortal/JPAdminUI/JPA_Dash.jsx'
import JPA_Jobs from './pages/SecondryUsersUI/JobPortal/JPAdminUI/JPA_Jobs.jsx'
import JPA_Reports from './pages/SecondryUsersUI/JobPortal/JPAdminUI/JPA_Reports.jsx'
import JPA_Profile from './pages/SecondryUsersUI/JobPortal/JPAdminUI/JPA_Profile.jsx'
import JPA_Managers from './pages/SecondryUsersUI/JobPortal/JPAdminUI/JPA_Managers.jsx'

/* ----------------- Marketplace (Student Side) ----------------- */
import MarketPlace_Home from "./pages/StudentUI/Marketplace/pages/MarketPlace_Home.jsx"
import MarketPlace_Collection from "./pages/StudentUI/Marketplace/pages/MarketPlace_Collection.jsx"
import MarketPlace_About from "./pages/StudentUI/Marketplace/pages/MarketPlace_About.jsx"
import MarketPlace_Contact from "./pages/StudentUI/Marketplace/pages/MarketPlace_Contact.jsx"
import MarketPlace_Product from "./pages/StudentUI/Marketplace/pages/MarketPlace_Product.jsx"
import MarketPlace_Cart from "./pages/StudentUI/Marketplace/pages/MarketPlace_Cart.jsx"
import MarketPlace_Login from "./pages/StudentUI/Marketplace/pages/MarketPlace_Login.jsx"
import MarketPlace_PlaceOrder from "./pages/StudentUI/Marketplace/pages/MarketPlace_PlaceOrder.jsx"
import MarketPlace_Orders from "./pages/StudentUI/Marketplace/pages/MarketPlace_Orders.jsx"

/* ----------------- Marketplace (Admin/Secondary Users) ----------------- */
import M_Add from './pages/SecondryUsersUI/Marketplace/pages/M_Add.jsx'
import Admin_Orders from './pages/SecondryUsersUI/Marketplace/pages/Admin_Orders.jsx'
import TrackOrders from './pages/SecondryUsersUI/Marketplace/pages/TrackOrders.jsx'
import M_List from './pages/SecondryUsersUI/Marketplace/pages/M_List.jsx'
import M_Analytics from './pages/SecondryUsersUI/Marketplace/pages/M_Analytics.jsx'
import M_ResellRequests from './pages/SecondryUsersUI/Marketplace/pages/M_ResellRequests.jsx'
import M_ResellItems from './pages/SecondryUsersUI/Marketplace/pages/M_ResellItems.jsx'

/* ----------------- Accommodation ----------------- */
import CreateBoardingPlace from './pages/SecondryUsersUI/Accommodation/BordingOwner/createBoardingPlace.jsx'
import OwnerDashboard from './pages/SecondryUsersUI/Accommodation/BordingOwner/ownerDashboard.jsx'
import EditBoardingPlace from './pages/SecondryUsersUI/Accommodation/BordingOwner/editBoardingPlace.jsx'
import OwnerSignup from './pages/SecondryUsersUI/Accommodation/BordingOwner/ownerSignup.jsx'
import OwnerLogin from './pages/SecondryUsersUI/Accommodation/BordingOwner/ownerLogin.jsx'
import AdminDash from './pages/SecondryUsersUI/Accommodation/AccAdminUI/AdminDash.jsx'
import AdminLogin from './pages/SecondryUsersUI/Accommodation/AccAdminUI/AdminLogin.jsx'

/* ----------------- Student Accommodation ----------------- */
import StudentAccommodationDashboard from './pages/StudentUI/Accommodation/StudentAccommodationDashboard.jsx'
import BoardingPlacesPage from './pages/StudentUI/Accommodation/BoardingPlacesPage.jsx'
import MyBookingsPage from './pages/StudentUI/Accommodation/MyBookingsPage.jsx'
import ServicePage from './pages/StudentUI/Accommodation/ServicesPage.jsx'

/* ----------------- Study Material ----------------- */
import SMDash from "./pages/StudentUI/StudyMaterial/SMDash.jsx"
import Upload from "./pages/StudentUI/StudyMaterial/UploadSM.jsx"
import Brows from "./pages/StudentUI/StudyMaterial/BrowsSM.jsx"
import Req from "./pages/StudentUI/StudyMaterial/RequestSM.jsx"
import TopandRecent from "./pages/StudentUI/StudyMaterial/Top_RecentSM.jsx"
import ForumSMM from "./pages/StudentUI/StudyMaterial/ForumSM.jsx"
import RequestedSM from "./pages/StudentUI/StudyMaterial/RequestedSM.jsx"
import Admin from "./pages/SecondryUsersUI/StudyMaterial/SMAdminUI/AdminDash.jsx"
import About from "./pages/StudentUI/StudyMaterial/About.jsx"
import MyUploads from "./pages/StudentUI/StudyMaterial/MyUploads.jsx"
import MyRequests from "./pages/StudentUI/StudyMaterial/MyRequests.jsx"
import Profile from "./pages/StudentUI/StudyMaterial/Profile.jsx"

/* ----------------- Food Order (Student) ----------------- */
import FD_Home from './pages/StudentUI/FoodOrder/pages/FD_Home.jsx'
import MenuPage from './pages/StudentUI/FoodOrder/pages/MenuPage.jsx'
import ShopsPage from './pages/StudentUI/FoodOrder/pages/ShopsPage.jsx'
import CartPage from './pages/StudentUI/FoodOrder/pages/CartPage.jsx'

/* ----------------- Food Order (Vendor + Admin) ----------------- */
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

import {
  AdminLogin as FDAdminLogin,
  AdminDashboard,
  VendorsManagement,
  ShopsManagement,
  Analytics,
  ProfileSettings,
  AdminAuthProvider,
  ProtectedAdminRoute
} from './pages/SecondryUsersUI/FoodOrder/FDAdmin'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('studentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const updateUser = (userData) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem('studentUser', JSON.stringify(userData))
    } else {
      localStorage.removeItem('studentUser')
    }
  }

  return (
    <div data-theme="emerald" className="relative h-full w-full">
      <Routes>
        {/* ----------------- Main ----------------- */}
        <Route path="/" element={<IndexPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ----------------- Student Auth ----------------- */}
        <Route path="/login-std" element={user ? <Navigate to="/std-dash" /> : <UM_stdLogin setUser={updateUser} />} />
        <Route path="/stdregister" element={user ? <Navigate to="/std-dash" /> : <UM_stdRegister />} />
        <Route
          path="/std-dash"
          element={
            <ProtectedRoute user={user}>
              <StudentDash user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />

        {/* ----------------- Job Portal ----------------- */}
        <Route path="/jobdash" element={<JP_index />} />
        <Route path="/jobs" element={<JP_jobs />} />
        <Route path="/applications" element={<JP_application />} />
        <Route path="/jobprofile" element={<JP_profile />} />

        {/* Hiring Manager */}
        <Route path="/hmdash" element={<HM_dash />} />
        <Route path="/myjobs" element={<HM_myjobs />} />
        <Route path="/applicants" element={<HM_applicants />} />
        <Route path="/hmprofile" element={<HM_profile />} />
        <Route path="/addnewjob" element={<HM_newjob />} />

        {/* JP Admin */}
        <Route path="/jpadmin-dash" element={<JPA_Dash />} />
        <Route path="/jpadmin-jobs" element={<JPA_Jobs />} />
        <Route path="/jpadmin-reports" element={<JPA_Reports />} />
        <Route path="/jpadmin-managers" element={<JPA_Managers />} />
        <Route path="/jpadmin-profile" element={<JPA_Profile />} />

        {/* ----------------- Marketplace (Student) ----------------- */}
        <Route path='/mphome' element={<MarketPlace_Home />} />
        <Route path='/M_home' element={<MarketPlace_Home />} />
        <Route path='/M_collection' element={<MarketPlace_Collection />} />
        <Route path='/M_about' element={<MarketPlace_About />} />
        <Route path='/M_contact' element={<MarketPlace_Contact />} />
        <Route path="/M_product/:productId" element={<MarketPlace_Product />} />
        <Route path="/M_cart" element={<MarketPlace_Cart />} />
        <Route path="/M_login" element={<MarketPlace_Login />} />
        <Route path="/M_placeorder" element={<MarketPlace_PlaceOrder />} />
        <Route path="/M_orders" element={<MarketPlace_Orders />} />

        {/* Marketplace Secondary/Admin */}
        <Route path="/M_List" element={<M_List />} />
        <Route path="/A_login" element={<M_List />} /> {/* ✅ Added missing route */}
        <Route path="/A_add" element={<M_Add />} />
        <Route path="/Admin_Orders" element={<Admin_Orders />} />
        <Route path="/Track_Orders" element={<TrackOrders />} />
        <Route path='/M_Analytics' element={<M_Analytics />} />
        <Route path='/M_resell_requests' element={<M_ResellRequests />} />
        <Route path='/M_resell_items' element={<M_ResellItems />} />

        {/* ----------------- Study Material ----------------- */}
        <Route path="/SMAdminDashboard" element={<Admin />} />
        <Route path="/StudyMaterialDash" element={<SMDash />} />
        <Route path="/uploadSM" element={<Upload />} />
        <Route path="/BrowseSM" element={<Brows />} />
        <Route path="/RequestSM" element={<Req />} />
        <Route path="/RequestedSM" element={<RequestedSM />} />
        <Route path="/Top_RecentSM" element={<TopandRecent />} />
        <Route path="/ForumSM" element={<ForumSMM />} />
        <Route path="/my-uploads" element={<MyUploads />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about-sm" element={<About />} />

        {/* ----------------- Accommodation ----------------- */}
        <Route path="/create-boarding-place" element={<CreateBoardingPlace />} />
        <Route path="/edit-boarding-place/:placeId" element={<EditBoardingPlace />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/signup" element={<OwnerSignup />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/accommodation" element={<AdminDash />} />
        <Route path="/student/accommodation" element={<StudentAccommodationDashboard />} />
        <Route path="/student/accommodation/boarding-places" element={<BoardingPlacesPage />} />
        <Route path="/student/accommodation/my-bookings" element={<MyBookingsPage />} />
        <Route path="/student/accommodation/services" element={<ServicePage />} />

        {/* ----------------- Food Order ----------------- */}
        <Route path="/food" element={<FD_Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Vendor */}
        <Route path="/vendor/login" element={<VendorAuthProvider><VendorLogin /></VendorAuthProvider>} />
        <Route path="/vendor/signup" element={<VendorAuthProvider><VendorSignup /></VendorAuthProvider>} />
        <Route path="/vendor/forgot-password" element={<VendorAuthProvider><ForgotPassword /></VendorAuthProvider>} />
        <Route path="/vendor/reset-password" element={<VendorAuthProvider><ResetPassword /></VendorAuthProvider>} />
        <Route path="/vendor/dashboard" element={
          <VendorAuthProvider>
            <ProtectedVendorRoute><VendorDashboard /></ProtectedVendorRoute>
          </VendorAuthProvider>
        } />
        <Route path="/vendor/shop-details" element={
          <VendorAuthProvider>
            <ProtectedVendorRoute><ShopDetails /></ProtectedVendorRoute>
          </VendorAuthProvider>
        } />
        <Route path="/vendor/menu" element={
          <VendorAuthProvider>
            <ProtectedVendorRoute><MenuDetails /></ProtectedVendorRoute>
          </VendorAuthProvider>
        } />
        <Route path="/vendor/menu-management" element={
          <VendorAuthProvider>
            <ProtectedVendorRoute><MenuManagement /></ProtectedVendorRoute>
          </VendorAuthProvider>
        } />

        {/* Food Admin */}
        <Route path="/admin/food/login" element={<AdminAuthProvider><FDAdminLogin /></AdminAuthProvider>} />
        <Route path="/admin/food/dashboard" element={
          <AdminAuthProvider>
            <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>
          </AdminAuthProvider>
        } />
        <Route path="/admin/food/vendors" element={
          <AdminAuthProvider>
            <ProtectedAdminRoute requiredPermission="manage_vendors"><VendorsManagement /></ProtectedAdminRoute>
          </AdminAuthProvider>
        } />
        <Route path="/admin/food/shops" element={
          <AdminAuthProvider>
            <ProtectedAdminRoute requiredPermission="manage_shops"><ShopsManagement /></ProtectedAdminRoute>
          </AdminAuthProvider>
        } />
        <Route path="/admin/food/analytics" element={
          <AdminAuthProvider>
            <ProtectedAdminRoute requiredPermission="view_analytics"><Analytics /></ProtectedAdminRoute>
          </AdminAuthProvider>
        } />
        <Route path="/admin/food/profile" element={
          <AdminAuthProvider>
            <ProtectedAdminRoute><ProfileSettings /></ProtectedAdminRoute>
          </AdminAuthProvider>
        } />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}

export default App
