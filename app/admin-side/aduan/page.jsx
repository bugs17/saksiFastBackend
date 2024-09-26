
'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Aduan = () => {

    const [listAduan, setListAduan] = useState([])
    const [aduan, setAduan] = useState([])

    useEffect(() => {
        const usernameStored = localStorage.getItem('username');
        const passwordStored = localStorage.getItem('password');
        const getAllAduan = async () => {
            try {
                
                const url = "http://localhost:3000/api/admin/all-aduan"
                const response = await axios.get(url,{
                    headers:{
                    'Accept':'application/json',
                    'username':usernameStored,
                    'password':passwordStored,
                    'role':'admin'
                    }
                })
                if (response.status === 200) {
                    setListAduan([...response.data.aduan])
                }
            } catch (error) {
                console.log("Erooorrr", error)
            }
        }
        getAllAduan()
        console.log(usernameStored, passwordStored)
    }, [])

  return (
    <div className='flex h-screen w-screen'>
        <div className='w-1/6 shadow overflow-y-scroll bg-base-200'>
        <ul className="menu bg-base-200 rounded-box w-56">
            <li>
              <h2 className="menu-title">{listAduan.length > 0 ? 'Semua Aduan' : "Tidak ada aduan"}</h2>
              <ul>
                {listAduan.length > 0 &&
                    listAduan.map((item) => (
                        <li key={item.id} className='flex flex-row justify-between'>
                            <span>Nama Saksi</span>
                        </li>
                    ))
                    
                }
                
              </ul>
            </li>
          </ul>
        </div>

        <div className='w-4/6 flex flex-col justify-start gap-10 items-center md:pt-16 md:pb-16 md:px-10 overflow-y-scroll'>
            {aduan.length > 0 && 
            <article class="prose flex flex-col gap-2">
                <h1 className='text-primary'>Keterangan:</h1>
                <p>
                    For years parents have espoused the health benefits of eating garlic bread with cheese to their
                    children, with the food earning such an iconic status in our culture that kids will often dress
                    up as warm, cheesy loaf for Halloween.
                </p>

                <div className=' self-center border-2 border-black mt-5'>
                    <Image alt='gambar-aduan' height={500} width={500} src={'https://diskominfo.patikab.go.id/asset/foto_berita/SPAN_lapor.jpg'} />
                </div>
                
            </article>}
        </div>

        <div className='w-1/6 shadow max-w-lg overflow-y-scroll md:pt-5 md:pl-3'></div>
    </div>
  )
}

export default Aduan