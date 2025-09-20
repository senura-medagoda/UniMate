import React from 'react'
import UM_Nav from './landingComponents/UM_Nav.jsx'
import UM_HeroContact from './landingComponents/UM_HeroContact.jsx'
import UM_Footer from './landingComponents/UM_Footer.jsx'


function ContactPage() {
    return (
        <div className='min-h-screen'>
           <UM_Nav/>
           <UM_HeroContact/>
           <UM_Footer/>
        </div>
    )
}

export default ContactPage