import axios from 'axios'
import React, { useEffect, useState } from 'react'

const LeftMenu = () => {

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])



  // fetch data dsitrik pertamakasli
  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const fetchDistrik = async () => {
      setLoading(true)
      try {
        const url = 'http://localhost:3000/api/admin/get-semua-distrik'
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
              <li><a className='active'>Total kabupaten</a></li>
              
              {data.length > 0 &&
              data.map((item) => (
                <li>
                <details close>
                  <summary>{item.namaDistrik}</summary>
                  <ul>
                    <li><a>Total Distrik {item.namaDistrik}</a></li>
                    {item.kampung.length > 0 &&
                    item.kampung.map((itemKampung) => (
                      <li>
                      <details close>
                        <summary>{itemKampung.namaKampung}</summary>
                        <ul>
                          <li><a>Total Kampung {itemKampung.namaKampung}</a></li>
                          <li><a>TPS 1</a></li>
                          <li><a>TPS 2</a></li>
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