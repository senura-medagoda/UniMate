import React from 'react'
import JPA_Nav from './JPA_Components/JPA_Nav'
import JPA_HeroJobs from './JPA_Components/JPA_HeroJobs'
import JPA_Footer from './JPA_Components/JPA_Footer'

function JPA_Jobs({ user, setUser }) {
    return (
        <div className='min-h-screen'>
            <JPA_Nav user={user} setUser={setUser}/>
            <JPA_HeroJobs user={user}/>
            <JPA_Footer/>
        </div>
    )
}

export default JPA_Jobs