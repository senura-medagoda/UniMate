import React from 'react'
import { Route, Routes } from 'react-router'
import IndexPage from "./pages/IndexPage.jsx"
import Navbar from './pages/landingComponents/Navbar.jsx'
import Home from './pages/StudentUI/FoodOrder/pages/Home.jsx'

const App = () => {
  return (
    <div data-theme="emerald">
    
      <Routes>
        <Route path="/" element={<IndexPage/>}/>
        <Route path="/food" element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App