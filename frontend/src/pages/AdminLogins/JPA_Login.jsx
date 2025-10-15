import React from 'react'
import JPA_HeroLogin from './AdminLoginComponents/JPA_HeroLogin'
import UM_Nav from '../landingComponents/UM_Nav'

const JPA_Login = () => {
  return (
    <div className="min-h-screen">
        <UM_Nav/>
        <JPA_HeroLogin/>
        
    </div>
  )
}

export default JPA_Login