


import React from 'react'
import { Route, Routes } from 'react-router'
import IndexPage from "./pages/IndexPage.jsx"
import Nav from "./pages/StudentUI/StudyMaterial/Components/Navbar.jsx"
import SMDash from "./pages/StudentUI/StudyMaterial/SMDash.jsx"
import Footer from "./pages/StudentUI/StudyMaterial/Components/Footer.jsx"
import Upload from "./pages/StudentUI/StudyMaterial/UploadSM";  // import upload page
import Brows from "./pages/StudentUI/StudyMaterial/BrowsSM";  // import browspage
import Req from "./pages/StudentUI/StudyMaterial/RequestSM";  // import browspage
import RequestedSM from "./pages/StudentUI/StudyMaterial/RequestedSM";
import TopandRecent from "./pages/StudentUI/StudyMaterial/Top_RecentSM";  // import browspage
import ForumSMM from "./pages/StudentUI/StudyMaterial/ForumSM"
import Admin from "./pages/SecondryUsersUI/StudyMaterial/SMAdminUI/AdminDash.jsx"
import About from "./pages/StudentUI/StudyMaterial/About.jsx"
import MyUploads from "./pages/StudentUI/StudyMaterial/MyUploads.jsx"
import MyRequests from "./pages/StudentUI/StudyMaterial/MyRequests.jsx"
import Profile from "./pages/StudentUI/StudyMaterial/Profile.jsx"

const App = () => {
  return (
    <div data-theme="emerald">
    <Nav/>
     <Routes>
        <Route path="/SMAdminDashboard" element={<Admin/>}/>
        <Route path="/StudyMaterialDash" element={<SMDash/>}/>
       {/* */} <Route path="/uploadSM" element={<Upload />} />
        <Route path="/BrowseSM" element={<Brows />} />
        <Route path="/RequestSM" element={<Req />} />
        <Route path="/RequestedSM" element={<RequestedSM />} />
        <Route path="/Top_RecentSM" element={<TopandRecent />} />
        <Route path="/ForumSM" element={<ForumSMM />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-uploads" element={<MyUploads />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
      <Footer/>
    </div>
  )
}

export default App