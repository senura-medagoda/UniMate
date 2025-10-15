import React from 'react'
import HM_HeroNewjob from './JPHM_Components/HM_HeroNewjob'
import JPHM_Nav from './JPHM_Components/JPHM_Nav'
import JPHM_Footer from './JPHM_Components/JPHM_Footer'

function HM_newjob({ user, setUser }) {
  return (
    <div className="min-h-screen">
        <JPHM_Nav user={user} setUser={setUser}/>
        <HM_HeroNewjob user={user}/>
        <JPHM_Footer/>
    </div>
  )
}

export default HM_newjob