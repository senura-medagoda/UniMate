import React from 'react'
import { Route, Routes } from 'react-router'
import IndexPage from "./pages/IndexPage.jsx"
import CreateBoardingPlace from './pages/SecondryUsersUI/Accommodation/BordingOwner/createBoardingPlace.jsx';
import OwnerDashboard from './pages/SecondryUsersUI/Accommodation/BordingOwner/ownerDashboard.jsx';

const App = () => {
  return (
    <div data-theme="emerald">
      <Routes>
        <Route path="/" element={<IndexPage/>}/>
        <Route path="/create-boarding-place" element={<CreateBoardingPlace />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      </Routes>
    </div>
  )
}

export default App