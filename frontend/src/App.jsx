import React from 'react'
import { Route, Routes } from 'react-router'
import IndexPage from "./pages/IndexPage.jsx"
import JP_index from "./pages/StudentUI/JobPortal/JP_index.jsx"
import JP_jobs from './pages/StudentUI/JobPortal/JP_jobs.jsx'

const App = () => {
  return (
    <div data-theme="emerald" className="relative h-full w-full">
    
      <Routes>
        <Route path="/" element={<IndexPage/>}/>
        <Route path="/jobdash" element = {<JP_index/>}/>
        <Route path="/jobs" element = {<JP_jobs/>}/>
      </Routes>
    </div>
  )
}

export default App