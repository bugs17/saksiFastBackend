import { decode } from 'base64-arraybuffer';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


const TotalKabupaten = ({jumlah, title, updateTime, fotoSuara}) => {
  const [foto, setFoto] = useState(null)
  useEffect(() => {
    if (fotoSuara !== null) {
      // Decode Base64 menjadi ArrayBuffer
      const arrayBuffer = decode(fotoSuara);
      // Buat URL objek dari ArrayBuffer
      const blob = new Blob([arrayBuffer], { type: "image/png" });
      const imageObjectUrl = URL.createObjectURL(blob);
      setFoto(imageObjectUrl);

      // Bersihkan URL objek ketika komponen di-unmount
      return () => URL.revokeObjectURL(imageObjectUrl);
    }
  }, [fotoSuara]);
  
  return (
    // <div className='w-80 m-10 ' >
    //     <div className='flex flex-col gap-2'>
    //         <div className='justify-between flex'>
    //         <span>Mandobo</span>
    //         <span>300</span>
    //         </div>
    //         <div className='tooltip tooltip-right' data-tip="50% dari 600">
    //         <progress className="progress h-6 w-100 rounded-sm" value={50} max="100"></progress>
    //         </div>
    //     </div>
    // </div>
    <div className='flex flex-1 w-auto'>
        <div className='flex flex-col justify-center items-center gap-3'>
          <div className="stats  stats-vertical shadow w-auto h-80">
              <div className="stat items-center justify-center flex flex-col">
                  <div className="stat-title ">Total suara {title}</div>
                  <div className="stat-value font-bold text-9xl text-primary">{jumlah}</div>
                  
                  <div className="stat-desc">Terakhir update: {updateTime}</div>
              </div>
          </div>
          {foto !== null &&
            <div className=' border-2 border-black mt-5'>
              <Image alt='gambar-aduan' height={500} width={500} src={foto} />
            </div>
          }
        </div>
    </div>
  )
}

export default TotalKabupaten