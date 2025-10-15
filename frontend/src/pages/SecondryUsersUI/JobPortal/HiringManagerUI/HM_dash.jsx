import React from 'react'
import JPHM_Nav from './JPHM_Components/JPHM_Nav'
import HM_HeroDash from './JPHM_Components/HM_HeroDash'
import JPHM_Footer from './JPHM_Components/JPHM_Footer'

function HM_dash({ user, setUser }) {
  return (
    <div className="min-h-screen">
        <JPHM_Nav user={user} setUser={setUser}/>
        <HM_HeroDash user={user}/>
        <JPHM_Footer/>
    </div>
  )
}

export default HM_dash