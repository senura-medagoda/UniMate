import React from 'react'
import SA_Nav from './SA_Components/SA_Nav.jsx'
import SA_Footer from './SA_Components/SA_Footer.jsx'
import SA_HeroAdmin from './SA_Components/SA_HeroAdmin.jsx'


const SA_AdminsPage = () => {
  return (
    <div className='min-h-screen'>
      <SA_Nav/>
      <SA_HeroAdmin/>
      <SA_Footer/>
    </div>
  )
}

export default SA_AdminsPage