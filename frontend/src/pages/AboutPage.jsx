import React from 'react'
import UM_Nav from './landingComponents/UM_Nav.jsx'
import UM_HeroAbout from './landingComponents/UM_HeroAbout.jsx'
import UM_Footer from './landingComponents/UM_Footer.jsx'

function AboutPage() {
    return (
        <div className='min-h-screen'>
            <UM_Nav/>
            <UM_HeroAbout/>
            <UM_Footer/>
        </div>
    )
}

export default AboutPage