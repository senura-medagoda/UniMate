import React from 'react'
import UM_HeroLogin from './landingComponents/UM_HeroLogin.jsx'
import UM_Nav from './landingComponents/UM_Nav.jsx'

function LoginPage() {
    return (
        <div className='min-h-screen'>
            <UM_Nav/>
            <UM_HeroLogin/>
        </div>
    )
}

export default LoginPage