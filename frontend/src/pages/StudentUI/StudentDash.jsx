import React from 'react'
import UM_Nav from '../landingComponents/UM_Nav'
import STD_HeroDash from './DashComponents/STD_HeroDash'
import STD_Nav from './DashComponents/STD_Nav'


const StudentDash = () => {
  return (
    <div className='min-h-screen'>
        <STD_Nav/>
        <STD_HeroDash/>
    </div>
  )
}

export default StudentDash