import axios from 'axios'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { distrikorkampung, menuTerpilih } from '../lib/globalState'

const LeftMenu = () => {

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  const [menu, setMenu] = useAtom(menuTerpilih)
  const [kampungordistrik, setKampungordistrik] = useAtom(distrikorkampung)


  // fetch data dsitrik pertamakasli
  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const fetchDistrik = async () => {
      setLoading(true)
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/get-semua-distrik'
        const response = await axios.get(url, {
          headers:{
            'Accept':'application/json',
            'username':username,
            'password':password,
            'role':'admin'
          }
        })
        if (response.status === 200) {
          setData(response.data.distrik)
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }finally{
        setLoading(false)
      }
    }
    fetchDistrik()
  }, [])

  const selectDistrik = (distrik) => {
    setMenu(distrik)
    setKampungordistrik('distrik')
  }
  
  const selectKampung = (kampung) => {
    setMenu(kampung)
    setKampungordistrik('kampung')
  }
  
  const selectKabupaten = (kabupaten) => {
    setMenu(kabupaten)
    setKampungordistrik('kabupaten')
  }

  const selectTps = (tps) => {
    setMenu(tps)
    setKampungordistrik('tps')
  }


  return (
    <div className='flex flex-col w-auto overflow-x-auto h-full'>
            {/* side menu */}
            {loading 
            ?
            
            <div className="flex w-72 flex-col gap-4 pt-6 bg-base-200">
            {Array.from({ length: 20 }, (_, index) => index + 1).map(() => (
              <div className="skeleton h-4 w-full"></div>
            ))}
            </div>
            :
            <ul className="menu bg-base-200 rounded-box w-72 ">
              <li><span onClick={() => selectKabupaten('kabupaten')} className={`${menu === 'kabupaten' & kampungordistrik === 'kabupaten' && 'active'}`}>Total kabupaten</span></li>
              
              {data.length > 0 &&
              data.map((item) => (
                <li key={item.id}>
                <details close>
                  <summary>{item.namaDistrik}</summary>
                  <ul>
                    <li><span className={`${menu === item.namaDistrik & kampungordistrik === 'distrik' && 'active'}`} onClick={() => selectDistrik(item.namaDistrik)}>Total Distrik {item.namaDistrik}</span></li>
                    {item.kampung.length > 0 &&
                    item.kampung.map((itemKampung) => (
                      <li key={itemKampung.id}>
                      <details close>
                        <summary>{itemKampung.namaKampung}</summary>
                        <ul>
                          <li><span className={`${menu === itemKampung.namaKampung & kampungordistrik === 'kampung' && 'active'}`}  onClick={() => selectKampung(itemKampung.namaKampung)}>Total Kampung {itemKampung.namaKampung}</span></li>
                          {itemKampung.tps.length > 0 &&
                            itemKampung.tps.map((item) => (
                            <li className={`${menu === item.id & kampungordistrik === 'tps' && 'active'}`} key={item.id}><span onClick={() => selectTps(item.id)}>TPS {item.nomorTps}</span></li>
                            ))
                          }
                        </ul>
                      </details>
                    </li>
                    ))
                    }
                    
                  </ul>
                </details>
              </li>
              ))
              }
            </ul>
            }
    </div>
  )
}

export default LeftMenu