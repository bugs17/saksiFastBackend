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

    // Mengelompokkan dan menjumlahkan suara per kampung dan total suara per distrik
    const hasil = [];
    let totalSuaraKeseluruhan = 0; // Variabel untuk menghitung total suara keseluruhan

    distrik.forEach(d => {
        const kampungData = d.kampung.map(k => {
            const totalSuaraKampung = k.tps.reduce((sum, t) => sum + t.jumlahSuara, 0); // Menghitung total suara per kampung
            totalSuaraKeseluruhan += totalSuaraKampung; // Menambahkan total suara kampung ke total suara keseluruhan

            return {
                namaKampung: k.namaKampung,
                totalSuara: totalSuaraKampung
            };
        });

        const totalSuaraDistrik = kampungData.reduce((sum, k) => sum + k.totalSuara, 0); // Menghitung total suara per distrik

        hasil.push({
            namaDistrik: d.namaDistrik,
            totalSuara: totalSuaraDistrik
        });
    });

    const workbook = XLSX.utils.book_new();

    // Membuat data untuk satu sheet
    const sheetData = [
        ['Nama Distrik', 'Total Suara'], // Header
        ...hasil.map((d) => [d.namaDistrik, d.totalSuara]), // Data distrik dan total suara
        ['', totalSuaraKeseluruhan] // Menambahkan baris total suara keseluruhan
    ];

    // Membuat worksheet dari data
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Distrik'); // Menambahkan worksheet ke workbook

    // Konversi workbook ke buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Mengirim file sebagai response
    const response = new NextResponse(excelBuffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="data_distrik.xlsx"'
        }
    });

    return response;
};
