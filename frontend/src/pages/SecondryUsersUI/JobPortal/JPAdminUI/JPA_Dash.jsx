import React from 'react'
import JPA_HeroDash from './JPA_Components/JPA_HeroDash.jsx'
import JPA_Nav from './JPA_Components/JPA_Nav.jsx'

const JPA_Dash = () => {
  return (
    <div className='min-h-screen'>
            <JPA_Nav/>
            <JPA_HeroDash/>
    </div>
  )
}

export default JPA_Dash