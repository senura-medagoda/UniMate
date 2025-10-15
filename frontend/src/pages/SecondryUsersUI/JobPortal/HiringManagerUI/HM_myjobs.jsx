import React from 'react'
import JPHM_Nav from './JPHM_Components/JPHM_Nav'
import HM_HeroMyjobs from './JPHM_Components/HM_HeroMyjobs'
import JPHM_Footer from './JPHM_Components/JPHM_Footer'

function HM_myjobs({ user, setUser }) {
  return (
    <div className="min-h-screen">
        <JPHM_Nav user={user} setUser={setUser}/>
        <HM_HeroMyjobs user={user}/>
        <JPHM_Footer/>
    </div>
  )
}

export default HM_myjobs