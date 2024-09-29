import Navbar from '@/app/component/navbar'
import React from 'react'

const DownloadLayout = ({children}) => {
  return (
    <>
    <Navbar />
    {children}
    </>
  )
}

export default DownloadLayout