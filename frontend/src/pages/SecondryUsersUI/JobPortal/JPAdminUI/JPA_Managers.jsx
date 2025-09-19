import React from 'react'
import JPA_Nav from './JPA_Components/JPA_Nav'
import JPA_HeroManagers from './JPA_Components/JPA_HeroManagers'

function JPA_Managers() {
    return (
        <div className='min-h-screen'>
            <JPA_Nav />
            <JPA_HeroManagers/>
        </div>
    )
}

export default JPA_Managers