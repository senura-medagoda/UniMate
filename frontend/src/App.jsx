import React from 'react'
import { Route, Routes } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'
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
import ServicesPage from './pages/servicesPage.jsx'
import ContactPage from './pages/ContactPage.jsx'



const App = () => {
  return (
    <div data-theme="emerald" className="relative h-full w-full">
      
    

      <Routes>
        
        <Route path="/" element={<IndexPage/>}/>
        <Route path="/services" element={<ServicesPage/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/contact" element={<ContactPage/>}/>


        <Route path="/food" element={<Home/>}/>
        <Route path="/login-std" element={<UM_stdLogin/>}/>



        <Route path="/jobdash" element = {<JP_index/>}/>
        <Route path="/jobs" element = {<JP_jobs/>}/>
        <Route path="/applications" element = {<JP_application/>}/>
        <Route path="/jobprofile" element = {<JP_profile/>}/>
        <Route path="/hmdash" element = {<HM_dash/>}/>
        <Route path="/myjobs" element = {<HM_myjobs/>}/>
        <Route path="/applicants" element = {<HM_applicants/>}/>
        <Route path="/hmprofile" element = {<HM_profile/>}/>
        <Route path="/addnewjob" element = {<HM_newjob/>}/>


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



      </Routes>
      
    </div>
  )
}


export default App

