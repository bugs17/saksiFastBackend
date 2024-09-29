"use client"
import HomeContent from '@/app/component/home-content';
import LeftMenu from '@/app/component/left-menu';
import TotalKabupaten from '@/app/component/total-kabupaten';
import { distrikorkampung, menuTerpilih } from '@/app/lib/globalState';
import axios from 'axios';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react'




function formatDate(isoString) {
  const date = new Date(isoString);
  
  // Opsi format tanggal dan waktu yang mudah dibaca
  const options = {
    weekday: 'long',   // Nama hari
    year: 'numeric',   // Tahun
    month: 'long',     // Bulan
    day: 'numeric',    // Tanggal
    hour: '2-digit',   // Jam
    minute: '2-digit', // Menit
    second: '2-digit', // Detik
  };

  // Gabungkan format tanggal dan waktu
  return date.toLocaleString('id-ID', options);
}

const Home = () => {

  const [jumlah, setJumlah] = useState(0)
  const [title, setTitle] = useState('')
  const [updateTime, setUpdateTime] = useState('-')
  const [urlFotoSuara, setUrlFotoSuara] = useState(null)
  const [menu, setMenu] = useAtom(menuTerpilih)
  const [kampungordistrik, setKampungordistrik] = useAtom(distrikorkampung)

  const [loading, setLoading] = useState(false)

  const [loadingKampung, setLoadingKampung] = useState(true)
  const [loadingTps, setLoadingTps] = useState(true)
  const [distrik, setDistrik] = useState([])
  const [kampung, setKampung] = useState([])
  const [tps, setTps] = useState([])
  const [selectedDistrik, setSelectedDistrik] = useState('')
  const [selectedKampung, setSelectedKampung] = useState('')
  const [selectedTps, setSelectedTps] = useState('')
  const [jumlahSuara, setJumlahSuara] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [idTps, setIdTps] = useState()

  const [counter, setCounter] = useState(0)

  
  // fetch jumlah suara
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
          setUrlFotoSuara(response.data.urlFotoSuara)
          if (response.data.updateTime !== null) {
            setUpdateTime(formatDate(response.data.updateTime))
          }
        }
      } catch (error) {
        console.log("Error", error)
      }finally{
        setLoading(false)
      }
    }
    
    getJumlahSuara()
  },[menu, counter])


  // pengambilan data distrik & datasaksi yang sudah ada di DB
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
          setSelectedTps('')
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchDistrik()
  },[])

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
  
  useEffect(() => {
    const usernameStored = localStorage.getItem('username');
    const passwordStored = localStorage.getItem('password');
    const fetchTps = async () => {
      setLoadingTps(true)
      try {
        const url = 'http://localhost:3000/api/admin/all-tps-by-kampung'
        const data = {
          'distrik':selectedDistrik,
          'kampung':selectedKampung,
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
          setTps([...response.data.tps])
          setSelectedTps('');
        }
      } catch (error) {
        console.log(error)
      }finally{
        setLoadingTps(false)
      }
    }
    if (selectedKampung !== '') {
      fetchTps()
      setSelectedTps('')
    }
  }, [selectedKampung])


  const handleSelectDistrik = (e) => {
    setSelectedDistrik(e.target.value)
    // saat distrik di pilih dan request ke backend untuk mengambil data kampung berdasarkan distriknya
    setTps([])
    setSelectedKampung('')
    setSelectedTps('')
    setLoadingTps(true)
  }

  const handleSelectKampung = (e) => {
    setSelectedKampung(e.target.value)
    setSelectedTps('')
  }
  
  const handleSelectTps = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedId = selectedOption.getAttribute('data-id');
    const noTps = selectedOption.getAttribute('data-tps')
    setSelectedTps(noTps)
    setIdTps(selectedId)

  }

  const handleSubmit = async (e) => {
    if (selectedDistrik === '' || selectedKampung === '' || selectedTps === '' || jumlahSuara === '') {
      alert("isi semua kolom sebelum menyimpannya")
      return
    }

    const confirmed = window.confirm(`Anda yakin menambahkan jumlah suara ${jumlahSuara} pada TPS nomor ${selectedTps} kampung ${selectedKampung} distrik ${selectedDistrik}`);
    setLoadingSubmit(true)
    if (confirmed) {
      try {
        const usernameStored = localStorage.getItem('username');
        const passwordStored = localStorage.getItem('password');
        const url = 'http://localhost:3000/api/admin/add-suara'
        const data = {
          'idTps':parseInt(idTps),
          'jumlahSuara':parseInt(jumlahSuara)
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
          setSelectedDistrik('')
          setSelectedKampung('')
          setSelectedTps('')
          setJumlahSuara('')
          setKampung([])
          setTps([])
          setIdTps(null)
          setCounter(prevState => prevState + 1)
          setShowAlert(true)
          window.location.reload()
        }
    } catch (error) {
      console.log("Error", error)
      alert("Gagal menambahkan data")
      return
    }finally{
      setLoadingSubmit(false)
    }

    }
    
  }


  return (
    <>
      <div className='flex flex-row h-screen w-screen'>
        <LeftMenu />
        <HomeContent>
          <TotalKabupaten jumlah={jumlah} title={title} updateTime={updateTime} fotoSuara={urlFotoSuara} />
        </HomeContent>
        <div className='w-1/6 shadow max-w-lg overflow-y-scroll md:pt-5'>
          <div className='items-center justify-center flex md:mb-5'>
            <span className='text-sm text-slate-500'>Add suara manual</span>
          </div>
          <div className='flex flex-col gap-3 md:px-3'>
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

            <select disabled={loadingTps} onChange={handleSelectTps} className="select select-bordered w-full max-w-xs select-sm">
              <option disabled selected>No TPS?</option>
              {tps.length > 0 &&
              tps.map((item) => (
                <option data-id={item.id} value={item.nomorTps}  data-tps={item.nomorTps}>{item.nomorTps}</option>
              ))
              }
            </select>

            <label className="input input-bordered flex items-center gap-1 input-sm max-w-xs">
              <input  onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value)){setJumlahSuara(value)} }} value={jumlahSuara} type="text" className="grow" placeholder="Jumlah Suara" />
            </label>

            <div className='md:px-8 justify-center items-center flex md:pt-5'>
              {loadingSubmit 
              ? 
                (<span className="loading loading-spinner loading-xs self-center text-primary"></span>)
              :
                (<button onClick={handleSubmit} className="btn btn-xs btn-primary text-white">Simpan</button>)
              }
            </div>
            {showAlert && 
            (
              <div className='flex justify-center items-center pt-8'>
                <span className=' bg-violet-500 rounded-md justify-between md:pl-5 md:pr-2 gap-5 items-center md:py-2 flex flex-row'>
                  <span className='text-xs text-white'>Berhasil ditambahkan ✅</span>
                  <span onClick={() => setShowAlert(false)} className='text-xs text-red-500 cursor-pointer'>X</span>
                </span>
              </div>
            )
            }
          </div>

            <div className='justify-center items-center flex mt-28 px-4 text-justify'>
              <p className='text-xs text-slate-400'>Input jumlah suara manual melalui form ini, jika saksi tidak mengirim data suara.</p>
            </div>
        </div>
      </div>
    </>
  )
}

export default Home

