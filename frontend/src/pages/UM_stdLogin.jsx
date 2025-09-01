import React from 'react'
import UM_Nav from './landingComponents/UM_Nav'
import UM_HeroLoginStd from './landingComponents/UM_HeroLoginStd'


const UM_stdLogin = () => {
    return (
        <div className='min-h-screen'>
            <UM_Nav/>
            <UM_HeroLoginStd/>
        </div>
    )
}

export default UM_stdLogin