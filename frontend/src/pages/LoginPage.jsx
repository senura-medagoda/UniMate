import React from 'react'
import UM_MultiStepLogin from './landingComponents/UM_MultiStepLogin.jsx'
import UM_Nav from './landingComponents/UM_Nav.jsx'
import UM_Footer from './landingComponents/UM_Footer.jsx'

function LoginPage() {
    return (
        <div className='min-h-screen'>
            <UM_Nav/>
            <UM_MultiStepLogin/>
            <UM_Footer/>
        </div>
    )
}

export default LoginPage