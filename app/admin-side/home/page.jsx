"use client"
import HomeContent from '@/app/component/home-content';
import LeftMenu from '@/app/component/left-menu';
import TotalKabupaten from '@/app/component/total-kabupaten';
import { distrikorkampung, menuTerpilih } from '@/app/lib/globalState';
import axios from 'axios';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react'

const Home = () => {

  const [jumlah, setJumlah] = useState(0)
  const [title, setTitle] = useState('')
  const [updateTime, setUpdateTime] = useState('-')
  const [menu, setMenu] = useAtom(menuTerpilih)
  const [kampungordistrik, setKampungordistrik] = useAtom(distrikorkampung)

  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const usernameStored = localStorage.getItem('username');
    const passwordStored = localStorage.getItem('password');
    // window.scrollTo(0, 0);

    const getJumlahSuara = async () => {
      setLoading(true)
      try {
        const url = 'http://localhost:3000/api/admin/total-suara'
        const data = {
          "menu":menu,
          "kampungordistrik": kampungordistrik
        }

        const response = await axios.post(url, data, {
          headers:{
            'Content-Type':'application/json',
            'usernameAdmin':usernameStored,
            'passwordAdmin':passwordStored,
            'role':'admin'
          }
        })

        if (response.status === 200) {
          setTitle(response.data.title)
          setJumlah(response.data.jumlah)
          if (response.data.updateTime !== null) {
            setUpdateTime(response.data.updateTime)
          }
        }
      } catch (error) {
        console.log("Error", error)
      }finally{
        setLoading(false)
      }
    }
    
    getJumlahSuara()
  },[menu])
  

  return (
      <div className='md:pr-28 flex flex-row h-screen w-screen'>
        <LeftMenu />
        <HomeContent>
          <TotalKabupaten jumlah={jumlah} title={title} updateTime={updateTime} loading={loading} />
        </HomeContent>
      </div>
  )
}

export default Home