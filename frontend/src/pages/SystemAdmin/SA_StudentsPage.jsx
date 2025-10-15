import React from 'react'
import SA_Nav from './SA_Components/SA_Nav.jsx'
import SA_HeroStudents from './SA_Components/SA_HeroStudents.jsx'
import SA_Footer from './SA_Components/SA_Footer.jsx'

const SA_StudentsPage = ({ user, setUser }) => {
  return (
    <div className='min-h-screen'>
        <SA_Nav user={user} setUser={setUser}/>
        <SA_HeroStudents user={user}/>
        <SA_Footer/>
    </div>
  )
}

export default SA_StudentsPage