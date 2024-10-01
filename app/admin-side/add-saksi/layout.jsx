import Navbar from '@/app/component/navbar'
import React from 'react'

const SettingsLayout = ({children}) => {
  return (
    
    <>
    <Navbar />
    {children}
    </>
  )
}

export default SettingsLayout