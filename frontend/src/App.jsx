import React from 'react'
import { Route, Routes } from 'react-router'
import IndexPage from "./pages/IndexPage.jsx"

const App = () => {
  return (
    <div data-theme="emerald">

    

      <button className='btn btn-outline'>Click</button>

      <Routes>
        <Route path="/" element={<IndexPage/>}/>
      </Routes>
    </div>
  )
}

export default App