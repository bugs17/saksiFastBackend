import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";
import * as XLSX from 'xlsx';

export const GET = async (req) => {
    
    const headers = req.headers;
    const username = headers.get('username')
    const password = headers.get('password')
    const role = headers.get('role')

    // mengambil user dan validasi credential
    try {
        const user = await prisma.user.findFirst({
            where:{
                username:username
            }
        })

        if (!user || password !== user.password || role !== user.role) {
            return NextResponse.json({'message':'Unauthorized'}, {status:401})
        }
    } catch (error) {
        return NextResponse.json({'message':'Unauthorized'}, {status:401})
    }

    const distrik = await prisma.distrik.findMany({
        include: {
            kampung: {
                include: {
                    tps: true // Sertakan relasi TPS
                }
            }
        }
    });

    // Mengelompokkan data kampung dan TPS
    const hasil = [];
    let totalJumlahSuara = 0; // Variabel untuk menghitung total suara

    distrik.forEach(d => {
        d.kampung.forEach(k => {
            const tpsData = k.tps.map(t => {
                totalJumlahSuara += t.jumlahSuara; // Menambahkan jumlah suara ke total
                return {
                    namaKampung: k.namaKampung,
                    nomorTps: t.nomorTps,
                    jumlahSuara: t.jumlahSuara
                };
            });

            hasil.push(...tpsData); // Menambahkan data TPS ke dalam hasil
        });
    });

    const workbook = XLSX.utils.book_new();

    // Membuat data untuk satu sheet
    const sheetData = [
        ['Nama Kampung', 'Nomor TPS', 'Jumlah Suara'], // Header
        ...hasil.map((d) => [d.namaKampung, d.nomorTps, d.jumlahSuara]), // Data kampung dan TPS
        ['', '', totalJumlahSuara] // Menambahkan baris total jumlah suara
    ];

    // Membuat worksheet dari data
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Kampung'); // Menambahkan worksheet ke workbook

    // Konversi workbook ke buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Mengirim file sebagai response
    const response = new NextResponse(excelBuffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="data_kampung.xlsx"'
        }
    });

    return response;
};
