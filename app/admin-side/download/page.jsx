import React from 'react'
import { FaDownload } from "react-icons/fa";

const Downloaad = () => {
  return (
    <div className='flex flex-row justify-center items-center h-screen w-screen gap-5'>
        <button className="btn btn-primary text-white">Kabupaten <FaDownload /></button>
        <button className="btn btn-primary text-white">Distrik <FaDownload /></button>
    </div>
  )
}




export default Downloaad