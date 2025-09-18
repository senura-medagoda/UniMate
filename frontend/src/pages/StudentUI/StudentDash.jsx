import React from 'react'

import STD_HeroDash from './DashComponents/STD_HeroDash'
import STD_Nav from './DashComponents/STD_Nav'


const StudentDash = ({user, setUser}) => {
  return (
    <div className='min-h-screen'>
        <STD_Nav setUser={setUser}/>
        <STD_HeroDash user={user}/>
    </div>
  )
}

export default StudentDash