import React from 'react'
import JP_Nav from './JP_components/JP_Nav'
import JP_HeroDash from './JP_components/JP_HeroDash'
import JP_Footer from './JP_components/JP_Footer'


const JP_index = () => {
  return (
    <div className="min-h-screen">
        <JP_Nav/>
        <JP_HeroDash/>
        <JP_Footer/>
    </div>
  )
}

export default JP_index