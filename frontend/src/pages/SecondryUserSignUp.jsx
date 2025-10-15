import React from 'react'
import UM_Nav from './landingComponents/UM_Nav.jsx'
import UM_Footer from './landingComponents/UM_Footer.jsx'
import SU_HeroSignupHub from './landingComponents/SU_HeroSignupHub.jsx'

const SecondryUserSignUp = () => {
  return (
    <div className='min-h-screen'>
        <UM_Nav/>
        <SU_HeroSignupHub/>         
        <UM_Footer/>
    </div>
  )
}

export default SecondryUserSignUp