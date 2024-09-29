'use client'
import Image from "next/image";
import Logo from '../app/asset/image/logotag.png'
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TfiAndroid } from "react-icons/tfi";


export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [errorMsg, setErrorMsg] = useState('')

  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      return alert("masukan USERNAME & PASSWORD sebelum masuk 🥱")
    }
    setLoading(true)
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/login'
      const data = {
        username,
        password,
        role:'admin'
      }
      const response = await axios.post(url, data, {
        headers:{
          'Content-Type': 'application/json',
        }
      })
      if (response.status === 200) {
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('password', response.data.password);

        router.push('/admin-side/home')
      }
    } catch (error) {
      setErrorMsg(error.response.data.message)
      setLoading(false)
    }
  }

  return (
    <main  className="justify-center items-center flex flex-1 gap-20 flex-col h-screen w-screen ">
      
      <div className="justify-center items-center flex flex-col gap-2">
        <Image draggable={false} alt="Logo" src={Logo} height={200} width={200} />
      </div>
      <div className="hidden md:block">
      <form onSubmit={handleLogin} className="flex gap-6 flex-col">
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input onChange={(e) => setUsername(e.target.value)} type="text" className="grow" placeholder="Username" />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd" />
          </svg>
          <input onChange={(e) => setPassword(e.target.value)} type="password" className="grow" placeholder="Password" />
        </label>
        {loading ?
        (<span className="loading loading-spinner loading-lg self-center"></span>)
        :
        (<button type="submit" className="btn btn-outline">Masuk</button>)}
      </form>
      {errorMsg !== '' && 
      (
        <div className="toast toast-top toast-end">
          <div className="alert alert-error">
            <span>{errorMsg}</span>
            <span onClick={() => setErrorMsg('')} className="cursor-pointer">X</span>

          </div>
        </div>
      )
      }
      </div>

      <div className="block md:hidden">
                <button className="btn btn-primary text-white">
          SaksiFast
          <TfiAndroid  />
        </button>
          
      </div>
    </main>
  )
}
