import React from 'react'
import UM_Nav from '../landingComponents/UM_Nav'
import SA_LoginHero from './AdminLoginComponents/SA_LoginHero'

const SA_LoginPage = () => {
  return (
   <div className="min-h-screen">
        <UM_Nav/>
        <SA_LoginHero/>
    </div>
  )
}

export default SA_LoginPage