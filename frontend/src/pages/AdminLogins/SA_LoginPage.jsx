import React from 'react'
import UM_Nav from '../landingComponents/UM_Nav'
import SA_LoginHero from './AdminLoginComponents/SA_LoginHero'
import { SAAuthProvider } from '../../context/SAAuthContext'

const SA_LoginPage = () => {
  return (
   <div className="min-h-screen">
        <UM_Nav/>
        <SAAuthProvider>
          <SA_LoginHero/>
        </SAAuthProvider>
    </div>
  )
}

export default SA_LoginPage