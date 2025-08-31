


import React from 'react'
import { Route, Routes } from 'react-router'
import IndexPage from "./pages/IndexPage.jsx"
import Nav from "./pages/StudentUI/StudyMaterial/Components/Navbar.jsx"
import SMDash from "./pages/StudentUI/StudyMaterial/SMDash.jsx"
import Footer from "./pages/StudentUI/StudyMaterial/Components/Footer.jsx"
import Upload from "./pages/StudentUI/StudyMaterial/UploadSM";  // import upload page
import Brows from "./pages/StudentUI/StudyMaterial/BrowsSM";  // import browspage
import Req from "./pages/StudentUI/StudyMaterial/RequestSM";  // import browspage
import TopandRecent from "./pages/StudentUI/StudyMaterial/Top_RecentSM";  // import browspage
import ForumSMM from "./pages/StudentUI/StudyMaterial/ForumSM"
const App = () => {
  return (
    <div data-theme="emerald">
    <Nav/>
     <Routes>
        <Route path="/StudyMaterialDash" element={<SMDash/>}/>
       {/* */} <Route path="/uploadSM" element={<Upload />} />
        <Route path="/BrowseSM" element={<Brows />} />
        <Route path="/RequestSM" element={<Req />} />
        <Route path="/Top_RecentSM" element={<TopandRecent />} />
        <Route path="/ForumSM" element={<ForumSMM />} />

      </Routes>
      <Footer/>
    </div>
  )
}

export default App