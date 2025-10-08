import React from 'react'
import SA_Nav from './SA_Components/SA_Nav.jsx'
import SA_HeroStudents from './SA_Components/SA_HeroStudents.jsx'
import SA_Footer from './SA_Components/SA_Footer.jsx'

const SA_StudentsPage = () => {
  return (
    <div className='min-h-screen'>
        <SA_Nav/>
        <SA_HeroStudents/>
        <SA_Footer/>
    </div>
  )
}

export default SA_StudentsPage