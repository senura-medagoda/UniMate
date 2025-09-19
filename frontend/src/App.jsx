import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useState ,useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import IndexPage from "./pages/IndexPage.jsx"
import Navbar from './pages/landingComponents/Navbar.jsx'
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
import MarketPlace_Login from "./pages/StudentUI/Marketplace/pages/MarketPlace_Login.jsx"
import MarketPlace_PlaceOrder from "./pages/StudentUI/Marketplace/pages/MarketPlace_PlaceOrder.jsx"
import MarketPlace_Orders from "./pages/StudentUI/Marketplace/pages/MarketPlace_Orders.jsx"
import M_Add from './pages/SecondryUsersUI/Marketplace/pages/M_Add.jsx'
import Admin_Orders from './pages/SecondryUsersUI/Marketplace/pages/Admin_Orders.jsx'
import M_List from './pages/SecondryUsersUI/Marketplace/pages/M_List.jsx'
import UM_stdLogin from './pages/UM_stdLogin.jsx'

import CreateBoardingPlace from './pages/SecondryUsersUI/Accommodation/BordingOwner/createBoardingPlace.jsx';
import OwnerDashboard from './pages/SecondryUsersUI/Accommodation/BordingOwner/ownerDashboard.jsx';
import EditBoardingPlace from './pages/SecondryUsersUI/Accommodation/BordingOwner/editBoardingPlace.jsx';
import OwnerSignup from './pages/SecondryUsersUI/Accommodation/BordingOwner/ownerSignup.jsx';
import OwnerLogin from './pages/SecondryUsersUI/Accommodation/BordingOwner/ownerLogin.jsx';
import AdminDash from './pages/SecondryUsersUI/Accommodation/AccAdminUI/AdminDash.jsx';
import AdminLogin from './pages/SecondryUsersUI/Accommodation/AccAdminUI/AdminLogin.jsx';

// Student Accommodation Pages
import StudentAccommodationDashboard from './pages/StudentUI/Accommodation/StudentAccommodationDashboard.jsx';
import BoardingPlacesPage from './pages/StudentUI/Accommodation/BoardingPlacesPage.jsx';
import MyBookingsPage from './pages/StudentUI/Accommodation/MyBookingsPage.jsx';
import ServicePage from './pages/StudentUI/Accommodation/ServicesPage.jsx';

import SMDash from "./pages/StudentUI/StudyMaterial/SMDash.jsx"
import Upload from "./pages/StudentUI/StudyMaterial/UploadSM";  // import upload page
import Brows from "./pages/StudentUI/StudyMaterial/BrowsSM";  // import browspage
import Req from "./pages/StudentUI/StudyMaterial/RequestSM";  // import browspage
import TopandRecent from "./pages/StudentUI/StudyMaterial/Top_RecentSM";  // import browspage
import ForumSMM from "./pages/StudentUI/StudyMaterial/ForumSM"
import HM_dash from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_dash.jsx'
import HM_myjobs from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_myjobs.jsx'
import HM_applicants from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_applicants.jsx'
import HM_profile from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_profile.jsx'
import HM_newjob from './pages/SecondryUsersUI/JobPortal/HiringManagerUI/HM_newjob.jsx'
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



const App = () => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('studentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
      
    

      <Routes>
        
        <Route path="/" element={<IndexPage/>}/>
        <Route path="/services" element={<ServicesPage/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>


        <Route path="/food" element={<Home/>}/>
        <Route path="/login-std" element={user ? <Navigate to="/std-dash"/> : <UM_stdLogin setUser={updateUser}/>}/>
        <Route path="/stdregister" element={user ? <Navigate to="/std-dash"/> :<UM_stdRegister/>}/>


       <Route
          path="/std-dash"
            element={
            <ProtectedRoute user={user}>
            <StudentDash user={user} setUser={updateUser} />
            </ProtectedRoute>
           }
        />

        <Route path="/jobdash" element = {<JP_index/>}/>
        <Route path="/jobs" element = {<JP_jobs/>}/>
        <Route path="/applications" element = {<JP_application/>}/>
        <Route path="/jobprofile" element = {<JP_profile/>}/>


        <Route path="/hmdash" element = {<HM_dash/>}/>
        <Route path="/myjobs" element = {<HM_myjobs/>}/>
        <Route path="/applicants" element = {<HM_applicants/>}/>
        <Route path="/hmprofile" element = {<HM_profile/>}/>
        <Route path="/addnewjob" element = {<HM_newjob/>}/>

        <Route path="/jpadmin-dash" element = {<JPA_Dash/>}/>
        <Route path="/jpadmin-jobs" element = {<JPA_Jobs/>}/>
        <Route path="/jpadmin-reports" element = {<JPA_Reports/>}/>
        <Route path="/jpadmin-managers" element = {<JPA_Managers/>}/>
        <Route path="/jpadmin-profile" element = {<JPA_Profile/>}/>



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
        <Route path="/create-boarding-place" element={<CreateBoardingPlace />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          
          
        <Route path="/StudyMaterialDash" element={<SMDash/>}/>
        <Route path="/uploadSM" element={<Upload />} />
        <Route path="/BrowseSM" element={<Brows />} />
        <Route path="/RequestSM" element={<Req />} />
        <Route path="/Top_RecentSM" element={<TopandRecent />} />
        <Route path="/ForumSM" element={<ForumSMM />} />

        {/* Owner Routes */}
        <Route path="/create-boarding-place" element={<CreateBoardingPlace />} />
        <Route path="/edit-boarding-place/:placeId" element={<EditBoardingPlace />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/signup" element={<OwnerSignup />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
          
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/accommodation" element={<AdminDash />} />
          
        {/* Student Accommodation Routes */}
        <Route path="/student/accommodation" element={<StudentAccommodationDashboard />} />
        <Route path="/student/accommodation/boarding-places" element={<BoardingPlacesPage />} />
        <Route path="/student/accommodation/my-bookings" element={<MyBookingsPage />} />
        <Route path="/student/accommodation/services" element={<ServicePage />} />



      </Routes>
      
    </div>
  )
}


export default App

