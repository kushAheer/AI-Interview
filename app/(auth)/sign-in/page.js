import AuthForms from '@/components/AuthForms'
import React from 'react'

function page() {
  return (
    <>
    <div className="auth-layout">
      
      <AuthForms type="Login" />
    </div>
    </>
  )
}

export default page