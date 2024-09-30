'use client'
import React from 'react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const Provider = ({children}) => {
  return (
    <>
        <ProgressBar color={'#ef9995'} shallowRouting options={{showSpinner:false}} />
        {children}
    </>
  )
}

export default Provider