import React from 'react'
import M_Hero from '../components/M_Hero'
import M_LatestCollection from '../components/M_LatestCollection'
import M_BestSeller from '../components/M_BestSeller'

const MarketPlace_Home = () => {
  return (
    <div>
      <M_Hero/>
      <M_LatestCollection/>
      <M_BestSeller/>
      
    </div>
  )
}

export default MarketPlace_Home
