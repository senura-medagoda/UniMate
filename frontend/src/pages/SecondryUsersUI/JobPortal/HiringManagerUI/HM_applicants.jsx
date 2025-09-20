import React from 'react'
import JPHM_Nav from './JPHM_Components/JPHM_Nav'
import HM_HeroApplicants from './JPHM_Components/HM_HeroApplicants'

function HM_applicants() {
  return (
    <div className="min-h-screen">
        
        <JPHM_Nav/>
        <HM_HeroApplicants/>
    </div>
  )
}

export default HM_applicants