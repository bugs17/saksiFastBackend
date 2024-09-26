import Navbar from '@/app/component/navbar'
import React from 'react'

const AduanLayout = ({children}) => {
  return (
    <>
    <Navbar />
    {children}
    </>
  )
}

export default AduanLayout