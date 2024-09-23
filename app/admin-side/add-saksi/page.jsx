'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Settings = () => {
  const [distrik, setDistrik] = useState([])
  const [kampung, setKampung] = useState([])
  const [selectedDistrik, setSelectedDistrik] = useState('')
  const [selectedKampung, setSelectedKampung] = useState('')
  const [loadingKampung, setLoadingKampung] = useState(true)

  // pengambilan data distrik
  useEffect(() => {
    window.scrollTo(0, 0);
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const fetchDistrik = async () => {
      try {
        const url = 'http://localhost:3000/api/admin/all-distrik-only'
        const response = await axios.get(url, {
          headers:{
            'Accept':'application/json',
            'username':username,
            'password':password,
            'role':'admin'
          }
        })
        if (response.status === 200) {
          setDistrik(response.data.distrik)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchDistrik()
  },[])

  // pengambilan data kampung berdasarkan distrik
  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const fetchKampung = async () => {
      setLoadingKampung(true)
      try {
        const url = 'http://localhost:3000/api/admin/all-kampung-only'
        const data = {
          'distrik':selectedDistrik
        }
        const response = await axios.post(url, data,{
          headers:{
            'username':username,
            'password':password,
            'role':'admin',
            'Content-Type':'application/json'
          }
        })
        if (response.status === 200) {
          setKampung(response.data.kampung)
          console.log(response.data.kampung)
        }
      } catch (error) {
        console.log(error)
      }finally{
        setLoadingKampung(false)
      }
    }
    if (selectedDistrik !== '') {
      fetchKampung()
      setSelectedKampung('')
    }
  }, [selectedDistrik])


  const handleSelectDistrik = (e) => {
    setSelectedDistrik(e.target.value)
    console.log(e.target.value)
    // saat distrik di pilih dan request ke backend untuk mengambil data kampung berdasarkan distriknya
  }
  
  const handleSelectKampung = (e) => {
    setSelectedKampung(e.target.value)
    console.log(e.target.value)
  }

  return (
    <div className='flex flex-col h-screen w-screen items-center md:pt-16 justify-start gap-10'>
        <h4 className='font-semibold text-xl text-primary'>Tambahkan Saksi 😎</h4>
        <div className='flex flex-col gap-3'>
        <label className="input input-bordered flex items-center gap-2">
          <span className='text-primary'>Nama</span>
          <input type="text" className="grow" placeholder="Nama saksi" />
        </label>
        <select disabled={distrik.length === 0} onChange={handleSelectDistrik}  className="select select-bordered w-full max-w-xs">
          <option disabled selected>Distrik?</option>
          {distrik.length > 0 &&
          distrik.map((item) => (
            <option value={item.namaDistrik}>{item.namaDistrik}</option>
          ))
          }
          
        </select>

        <select disabled={loadingKampung} onChange={handleSelectKampung} className="select select-bordered w-full max-w-xs">
          <option disabled selected>Kampung?</option>
          {kampung.length > 0 &&
          kampung.map((item) => (
            <option value={item.namaKampung}>{item.namaKampung}</option>
          ))
          }
        </select>
        <label className="input input-bordered flex items-center gap-2">
          <span className='text-primary'>No TPS</span>
          <input type="text" className="grow" placeholder="Nomor TPS" />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <span className='text-primary'>Username</span>
          <input type="text" className="grow" placeholder="Pilih username" />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <span className='text-primary'>Password</span>
          <input type="text" className="grow" placeholder="Pilih password" />
        </label>
        <button className="btn btn-outline md:mt-5">Tambah</button>
        </div>
    </div>
  )
}

export default Settings