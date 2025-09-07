import React from 'react'
import UM_Nav from './landingComponents/UM_Nav.jsx'
import UM_HeroAbout from './landingComponents/UM_HeroAbout.jsx'

function AboutPage() {
    return (
        <div className='min-h-screen'>
            <UM_Nav/>
            <UM_HeroAbout/>
        </div>
    )
}

export default AboutPage