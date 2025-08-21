import Editor from '@/components/Editor'
import { redirect } from 'next/navigation'
import React from 'react'

function page() {



  return redirect('/dashboard');

  return (
    <>
        {/* <Editor /> */}
    </>
  )
}

export default page