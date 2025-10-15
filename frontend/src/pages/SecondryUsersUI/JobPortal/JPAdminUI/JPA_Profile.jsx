import React from 'react'
import JPA_Nav from './JPA_Components/JPA_Nav'
import JPA_HeroProfile from './JPA_Components/JPA_HeroProfile'
import JPA_Footer from './JPA_Components/JPA_Footer'

function JPA_Profile({ user, setUser }) {
  return (
    <div className='min-h-screen'>
      <JPA_Nav user={user} setUser={setUser}/>
      <JPA_HeroProfile user={user}/>
      <JPA_Footer/>
    </div>
  )
}

export default JPA_Profile