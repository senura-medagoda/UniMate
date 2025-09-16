import React from 'react'
import UM_Nav from './landingComponents/UM_Nav.jsx'
import UM_HeroServices from './landingComponents/UM_HeroServices.jsx'
import UM_Footer from './landingComponents/UM_Footer.jsx'

function ServicesPage() {
    return (
        <div className='min-h-screen'>
            <UM_Nav />
            <UM_HeroServices/>
            <UM_Footer/>
        </div>
    )
}

export default ServicesPage