import React from 'react'
import JPA_Nav from './JPA_Components/JPA_Nav'
import JPA_HeroProfile from './JPA_Components/JPA_HeroProfile'

function JPA_Profile() {
  return (
    <div className='min-h-screen'>
      <JPA_Nav/>
      <JPA_HeroProfile/>
    </div>
  )
}

export default JPA_Profile