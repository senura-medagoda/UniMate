import React from 'react'
import SA_Nav from './SA_Components/SA_Nav.jsx'
import SA_HeroDash from './SA_Components/SA_HeroDash.jsx'
import SA_Footer from './SA_Components/SA_Footer.jsx'

const SA_Dash = () => {
  return (
    <div className='min-h-screen'>
        <SA_Nav/>
        <SA_HeroDash/>
        <SA_Footer/>
    </div>
    

  )
}

export default SA_Dash