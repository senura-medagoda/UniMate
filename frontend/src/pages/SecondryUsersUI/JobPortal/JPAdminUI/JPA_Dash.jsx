import React from 'react'
import JPA_HeroDash from './JPA_Components/JPA_HeroDash.jsx'
import JPA_Nav from './JPA_Components/JPA_Nav.jsx'
import JPA_Footer from './JPA_Components/JPA_Footer.jsx'

const JPA_Dash = ({ user, setUser }) => {
  return (
    <div className='min-h-screen'>
            <JPA_Nav user={user} setUser={setUser}/>
            <JPA_HeroDash user={user}/>
            <JPA_Footer/>
    </div>
  )
}

export default JPA_Dash