import React from 'react'
import UM_Nav from './landingComponents/UM_Nav'
import UM_HeroLoginStd from './landingComponents/UM_HeroLoginStd'
import UM_Footer from './landingComponents/UM_Footer'


const UM_stdLogin = () => {
    return (
        <div className='min-h-screen'>
            <UM_Nav/>
            <UM_HeroLoginStd/>
            <UM_Footer/>
        </div>
    )
}

export default UM_stdLogin