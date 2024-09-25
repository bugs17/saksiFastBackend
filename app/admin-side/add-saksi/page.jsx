'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Settings = () => {
  const [distrik, setDistrik] = useState([])
  const [kampung, setKampung] = useState([])
  const [loadingKampung, setLoadingKampung] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)



  const [selectedDistrik, setSelectedDistrik] = useState('')
  const [selectedKampung, setSelectedKampung] = useState('')
  const [nama, setNama] = useState('')
  const [noTps, setNoTps] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [listSaksi, setListSaksi] = useState([])

  const [sukesesMsg, setSuksesMsg] = useState(false)



  // pengambilan data distrik
  useEffect(() => {
    window.scrollTo(0, 0);
    const usernameStored = localStorage.getItem('username');
    const passwordStored = localStorage.getItem('password');
    const fetchDistrik = async () => {
      try {
        const url = 'http://localhost:3000/api/admin/all-distrik-only'
        const response = await axios.get(url, {
          headers:{
            'Accept':'application/json',
            'username':usernameStored,
            'password':passwordStored,
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
    const usernameStored = localStorage.getItem('username');
    const passwordStored = localStorage.getItem('password');
    const fetchKampung = async () => {
      setLoadingKampung(true)
      try {
        const url = 'http://localhost:3000/api/admin/all-kampung-only'
        const data = {
          'distrik':selectedDistrik
        }
        const response = await axios.post(url, data,{
          headers:{
            'username':usernameStored,
            'password':passwordStored,
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

  const handleSubmit = async () => {
    if (selectedDistrik === '' || selectedKampung === '' || nama === '' || noTps === '' || username === '' || password === '') {
      return alert("Lengkapi data saksi sebelum kirim 🥱")
    }
    setLoadingSubmit(true)

    try {
      const usernameStored = localStorage.getItem('username');
      const passwordStored = localStorage.getItem('password');
      const url = 'http://localhost:3000/api/admin/add-saksi'
      const data = {
        'nama':nama,
        'distrik':selectedDistrik,
        'kampung':selectedKampung,
        'noTps':noTps,
        'username':username,
        'password':password
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
        setListSaksi([response.data.saksi])
        setNama('')
        setNoTps('')
        setUsername('')
        setPassword('')
        setSelectedDistrik('')
        setSelectedKampung('')
        console.log(response.data.saksi)
      }
    } catch (error) {
      alert('Gagal menambahkan saksi. coba lagi! jika terus terjadi segera hubungi admin')
    }finally{
      setLoadingSubmit(false)
    }

    
  }

  return (
    <div className='flex h-screen w-screen   '>

      {/* list saksi */}
        <div className='w-1/6 shadow overflow-y-scroll bg-base-200'>
          <ul className="menu bg-base-200 rounded-box w-56">
            <li>
              <h2 className="menu-title">Semua saksi</h2>
              <ul>
                {listSaksi.length > 0 
                &&
                listSaksi.map((item, index) => (
                  <li key={index}><span className='cursor-pointer'>{item.nama}</span></li>
                ))
                }
                
              </ul>
            </li>
          </ul>
        </div>

        {/* form add saksi */}
        <div className='w-4/6 flex flex-col justify-start gap-10 items-center md:pt-16 overflow-y-scroll'>
          <h4 className='font-semibold text-xl text-primary'>Tambahkan Saksi 😎</h4>
          <div className='flex flex-col gap-3'>
          <label className="input input-bordered flex items-center gap-2 input-sm max-w-xs">
            <span className='text-primary'>Nama</span>
            <input onChange={(e) => setNama(e.target.value)} value={nama} type="text" className="grow" placeholder="Nama saksi" />
          </label>
          <select disabled={distrik.length === 0} onChange={handleSelectDistrik} value={selectedDistrik}  className="select select-bordered w-full max-w-xs select-sm">
            <option disabled selected>Distrik?</option>
            {distrik.length > 0 &&
            distrik.map((item) => (
              <option value={item.namaDistrik}>{item.namaDistrik}</option>
            ))
            }
            
          </select>

          <select disabled={loadingKampung} onChange={handleSelectKampung} value={selectedKampung} className="select select-bordered w-full max-w-xs select-sm">
            <option disabled selected>Kampung?</option>
            {kampung.length > 0 &&
            kampung.map((item) => (
              <option value={item.namaKampung}>{item.namaKampung}</option>
            ))
            }
          </select>

          <label className="input input-bordered flex items-center gap-2 input-sm max-w-xs">
            <span className='text-primary'>No TPS</span>
            <input onChange={(e) => setNoTps(e.target.value)} value={noTps} type="text" className="grow" placeholder="Nomor TPS" />
          </label>

          <label className="input input-bordered flex items-center gap-2 input-sm max-w-xs">
            <span className='text-primary'>Username</span>
            <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" className="grow" placeholder="Pilih username" />
          </label>

          <label className="input input-bordered flex items-center gap-2 input-sm max-w-xs">
            <span className='text-primary'>Password</span>
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="text" className="grow" placeholder="Pilih password" />
          </label>
            {loadingSubmit 
            ? 
              <span className="loading loading-spinner loading-lg self-center"></span>
            :
              <button onClick={handleSubmit} className="btn btn-sm btn-outline md:mt-5">Tambah</button>
            }
          </div>
          <div className="toast toast-bottom toast-center">
              <div className="alert alert-error">
                <span>data</span>
                <span onClick={() => setSuksesMsg(false)} className="cursor-pointer">X</span>

              </div>
          </div>
          </div>

        {/* show saksi */}
        <div className='w-1/6 shadow overflow-y-scroll'>

        </div>

    </div>
  )
}

export default Settings