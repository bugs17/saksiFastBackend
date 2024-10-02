import { decode } from 'base64-arraybuffer';
import { useAtom } from 'jotai';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { distrikorkampung, isFotoUrl, menuTerpilih } from '../lib/globalState';
import axios from 'axios';



const FotocSatuComponen = () => {
  const [menu, setMenu] = useAtom(menuTerpilih)
  const [fotoUrl, setFotoUrl] = useAtom(isFotoUrl)
  const [foto, setFoto] = useState(null)
  const imageObjectUrlRef = useRef(null);


  useEffect(() => {
    const getFoto = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/get-foto-c1'
        const data = {
          "idTps":parseInt(menu)
        }
        const response = await axios.post(url, data, {
          headers:{
            'Content-Type':'application/json'
          }
        })
        if (response.status === 200) {
          if (response.data.urlFotoSuara === null) {
            setFotoUrl(false)
            return
          }
          const arrayBuffer = decode(response.data.urlFotoSuara);
          const blob = new Blob([arrayBuffer], { type: "image/png" });
          const imageUrl = URL.createObjectURL(blob);
          setFotoUrl(true)
          if (imageObjectUrlRef.current) {
            URL.revokeObjectURL(imageObjectUrlRef.current);
            imageObjectUrlRef.current = null; // reset ke null setelah revoke
          }

          imageObjectUrlRef.current = imageUrl;
          setFoto(imageUrl);
        }
      } catch (error) {
        console.log("Gagal memanggil foto", error)
      }
    }

    getFoto()

    return () => {
      if (imageObjectUrlRef.current) {
        URL.revokeObjectURL(imageObjectUrlRef.current); // revoke URL saat komponen unmount
        imageObjectUrlRef.current = null; // reset ke null setelah revoke
      }
    };
  }, [menu])


  return (
    <>
      {fotoUrl && foto !== null ? (
        <div className='border-2 border-black mt-5'>
          <Image alt='gambar-aduan' height={500} width={500} src={foto} />
        </div>
      ) : (
        <></>
      )}
  </>
  )
}

const TotalKabupaten = ({jumlah, title, updateTime}) => {
  const [kampungordistrik, setKampungordistrik] = useAtom(distrikorkampung)
  

  


  return (
    <div className='flex flex-1 w-auto'>
        <div className='flex flex-col justify-center items-center gap-3'>
          <div className="stats  stats-vertical shadow w-auto h-80">
              <div className="stat items-center justify-center flex flex-col">
                  <div className="stat-title ">Total suara {title}</div>
                  <div className="stat-value font-bold text-9xl text-primary">{jumlah}</div>
                  
                  <div className="stat-desc">Terakhir update: {updateTime}</div>
              </div>
          </div>
            {kampungordistrik === 'tps' ?
            
            <FotocSatuComponen />
            :
            <div></div>
            }
            
        </div>
    </div>
  )
}

export default TotalKabupaten