import React from 'react'
import Navbar from './landingComponents/Navbar'
import UM_Nav from './landingComponents/UM_Nav'
import UM_HeroIndex from './landingComponents/UM_HeroIndex'
import UM_Footer from './landingComponents/UM_Footer'

const index = () => {

  //Comment
  //Comment 2
  return (
    <div className='min-h-screen'> 
    <UM_Nav/>
    <UM_HeroIndex/>
    <UM_Footer/>
      
    </div>
  )
}

export default index