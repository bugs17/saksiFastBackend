'use client'
import axios from 'axios';
import React from 'react'
import { FaDownload } from "react-icons/fa";

const Downloaad = () => {

  const handleDownloadDistrik = async () => {
    try {
      const usernameStored = localStorage.getItem('username');
      const passwordStored = localStorage.getItem('password');
      const urlBackend = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/download-distrik';
      const response = await axios.get(urlBackend, {
        headers:{
          'username':usernameStored,
          'password':passwordStored,
          'role':'admin'
        },
        responseType: 'blob', // Pastikan tipe respons adalah blob untuk file
      });

      // Membuat link download dari blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data_distrik.xlsx'); // Tentukan nama file yang diunduh
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Hapus elemen link setelah diunduh

    } catch (error) {
        console.error("Error occurred while downloading file:", error);
    }
  };
  
  const handleDownloadKampung = async () => {
    try {
      const usernameStored = localStorage.getItem('username');
      const passwordStored = localStorage.getItem('password');
      const urlBackend = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/download-kampung';
      const response = await axios.get(urlBackend, {
        headers:{
          'username':usernameStored,
          'password':passwordStored,
          'role':'admin'
        },
        responseType: 'blob', // Pastikan tipe respons adalah blob untuk file
      });

      // Membuat link download dari blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data_kampung.xlsx'); // Tentukan nama file yang diunduh
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Hapus elemen link setelah diunduh

    } catch (error) {
        console.error("Error occurred while downloading file:", error);
    }
  };

  const handleDownloadCSatu = async () => {
    try {
        const usernameStored = localStorage.getItem('username');
        const passwordStored = localStorage.getItem('password');
        const urlBackend = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/download-csatu';
        const response = await axios.get(urlBackend, {
            headers:{
              'username':usernameStored,
              'password':passwordStored,
              'role':'admin'
            },
            responseType: 'blob', // Penting untuk mengunduh file
        });

        // Membuat URL dari Blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data_c1.zip'); // Nama file yang akan diunduh
        document.body.appendChild(link);
        link.click(); // Mengklik link untuk memulai unduhan
        document.body.removeChild(link); // Menghapus link dari DOM
    } catch (error) {
        console.error('Error:', error);
        alert('Gagal mengunduh file. Silakan coba lagi.');
    }
  };

  const handleDownloadAduan = async () => {
    try {
      const usernameStored = localStorage.getItem('username');
      const passwordStored = localStorage.getItem('password');
      const urlBackend = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/download-aduan'
      const response = await axios.get(urlBackend, {
        headers:{
          'username':usernameStored,
          'password':passwordStored,
          'role':'admin'
        },
        responseType: 'blob', // Set response type as blob to handle binary data
      });

      // Membuat URL untuk file yang akan di-download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'aduan_tps.xlsx'); // Nama file yang akan di-download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };
    

  const handleDownloadFotoAduan = async () => {
    try {
      const usernameStored = localStorage.getItem('username');
      const passwordStored = localStorage.getItem('password');
      const urlBackend = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/admin/download-foto-aduan';
      const response = await axios.get(urlBackend, {
          headers:{
            'username':usernameStored,
            'password':passwordStored,
            'role':'admin'
          },
          responseType: 'blob', // Penting untuk mengunduh file
      });

      // Membuat URL dari Blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'foto_aduan.zip'); // Nama file yang akan diunduh
      document.body.appendChild(link);
      link.click(); // Mengklik link untuk memulai unduhan
      document.body.removeChild(link); // Menghapus link dari DOM
  } catch (error) {
      console.error('Error:', error);
      alert('Gagal mengunduh file. Silakan coba lagi.');
  }
  }



  return (
    <div className='flex flex-col justify-center items-center h-screen w-screen gap-10'>

      <div className='flex justify-center items-center flex-col gap-2'>
        <div className='gap-5 flex'>
          <button onClick={handleDownloadDistrik} className="btn btn-primary text-white">Distrik <FaDownload /></button>
          <button onClick={handleDownloadKampung} className="btn btn-primary text-white">Kampung <FaDownload /></button>
          <button onClick={handleDownloadCSatu} className="btn btn-primary text-white">Foto C1 <FaDownload /></button>
        </div>
          <span className='text-slate-400 text-sm'>Download Laporan Perhitingan Suara</span>
      </div>

      <div className='flex justify-center items-center flex-col gap-2'>
        <div className='gap-5 flex'>
          <button onClick={handleDownloadAduan} className="btn btn-primary text-white">Aduan <FaDownload /></button>
          <button onClick={handleDownloadFotoAduan} className="btn btn-primary text-white">Foto aduan <FaDownload /></button>
        </div>
          <span className='text-slate-400 text-sm'>Download Data Aduan</span>
      </div>
        
    </div>
  )
}




export default Downloaad