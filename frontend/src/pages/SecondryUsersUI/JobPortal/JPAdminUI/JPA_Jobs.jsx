import React from 'react'
import JPA_Nav from './JPA_Components/JPA_Nav'
import JPA_HeroJobs from './JPA_Components/JPA_HeroJobs'

function JPA_Jobs() {
    return (
        <div className='min-h-screen'>
            <JPA_Nav />
            <JPA_HeroJobs/>
        </div>
    )
}

export default JPA_Jobs