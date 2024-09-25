'use client'
import Image from 'next/image'
import React from 'react'
import Logo from '../asset/image/logotag.png'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'


const Navbar = () => {
    const pathname = usePathname()
    const router = useRouter()

    const getExpiredDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - 1); // Mengurangi satu hari
        return date.toUTCString();
      };


      const Logout = async () => {
        try {
          // Panggil API logout untuk menghapus cookie di server
          const url = 'http://localhost:3000/api/admin/logout'
          await axios.post(url);
      
          // Hapus localStorage
          localStorage.removeItem("username");
          localStorage.removeItem("password");
      
          // Redirect ke halaman login
          router.push('/');
        } catch (error) {
          console.error("Error saat logout:", error);
        }
      };

  return (
    <div className="navbar bg-base-100 shadow-[0_1px_2px_rgba(0,0,0,0.1)] md:px-10 sticky top-0 z-50">
        <div className="navbar-start">
            <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li><a>Item 1</a></li>
                <li><a>Item 3</a></li>
            </ul>
            </div>
            <div className='flex flex-row gap-5 justify-center items-center  '>
                <Image alt="Logo" src={Logo} height={120} width={120} />
            </div>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 flex gap-4">
              <li><Link className={pathname === '/admin-side/home' && 'active'} href={'/admin-side/home'}>Home</Link></li>
              <li><Link className={pathname === '/admin-side/add-saksi' && 'active'} href={'/admin-side/add-saksi'}>Tambah-saksi</Link></li>
              <li><Link className={pathname === '/admin-side/laporan' && 'active'} href=''>Laporan</Link></li>
            </ul>
        </div>
        <div className="navbar-end">
            <button onClick={Logout} className="btn">Keluar 👉🏼</button>
        </div>
    </div>
  )
}

export default Navbar