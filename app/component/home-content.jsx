import React from 'react'

const HomeContent = ({children}) => {
  return (
    <div className='flex w-9/12 '>
          <div className='flex flex-1 flex-col gap-6 items-center md:py-10 overflow-x-auto h-full'>
            <div className='flex flex-1 justify-start'>
              
              {children}
              
            </div>
            
          </div>
        </div>
  )
}

export default HomeContent