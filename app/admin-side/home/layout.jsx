import Navbar from '@/app/component/navbar'
import React from 'react'

const HomeLayout = ({children}) => {
  return (
    <>
    <Navbar />
    {children}
    </>
  )
}

export default HomeLayout