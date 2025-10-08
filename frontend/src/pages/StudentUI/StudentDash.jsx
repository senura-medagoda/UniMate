import React from 'react'

import STD_HeroDash from './DashComponents/STD_HeroDash'
import STD_Nav from './DashComponents/STD_Nav'
import STD_Footer from './DashComponents/STD_Footer'


const StudentDash = ({user, setUser}) => {
  return (
    <div className='min-h-screen'>
        <STD_Nav user={user} setUser={setUser}/>
        <STD_HeroDash user={user}/>
        <STD_Footer/>
    </div>
  )
}

export default StudentDash