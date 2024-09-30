'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MdDelete } from "react-icons/md";

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
  const [hp, setHp] = useState('')

  const [listSaksi, setListSaksi] = useState([])
  const [sukesesMsg, setSuksesMsg] = useState(false)

  const [detailSaksi, setDetailSaksi] = useState({
    nama: null,
    distrik: null,
    kampung: null,
    noTps:null,
    username: null,
    password:null,
    hp:null
  })


  // ############ useEffect #################

  // pengambilan data distrik & datasaksi yang sudah ada di DB
  useEffect(() => {
    window.scrollTo(0, 0);
    const usernameStored = localStorage.getItem('username');
    const passwordStored = localStorage.getItem('password');
    const fetchDistrik = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/all-distrik-only'
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
          setListSaksi(response.data.saksi)
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
        const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/all-kampung-only'
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



  // ############# function #################

  // fungction set distrik
  const handleSelectDistrik = (e) => {
    setSelectedDistrik(e.target.value)
    // saat distrik di pilih dan request ke backend untuk mengambil data kampung berdasarkan distriknya
  }
  
  // function set kampung
  const handleSelectKampung = (e) => {
    setSelectedKampung(e.target.value)
  }

  // functon menambahkan saksi baru
  const handleSubmit = async () => {
    if (selectedDistrik === '' || selectedKampung === '' || nama === '' || noTps === '' || username === '' || password === '' || hp === '') {
      return alert("Lengkapi data saksi sebelum kirim 🥱")
    }
    setLoadingSubmit(true)

    try {
      const usernameStored = localStorage.getItem('username');
      const passwordStored = localStorage.getItem('password');
      const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/add-saksi'
      const data = {
        'nama':nama,
        'distrik':selectedDistrik,
        'kampung':selectedKampung,
        'noTps':noTps,
        'username':username,
        'password':password,
        'hp':hp
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
        setListSaksi((prevData) => [...prevData, response.data.saksi])
        setNama('')
        setNoTps('')
        setUsername('')
        setPassword('')
        setSelectedDistrik('')
        setSelectedKampung('')
        setKampung([])
        setSuksesMsg(true)
        window.location.reload()
      }
    } catch (error) {
      alert('Gagal menambahkan saksi. coba lagi! jika terus terjadi segera hubungi admin')
    }finally{
      setLoadingSubmit(false)
    }

    
  }

  // function get detail saksi
  const getDetailSaksi = async (e) => {
    const namasaksi = e.target.innerText;
    if (namasaksi === '') {
      return
    }
    try {
      setDetailSaksi({nama:null})
      const usernameStored = localStorage.getItem('username');
      const passwordStored = localStorage.getItem('password');
      const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/detail-saksi'
      const data = {
        'namasaksi':namasaksi
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
        setDetailSaksi({
          nama:response.data.detailSaksi.nama,
          distrik:response.data.distrik.distrik.namaDistrik,
          kampung:response.data.distrik.namaKampung,
          noTps:response.data.detailSaksi.tps.nomorTps,
          username:response.data.detailSaksi.username,
          password:response.data.detailSaksi.password,
          hp:response.data.detailSaksi.telp
        })
      }
    } catch (error) {
      alert('Terjadi error di server coba lagi')
    }
  }


  // hapus saksi
  const hapusSaksi = async (namasaksi) => {
    if (namasaksi === '') {
      return
    }

    const confirmed = window.confirm(`Apakah kamu yakin ingin menghapus saksi ${namasaksi}? Hasil suara yang telah di input oleh ${namasaksi} akan ikut terhapus. Periksa datanya sebelum mengahpus!`);


    if (confirmed) {
      try {
        const usernameStored = localStorage.getItem('username');
        const passwordStored = localStorage.getItem('password');
        const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/hapus-saksi'
        const data = {
          'namasaksi':namasaksi
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
          setListSaksi([...response.data.listSaksi])
          console.log(response.data.listSaksi)
        }
      } catch (error) {
        console.log("Error server ", error)
      }
    }
    
  }




  return (
    <div className='flex h-screen w-screen'>

      {/* list saksi */}
        <div className='w-1/6 shadow overflow-y-scroll bg-base-200'>
          <ul className="menu bg-base-200 rounded-box w-56">
            <li>
              <h2 className="menu-title">Semua saksi</h2>
              <ul>
                {listSaksi.length > 0 
                &&
                listSaksi.map((item, index) => (
                  <li key={item.id} className='flex flex-row justify-between'>
                    <span onClick={getDetailSaksi} className={`cursor-pointer ${item.nama === detailSaksi.nama && 'active'}`}>{item.nama}</span>
                    <span onClick={() => hapusSaksi(item.nama)} className='text-red-500 hover:bg-red-500 hover:text-white '><MdDelete /></span>
                  </li>
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
          <label className="input input-bordered flex items-center gap-2 input-sm max-w-xs">
            <span className='text-primary'>No Hp</span>
            <input onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value)){setHp(value)} }} value={hp} type="text" className="grow" placeholder="Nomor Hp" />
          </label>
          <select disabled={distrik.length === 0} onChange={handleSelectDistrik} className="select select-bordered w-full max-w-xs select-sm">
            <option disabled selected>Distrik?</option>
            {distrik.length > 0 &&
            distrik.map((item) => (
              <option value={item.namaDistrik}>{item.namaDistrik}</option>
            ))
            }
            
          </select>

          <select disabled={loadingKampung} onChange={handleSelectKampung} className="select select-bordered w-full max-w-xs select-sm">
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
          {sukesesMsg &&
            <div className="toast toast-bottom toast-center">
                <div className="alert alert-primary">
                  <span>Saksi berhasil di tambahkan ✅</span>
                  <span onClick={() => setSuksesMsg(false)} className="cursor-pointer">X</span>

                </div>
            </div>
          }
        </div>

        {/* show saksi */}
        <div className='w-1/6 shadow max-w-lg overflow-y-scroll md:pt-5 md:pl-3'>
          {detailSaksi.nama !== null &&
            <div className='flex flex-col gap-3'>
              <span className='text-xs text-slate-400'>Nama: <span className='text-black'>{detailSaksi.nama}</span></span>
              <span className='text-xs text-slate-400'>No Hp: <span className='text-black'>{detailSaksi.hp}</span></span>
              <span className='text-xs text-slate-400'>Distrik: <span className='text-black'>{detailSaksi.distrik}</span></span>
              <span className='text-xs text-slate-400'>Kampung: <span className='text-black'>{detailSaksi.kampung}</span></span>
              <span className='text-xs text-slate-400'>No TPS: <span className='text-black'>{detailSaksi.noTps}</span></span>
              <span className='text-xs text-slate-400'>Username: <span className='text-black'>{detailSaksi.username}</span></span>
              <span className='text-xs text-slate-400'>Password: <span className='text-black'>{detailSaksi.password}</span></span>
              
            </div>
          }
        </div>

    </div>
  )
}

export default Settings