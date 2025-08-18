import React from 'react'
import { Route, Routes } from 'react-router'
import IndexPage from "./pages/IndexPage.jsx"

const App = () => {
  return (
    <div data-theme="emerald">
    
      <Routes>
        <Route path="/" element={<IndexPage/>}/>
      </Routes>
    </div>
  )
}

export default App