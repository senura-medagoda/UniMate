import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'

import FD_Home from './pages/StudentUI/FoodOrder/pages/FD_Home.jsx'
import MenuPage from './pages/StudentUI/FoodOrder/pages/MenuPage.jsx'
import ShopsPage from './pages/StudentUI/FoodOrder/pages/ShopsPage.jsx'
import CartPage from './pages/StudentUI/FoodOrder/pages/CartPage.jsx'
import MyOrders from './pages/StudentUI/FoodOrder/pages/MyOrders.jsx'
import PaymentSuccess from './pages/StudentUI/FoodOrder/pages/PaymentSuccess.jsx'
import OrderHistory from './pages/StudentUI/FoodOrder/pages/OrderHistory.jsx'

import ProtectedRoute from './utils/ProtectedRoute.jsx'
import IndexPage from "./pages/IndexPage.jsx"
import Home from './pages/StudentUI/FoodOrder/pages/Home.jsx'

import JP_index from "./pages/StudentUI/JobPortal/JP_index.jsx"
import JP_jobs from './pages/StudentUI/JobPortal/JP_jobs.jsx'
import JP_application from './pages/StudentUI/JobPortal/JP_application.jsx'
import JP_profile from './pages/StudentUI/JobPortal/JP_profile.jsx'
import MarketPlace_Home from "./pages/StudentUI/Marketplace/pages/MarketPlace_Home.jsx"
import MarketPlace_Collection from "./pages/StudentUI/Marketplace/pages/MarketPlace_Collection.jsx"
import MarketPlace_About from "./pages/StudentUI/Marketplace/pages/MarketPlace_About.jsx"
import MarketPlace_Contact from "./pages/StudentUI/Marketplace/pages/MarketPlace_Contact.jsx"
import MarketPlace_Product from "./pages/StudentUI/Marketplace/pages/MarketPlace_Product.jsx"
import MarketPlace_Cart from "./pages/StudentUI/Marketplace/pages/MarketPlace_Cart.jsx"
import MarketPlace_PlaceOrder from "./pages/StudentUI/Marketplace/pages/MarketPlace_PlaceOrder.jsx"
import MarketPlace_Orders from "./pages/StudentUI/Marketplace/pages/MarketPlace_Orders.jsx"
import M_PaymentSuccess from "./pages/StudentUI/Marketplace/pages/M_PaymentSuccess.jsx"
import M_MyRequests from "./pages/StudentUI/Marketplace/pages/M_MyRequests.jsx"
import M_Favorites from "./pages/StudentUI/Marketplace/pages/M_Favorites.jsx"
import ShopContextProvider from "./pages/StudentUI/Marketplace/context/M_ShopContext.jsx"

/* ----------------- Marketplace (Admin/Secondary Users) ----------------- */
import M_Add from './pages/SecondryUsersUI/Marketplace/pages/M_Add.jsx'
import Admin_Orders from './pages/SecondryUsersUI/Marketplace/pages/Admin_Orders.jsx'
import TrackOrders from './pages/SecondryUsersUI/Marketplace/pages/TrackOrders.jsx'
import M_List from './pages/SecondryUsersUI/Marketplace/pages/M_List.jsx'
import M_Analytics from './pages/SecondryUsersUI/Marketplace/pages/M_Analytics.jsx'
import M_ResellRequests from './pages/SecondryUsersUI/Marketplace/pages/M_ResellRequests.jsx'
import M_ResellItems from './pages/SecondryUsersUI/Marketplace/pages/M_ResellItems.jsx'


import UM_stdLogin from './pages/UM_stdLogin.jsx'

import CreateBoardingPlace from './pages/SecondryUsersUI/Accommodation/BordingOwner/createBoardingPlace.jsx';
import OwnerDashboard from './pages/SecondryUsersUI/Accommodation/BordingOwner/ownerDashboard.jsx';
import EditBoardingPlace from './pages/SecondryUsersUI/Accommodation/BordingOwner/editBoardingPlace.jsx';
import PendingApprovalPage from './pages/SecondryUsersUI/Accommodation/BordingOwner/PendingApprovalPage.jsx';
import OwnerSignup from './pages/SecondryUsersUI/Accommodation/BordingOwner/ownerSignup.jsx';
import OwnerLogin from './pages/SecondryUsersUI/Accommodation/BordingOwner/ownerLogin.jsx';
import AdminDash from './pages/SecondryUsersUI/Accommodation/AccAdminUI/AdminDash.jsx';
import AdminLogin from './pages/SecondryUsersUI/Accommodation/AccAdminUI/AdminLogin.jsx';

// Student Accommodation Pages
import StudentAccommodationDashboard from './pages/StudentUI/Accommodation/StudentAccommodationDashboard.jsx';
import BoardingPlacesPage from './pages/StudentUI/Accommodation/BoardingPlacesPage.jsx';
import MyBookingsPage from './pages/StudentUI/Accommodation/MyBookingsPage.jsx';
import FavoritesPage from './pages/StudentUI/Accommodation/FavoritesPage.jsx';
import ServicePage from './pages/StudentUI/Accommodation/ServicesPage.jsx';

import SMDash from "./pages/StudentUI/StudyMaterial/SMDash.jsx"
import Upload from "./pages/StudentUI/StudyMaterial/UploadSM";
import Brows from "./pages/StudentUI/StudyMaterial/BrowsSM";
import Req from "./pages/StudentUI/StudyMaterial/RequestSM";
import TopandRecent from "./pages/StudentUI/StudyMaterial/Top_RecentSM";
import ForumSMM from "./pages/StudentUI/StudyMaterial/ForumSM"
import Nav from "./pages/StudentUI/StudyMaterial/Components/Navbar.jsx"
import Footer from "./pages/StudentUI/StudyMaterial/Components/Footer.jsx"
import RequestedSM from "./pages/StudentUI/StudyMaterial/RequestedSM";
import Admin from "./pages/SecondryUsersUI/StudyMaterial/SMAdminUI/AdminDash.jsx"
import SMAdminLogin from "./pages/SecondryUsersUI/StudyMaterial/SMAdminUI/SMAdminLogin.jsx"
import ProtectedSMAdminRoute from "./pages/SecondryUsersUI/StudyMaterial/SMAdminUI/ProtectedSMAdminRoute.jsx"
import About from "./pages/StudentUI/StudyMaterial/About.jsx"
import MyUploads from "./pages/StudentUI/StudyMaterial/MyUploads.jsx"
import MyRequests from "./pages/StudentUI/StudyMaterial/MyRequests.jsx"
import Profile from "./pages/StudentUI/StudyMaterial/Profile.jsx"
import StudentMessagingPage from "./pages/StudentUI/StudyMaterial/StudentMessagingPage.jsx"
import VerifyProfilePage from './pages/StudentUI/VerifyProfilePage.jsx'

import HM_dash from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_dash.jsx'
import HM_myjobs from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_myjobs.jsx'
import HM_applicants from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_applicants.jsx'
import HM_profile from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_profile.jsx'
import HM_newjob from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_newjob.jsx'
import HM_Login from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_Login.jsx'
import HM_Signup from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_Signup.jsx'
import { HMAuthProvider } from './context/HMAuthContext.jsx'
import ProtectedHMRoute from './utils/ProtectedHMRoute.jsx'
import VerifiedHMOnly from './utils/VerifiedHMOnly.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import UM_stdRegister from './pages/UM_stdRegister.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import StudentDash from './pages/StudentUI/StudentDash.jsx'
import LoginPage from './pages/LoginPage.jsx'
import JPA_Dash from './pages/SecondryUsersUI/JobPortal/JPAdminUI/JPA_Dash.jsx'
import JPA_Jobs from './pages/SecondryUsersUI/JobPortal/JPAdminUI/JPA_Jobs.jsx'
import JPA_Reports from './pages/SecondryUsersUI/JobPortal/JPAdminUI/JPA_Reports.jsx'
import JPA_Profile from './pages/SecondryUsersUI/JobPortal/JPAdminUI/JPA_Profile.jsx'
import JPA_Managers from './pages/SecondryUsersUI/JobPortal/JPAdminUI/JPA_Managers.jsx'
import JPA_Login from './pages/SecondryUsersUI/JobPortal/JPAdminUI/JPA_Login.jsx'
import { JPAuthProvider } from './context/JPAuthContext.jsx'

import VendorLogin from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/VendorLogin.jsx'
import VendorSignup from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/VendorSignup.jsx'
import ForgotPassword from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/ForgotPassword.jsx'
import ResetPassword from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/ResetPassword.jsx'
import ShopDetails from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/ShopDetails.jsx'
import MenuDetails from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/MenuDetails.jsx'
import MenuManagement from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/pages/MenuManagement.jsx'
import VendorDashboard from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/pages/VendorDashboard.jsx'
import VendorOrders from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/pages/VendorOrders.jsx'
import ProtectedVendorRoute from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/components/ProtectedVendorRoute.jsx'
import { VendorAuthProvider } from './pages/SecondryUsersUI/FoodOrder/FoodSupplierUI/context/VendorAuthContext.jsx'

// Admin imports
import {
  AdminLogin as FDAdminLogin,
  AdminDashboard,
  VendorsManagement,
  ShopsManagement,
  OrdersManagement,
  Analytics,
  ProfileSettings,
  AdminAuthProvider,
  ProtectedAdminRoute
} from './pages/SecondryUsersUI/FoodOrder/FDAdmin'
import AdminLoginPage from './pages/AdminLogins/AdminLoginPage.jsx'
import StdProfile from './pages/StudentUI/StdProfile.jsx'
import SA_Dash from './pages/SystemAdmin/SA_Dash.jsx'
import SA_StudentsPage from './pages/SystemAdmin/SA_StudentsPage.jsx'
import SA_AdminsPage from './pages/SystemAdmin/SA_AdminsPage.jsx'
import SA_ReportsPage from './pages/SystemAdmin/SA_ReportsPage.jsx'
import SA_Profile from './pages/SystemAdmin/SA_Profile.jsx'
import SA_LoginPage from './pages/AdminLogins/SA_LoginPage.jsx'
import { SAAuthProvider, useSAAuth } from './context/SAAuthContext.jsx'
import SU_HeroSignupHub from './pages/landingComponents/SU_HeroSignupHub.jsx'

// System Admin Protected Route Component
const ProtectedSARoute = ({ children }) => {
  const { user, setUser, isAuthenticated, loading } = useSAAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/sa-login" replace />;
  }
  
  return React.cloneElement(children, { 
    user, 
    setUser 
  });
};

const App = () => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('studentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
  }, []);

  // Create a function to update user AND save to localStorage
  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('studentUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('studentUser');
    }
  };

  return (
    <div data-theme="emerald" className="relative h-full w-full">
      <ToastContainer />
      <SAAuthProvider>
        <Routes>
        {/* Main App Routes */}
        <Route path="/" element={<IndexPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/su-signuphub" element={<SU_HeroSignupHub/>} />

        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/sa-login" element={<SA_LoginPage />} />


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
        <Route
          path="/std-profile"
          element={
            <ProtectedRoute user={user}>
              <StdProfile user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/verifystd"
          element={
            <ProtectedRoute user={user}>
              <VerifyProfilePage user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />

        {/* Job Portal Routes */}
        <Route
          path="/jobdash"
          element={
            <ProtectedRoute user={user}>
              <JP_index user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute user={user}>
              <JP_jobs user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute user={user}>
              <JP_application user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobprofile"
          element={
            <ProtectedRoute user={user}>
              <JP_profile user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />

        {/* Sys Admin routes */}
        <Route path="/systemadmin-dash" element={
          <ProtectedSARoute>
            <SA_Dash />
          </ProtectedSARoute>
        } />
        <Route path="/systemadmin-students" element={
          <ProtectedSARoute>
            <SA_StudentsPage />
          </ProtectedSARoute>
        } />
        <Route path="/systemadmin-admins" element={
          <ProtectedSARoute>
            <SA_AdminsPage />
          </ProtectedSARoute>
        } />
        <Route path="/systemadmin-reports" element={
          <ProtectedSARoute>
            <SA_ReportsPage />
          </ProtectedSARoute>
        } />
        <Route path="/systemadmin-profile" element={
          <ProtectedSARoute>
            <SA_Profile />
          </ProtectedSARoute>
        } />

        {/* Hiring Manager Routes */}
        <Route path="/hm/login" element={
          <HMAuthProvider>
            <HM_Login />
          </HMAuthProvider>
        } />
        <Route path="/hm/signup" element={<HM_Signup />} />
        <Route path="/hmdash" element={
          <HMAuthProvider>
            <ProtectedHMRoute>
              <HM_dash />
            </ProtectedHMRoute>
          </HMAuthProvider>
        } />
        <Route path="/myjobs" element={
          <HMAuthProvider>
            <ProtectedHMRoute>
              <HM_myjobs />
            </ProtectedHMRoute>
          </HMAuthProvider>
        } />
        <Route path="/applicants" element={
          <HMAuthProvider>
            <ProtectedHMRoute>
              <HM_applicants />
            </ProtectedHMRoute>
          </HMAuthProvider>
        } />
        <Route path="/hmprofile" element={
          <HMAuthProvider>
            <ProtectedHMRoute>
              <HM_profile />
            </ProtectedHMRoute>
          </HMAuthProvider>
        } />
        <Route path="/addnewjob" element={
          <HMAuthProvider>
            <ProtectedHMRoute>
              <VerifiedHMOnly>
                <HM_newjob />
              </VerifiedHMOnly>
            </ProtectedHMRoute>
          </HMAuthProvider>
        } />

        {/* Job Portal Admin Routes o */}
        <Route path="/jpadmin-login" element={
          <JPAuthProvider>
            <JPA_Login />
          </JPAuthProvider>
        } />
        <Route path="/jpadmin-dash" element={
          <JPAuthProvider>
            <JPA_Dash />
          </JPAuthProvider>
        } />
        <Route path="/jpadmin-jobs" element={
          <JPAuthProvider>
            <JPA_Jobs />
          </JPAuthProvider>
        } />
        <Route path="/jpadmin-reports" element={
          <JPAuthProvider>
            <JPA_Reports />
          </JPAuthProvider>
        } />
        <Route path="/jpadmin-managers" element={
          <JPAuthProvider>
            <JPA_Managers />
          </JPAuthProvider>
        } />
        <Route path="/jpadmin-profile" element={
          <JPAuthProvider>
            <JPA_Profile />
          </JPAuthProvider>
        } />

        {/* ----------------- Marketplace (Student) ----------------- */}
        <Route path='/mphome' element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <MarketPlace_Home user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />
        <Route path='/M_home' element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <MarketPlace_Home user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />
        <Route path='/M_collection' element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <MarketPlace_Collection user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />
        <Route path='/M_about' element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <MarketPlace_About user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />
        <Route path='/M_contact' element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <MarketPlace_Contact user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />
        <Route path="/M_product/:productId" element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <MarketPlace_Product user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />
        <Route path="/M_cart" element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <MarketPlace_Cart user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />
        <Route path="/M_placeorder" element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <MarketPlace_PlaceOrder user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />
        <Route path="/M_orders" element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <MarketPlace_Orders user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />
        <Route path="/M_payment-success" element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <M_PaymentSuccess user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />
        <Route path="/M_my-requests" element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <M_MyRequests user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />
        <Route path="/M_favorites" element={
          <ProtectedRoute user={user}>
            <ShopContextProvider>
              <M_Favorites user={user} setUser={updateUser} />
            </ShopContextProvider>
          </ProtectedRoute>
        } />

        {/* Marketplace Secondary/Admin */}
        <Route path="/M_List" element={<M_List />} />
        <Route path="/A_login" element={<M_List />} /> {/* ✅ Added missing route */}
        <Route path="/A_add" element={<M_Add />} />
        <Route path="/Admin_Orders" element={<Admin_Orders />} />
        <Route path="/Track_Orders" element={<TrackOrders />} />
        <Route path='/M_Analytics' element={<M_Analytics />} />
        <Route path='/M_resell_requests' element={<M_ResellRequests />} />
        <Route path='/M_resell_items' element={<M_ResellItems />} />

       {/* Study Material Routes */}
        <Route path="/SMAdminLogin" element={<SMAdminLogin />} />
        <Route path="/SMAdminDashboard" element={
          <ProtectedSMAdminRoute>
            <Admin />
          </ProtectedSMAdminRoute>
        } />
        <Route
          path="/StudyMaterialDash"
          element={
            <ProtectedRoute user={user}>
              <SMDash user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadSM"
          element={
            <ProtectedRoute user={user}>
              <Upload user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/BrowseSM"
          element={
            <ProtectedRoute user={user}>
              <Brows user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RequestSM"
          element={
            <ProtectedRoute user={user}>
              <Req user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RequestedSM"
          element={
            <ProtectedRoute user={user}>
              <RequestedSM user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Top_RecentSM"
          element={
            <ProtectedRoute user={user}>
              <TopandRecent user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ForumSM"
          element={
            <ProtectedRoute user={user}>
              <ForumSMM user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SMabout"
          element={
            <ProtectedRoute user={user}>
              <About user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-uploads"
          element={
            <ProtectedRoute user={user}>
              <MyUploads user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute user={user}>
              <MyRequests user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/StudentMessaging"
          element={
            <ProtectedRoute user={user}>
              <StudentMessagingPage user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />

        {/* Accommodation Routes */}
        <Route path="/create-boarding-place" element={<CreateBoardingPlace />} />
        <Route path="/edit-boarding-place/:placeId" element={<EditBoardingPlace />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/pending-approval" element={<PendingApprovalPage />} />
        <Route path="/owner/signup" element={<OwnerSignup />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/accommodation" element={<AdminDash />} />
        <Route
          path="/student/accommodation"
          element={
            <ProtectedRoute user={user}>
              <StudentAccommodationDashboard user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/accommodation/boarding-places"
          element={
            <ProtectedRoute user={user}>
              <BoardingPlacesPage user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/accommodation/my-bookings"
          element={
            <ProtectedRoute user={user}>
              <MyBookingsPage user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/accommodation/favorites"
          element={
            <ProtectedRoute user={user}>
              <FavoritesPage user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/accommodation/services"
          element={
            <ProtectedRoute user={user}>
              <ServicePage user={user} setUser={updateUser} />
            </ProtectedRoute>
          }
        />

        {/* Food Order Student Routes */}
        <Route path="/food" element={
          <ProtectedRoute user={user}>
            <FD_Home user={user} setUser={updateUser} />
          </ProtectedRoute>
        } />
        <Route path="/menu" element={
          <ProtectedRoute user={user}>
            <MenuPage user={user} setUser={updateUser} />
          </ProtectedRoute>
        } />
        <Route path="/shops" element={
          <ProtectedRoute user={user}>
            <ShopsPage user={user} setUser={updateUser} />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute user={user}>
            <CartPage user={user} setUser={updateUser} />
          </ProtectedRoute>
        } />
        <Route path="/student/my-orders" element={
          <ProtectedRoute user={user}>
            <MyOrders user={user} setUser={updateUser} />
          </ProtectedRoute>
        } />
        <Route path="/student/order-history" element={
          <ProtectedRoute user={user}>
            <OrderHistory user={user} setUser={updateUser} />
          </ProtectedRoute>
        } />
        <Route path="/payment-success" element={
          <ProtectedRoute user={user}>
            <PaymentSuccess user={user} setUser={updateUser} />
          </ProtectedRoute>
        } />

        {/* Food Order Vendor Routes (wrapped in VendorAuthProvider) */}
        <Route path="/vendor/login" element={
          <VendorAuthProvider>
            <VendorLogin />
          </VendorAuthProvider>
        } />
        <Route path="/vendor/signup" element={
          <VendorAuthProvider>
            <VendorSignup />
          </VendorAuthProvider>
        } />
        <Route path="/vendor/forgot-password" element={
          <VendorAuthProvider>
            <ForgotPassword />
          </VendorAuthProvider>
        } />
        <Route path="/vendor/reset-password" element={
          <VendorAuthProvider>
            <ResetPassword />
          </VendorAuthProvider>
        } />
        <Route path="/vendor/dashboard" element={
          <VendorAuthProvider>
            <ProtectedVendorRoute>
              <VendorDashboard />
            </ProtectedVendorRoute>
          </VendorAuthProvider>
        } />
        <Route path="/vendor/shop-details" element={
          <VendorAuthProvider>
            <ProtectedVendorRoute>
              <ShopDetails />
            </ProtectedVendorRoute>
          </VendorAuthProvider>
        } />
        <Route path="/vendor/menu" element={
          <VendorAuthProvider>
            <ProtectedVendorRoute>
              <MenuDetails />
            </ProtectedVendorRoute>
          </VendorAuthProvider>
        } />
        <Route path="/vendor/menu-management" element={
          <VendorAuthProvider>
            <ProtectedVendorRoute>
              <MenuManagement />
            </ProtectedVendorRoute>
          </VendorAuthProvider>
        } />
        <Route path="/vendor/orders" element={
          <VendorAuthProvider>
            <ProtectedVendorRoute>
              <VendorOrders />
            </ProtectedVendorRoute>
          </VendorAuthProvider>
        } />

        {/* Food Admin */}
        <Route path="/food/admin/login" element={<AdminAuthProvider><FDAdminLogin /></AdminAuthProvider>} />
        <Route path="/food/admin/dashboard" element={
          <AdminAuthProvider>
            <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>
          </AdminAuthProvider>
        } />
        <Route path="/food/admin/vendors" element={
          <AdminAuthProvider>
            <ProtectedAdminRoute requiredPermission="manage_vendors"><VendorsManagement /></ProtectedAdminRoute>
          </AdminAuthProvider>
        } />
        <Route path="/food/admin/shops" element={
          <AdminAuthProvider>
            <ProtectedAdminRoute requiredPermission="manage_shops"><ShopsManagement /></ProtectedAdminRoute>
          </AdminAuthProvider>
        } />
        <Route path="/food/admin/orders" element={
          <AdminAuthProvider>
            <ProtectedAdminRoute requiredPermission="manage_orders"><OrdersManagement /></ProtectedAdminRoute>
          </AdminAuthProvider>
        } />
        <Route path="/food/admin/profile" element={
          <AdminAuthProvider>
            <ProtectedAdminRoute><ProfileSettings /></ProtectedAdminRoute>
          </AdminAuthProvider>
        } />
        </Routes>
      </SAAuthProvider>
    </div>
  )
}

export default App