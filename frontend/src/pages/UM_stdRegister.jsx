import React from 'react'
import UM_HeroRegister from './landingComponents/UM_HeroRegister'
import UM_Footer from './landingComponents/UM_Footer'
import UM_Nav from './landingComponents/UM_Nav'

const UM_stdRegister = () => {
  return (
    <div className='min-h-screen'>
      <UM_Nav/>
      <UM_HeroRegister/>
      <UM_Footer/>
    </div>
  )
}

export default UM_stdRegister