
'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Aduan = () => {

    const [listAduan, setListAduan] = useState([])
    const [aduan, setAduan] = useState({
        "keterangan":null,
        "fotoAduan":null
    })
    const [saksi, setSaksi] = useState(null)

    useEffect(() => {
        const usernameStored = localStorage.getItem('username');
        const passwordStored = localStorage.getItem('password');
        const getAllAduan = async () => {
            try {
                
                const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/admin/all-aduan"
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
    }, [])

    const [foto, setFoto] = useState(null)
    useEffect(() => {
        if (aduan.fotoAduan !== null) {
        // Decode Base64 menjadi ArrayBuffer
        const arrayBuffer = decode(aduan.fotoAduan);
        // Buat URL objek dari ArrayBuffer
        const blob = new Blob([arrayBuffer], { type: "image/png" });
        const imageObjectUrl = URL.createObjectURL(blob);
        setFoto(imageObjectUrl);

        // Bersihkan URL objek ketika komponen di-unmount
        return () => URL.revokeObjectURL(imageObjectUrl);
        }
    }, [aduan.fotoAduan]);

    const setDetailSaksiDanAduan = async (item) => {
        setSaksi(item.saksi)
        if (item.fotoAduan !== null) {
            try {
                const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/detail-aduan'
                const data = {
                    'url':item.fotoAduan
                }
                const response = await axios.post(url, data, {
                    headers:{
                        'Content-Type':'application/json'
                    }
                })
                if (response.status === 200) {
                    setAduan({fotoAduan:response.data.fotoAduan, keterangan:item.keteranganAduan})
                }
            } catch (error) {
                
            }
        }
        setAduan({fotoAduan:null, keterangan:tem.keteranganAduan})
    }

  return (
    <div className='flex h-screen w-screen'>
        <div className='w-1/6 shadow overflow-y-scroll bg-base-200'>
        <ul className="menu bg-base-200 rounded-box w-56">
            <li>
              <h2 className="menu-title">{listAduan.length > 0 ? 'Semua Aduan' : "Tidak ada aduan"}</h2>
              <ul>
                {listAduan.length > 0 &&
                    listAduan.map((item) => (
                        <li key={item.id} className='flex flex-row justify-between '>
                            <span className={`${saksi?.nama === item.saksi?.nama && 'active'}`} onClick={() => setDetailSaksiDanAduan(item)}>{item.saksi.nama}</span>
                        </li>
                    ))
                    
                }
                
              </ul>
            </li>
          </ul>
        </div>

        <div className='w-4/6 flex flex-col justify-start gap-10 items-center md:pt-16 md:pb-16 md:px-10 overflow-y-scroll'>
            {aduan !== null && 
            <article className="prose flex flex-col gap-2">
                <h1 className='text-primary'>Keterangan:</h1>
                <p>
                    {aduan.keterangan}
                </p>

                <div className=' self-center border-2 border-black mt-5'>
                    {foto !== null &&
                        <Image alt='gambar-aduan' height={500} width={500} src={foto} />
                    }
                </div>
                
            </article>}
        </div>

        <div className='w-1/6 shadow max-w-lg overflow-y-scroll md:pt-5 md:pl-3'>
            {saksi !== null &&
                <div className='flex flex-col gap-3'>
                <span className='text-xs text-slate-400'>Nama: <span className='text-black'>{saksi.nama}</span></span>
                <span className='text-xs text-slate-400'>Distrik: <span className='text-black'>{saksi.tps.kampung.distrik.namaDistrik}</span></span>
                <span className='text-xs text-slate-400'>Kampung: <span className='text-black'>{saksi.tps.kampung.namaKampung}</span></span>
                <span className='text-xs text-slate-400'>No TPS: <span className='text-black'>{saksi.tps.nomorTps}</span></span>
                </div>
            }
        </div>
    </div>
  )
}

export default Aduan