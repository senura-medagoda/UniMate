import React from 'react'
import JPHM_Nav from './JPHM_Components/JPHM_Nav'
import HM_HeroProfile from './JPHM_Components/HM_HeroProfile'

function HM_profile() {
  return (
    <div className="min-h-screen">
        
        <JPHM_Nav/>
        <HM_HeroProfile/>
    </div>
  )
}

export default HM_profile