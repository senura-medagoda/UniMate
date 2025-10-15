import React from 'react'
import JPA_Nav from './JPA_Components/JPA_Nav'
import JPA_HeroReports from './JPA_Components/JPA_HeroReports'
import JPA_Footer from './JPA_Components/JPA_Footer'

function JPA_Reports({ user, setUser }) {
  return (
    <div className='min-h-screen'>
      <JPA_Nav user={user} setUser={setUser}/>
      <JPA_HeroReports user={user}/>
      <JPA_Footer/>
    </div>
  )
}

export default JPA_Reports