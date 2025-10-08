import React from 'react'
import SA_Nav from './SA_Components/SA_Nav.jsx'
import SA_HeroReports from './SA_Components/SA_HeroReports.jsx'
import SA_Footer from './SA_Components/SA_Footer.jsx'

const SA_ReportsPage = () => {
  return (
    <div className='min-h-screen'>
        <SA_Nav/>
        <SA_HeroReports/>
        <SA_Footer/>
    </div>
  )
}

export default SA_ReportsPage