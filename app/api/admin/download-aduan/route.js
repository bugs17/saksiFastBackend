// app/api/export/route.ts
import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';


export async function GET(req) {

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

  try {
    // Ambil data dari Prisma (Kampung dan Aduan)
    const data = await prisma.tps.findMany({
      where: {
        aduan: true,
      },
      include: {
        kampung: true, // Mengambil informasi kampung terkait
      },
    });

    // Mapping data untuk disesuaikan dengan format tabel XLSX
    const formattedData = data.map((tps) => ({
      'Nama Kampung': tps.kampung.namaKampung,
      'No TPS': tps.nomorTps,
      'Keterangan Aduan': tps.keteranganAduan || '-',
    }));

    // Membuat workbook dan worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Aduan TPS');

    // Konversi workbook ke buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Set response headers agar file di-download
    const response = new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=aduan_tps.xlsx',
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate XLSX file' }, { status: 500 });
  }
}
