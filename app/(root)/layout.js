import NavBar from '@/components/NavBar'
import React from 'react'

function layout({ children }) {
  return (
    <>
    <div className='root-layout'>
      <NavBar />
        {children}
    </div>
        
    </>
  )
}

export default layout