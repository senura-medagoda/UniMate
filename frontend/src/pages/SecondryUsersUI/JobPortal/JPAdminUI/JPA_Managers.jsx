import React from 'react'
import JPA_Nav from './JPA_Components/JPA_Nav'
import JPA_HeroManagers from './JPA_Components/JPA_HeroManagers'
import JPA_Footer from './JPA_Components/JPA_Footer'

function JPA_Managers({ user, setUser }) {
    return (
        <div className='min-h-screen'>
            <JPA_Nav user={user} setUser={setUser}/>
            <JPA_HeroManagers user={user}/>
            <JPA_Footer/>
        </div>
    )
}

export default JPA_Managers