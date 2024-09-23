"use client"
import HomeContent from '@/app/component/home-content';
import LeftMenu from '@/app/component/left-menu';
import TotalKabupaten from '@/app/component/total-kabupaten';
import React, { useEffect } from 'react'

const Home = () => {
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    window.scrollTo(0, 0);
  })
  

  return (
      <div className='md:pr-28 flex flex-row h-screen w-screen'>
        <LeftMenu />
        <HomeContent>
          <TotalKabupaten />
        </HomeContent>
      </div>
  )
}

export default Home