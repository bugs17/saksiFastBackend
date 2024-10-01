import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server"
import { readFile } from 'fs/promises';
import { join } from 'path';


const getTotalSuaraKabupaten = async () => {
    try {
        const totalSuaraKabupaten = await prisma.tps.aggregate({
            _sum:{
                jumlahSuara:true
            }
        })

        const latestUpdate = await prisma.tps.findFirst({
            orderBy: {
              updatedAt: 'desc', // Mengurutkan berdasarkan updatedAt dari yang terbaru
            },
            select: {
              updatedAt: true,  // Hanya mengambil kolom updatedAt
            },
        });

        const updateTime = latestUpdate ? latestUpdate.updatedAt : null;
        return NextResponse.json({"urlFotoSuara":null,"jumlah":totalSuaraKabupaten._sum.jumlahSuara || 0,"title":"Kabupaten", "updateTime":updateTime}, {status:200})
    } catch (error) {
        console.log("Terjadi error query", error)
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }
}


const getTotalSuaraDistrik = async (distrikParam) => {
    try {
        const distrik = await prisma.distrik.findFirst({
            where:{
                namaDistrik:distrikParam
            }
        })

        const jumlahSuara = await prisma.tps.aggregate({
            _sum:{
                jumlahSuara:true
            },
            where:{
                kampung:{
                    distrikId:distrik.id
                }
            }
        })

        const latestUpdate = await prisma.tps.findFirst({
            orderBy: {
              updatedAt: 'desc', // Mengurutkan berdasarkan updatedAt dari yang terbaru
            },
            select: {
              updatedAt: true,  // Hanya mengambil kolom updatedAt
            },
        });

        const updateTime = latestUpdate ? latestUpdate.updatedAt : null;

        return NextResponse.json({"urlFotoSuara":null,"jumlah":jumlahSuara._sum.jumlahSuara || 0, "title":`Distrik ${distrik.namaDistrik}`, "updateTime":updateTime},{status:200})
    } catch (error) {
        console.log("Terjadi error query", error)
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }
}

const getTotalSuaraKampung = async (kampungParam) => {
    const jumlahSuara = await prisma.tps.aggregate({
        _sum:{
            jumlahSuara:true
        },
        where:{
            kampung:{
                namaKampung:kampungParam
            }
        }
    })

    const latestUpdate = await prisma.tps.findFirst({
        orderBy: {
          updatedAt: 'desc', // Mengurutkan berdasarkan updatedAt dari yang terbaru
        },
        select: {
          updatedAt: true,  // Hanya mengambil kolom updatedAt
        },
    });

    const updateTime = latestUpdate ? latestUpdate.updatedAt : null;
    return NextResponse.json({"urlFotoSuara":null,"jumlah":jumlahSuara._sum.jumlahSuara || 0, "title": `Kampung ${kampungParam}`, "updateTime":updateTime})
}

const getTotalSuaraTps = async (idTps) => {
    const id = parseInt(idTps)
    try {
        const totalSuara = await prisma.tps.findFirst({
            where:{
                id:id
            },
            include:{
                kampung:true
            }
        })
        const latestUpdate = await prisma.tps.findFirst({
            orderBy: {
              updatedAt: 'desc', // Mengurutkan berdasarkan updatedAt dari yang terbaru
            },
            select: {
              updatedAt: true,  // Hanya mengambil kolom updatedAt
            },
        });

        const updateTime = latestUpdate ? latestUpdate.updatedAt : null;
        const imageUrl = totalSuara.urlFotoSuara; // Ambil URL gambar dari database
        const filePath = join(process.cwd(), 'public', imageUrl); // Sesuaikan dengan path folder public
        const imageBuffer = await readFile(filePath); // Baca file gambar

        return NextResponse.json({
            "urlFotoSuara": imageBuffer.toString('base64'), // Mengirim gambar dalam format base64
            "jumlah": totalSuara.jumlahSuara,
            "title": `TPS ${totalSuara.nomorTps} Kampung ${totalSuara.kampung.namaKampung}`,
            "updateTime": updateTime
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json' // Set header yang sesuai
            }
        });
    } catch (error) {
        console.log("Terjadi error query", error)
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }
}

export const POST = async (req) => {
    
    const headers = req.headers;
    const body = await req.json()

    const kampungordistrik = body.kampungordistrik
    const menu = body.menu

    const usernameAdmin = headers.get('usernameAdmin')
    const passwordAdmin = headers.get('passwordAdmin')
    const role = headers.get('role')

    // validasi
    try {
        const user = await prisma.user.findFirst({
            where:{
                username:usernameAdmin
            }
        })
        if (!user || passwordAdmin !== user.password || role !== user.role) {
            return NextResponse.json({'message':'Unauthorized'}, {status:401})
        }
    } catch (error) {
        return NextResponse.json({'message':'Unauthorized'}, {status:401})
    }

    
    if (kampungordistrik === 'kabupaten') {
        return getTotalSuaraKabupaten()
    }else if (kampungordistrik === 'distrik') {
        return getTotalSuaraDistrik(menu)
    }else if (kampungordistrik === 'kampung') {
        return getTotalSuaraKampung(menu)
    }else if (kampungordistrik === 'tps') {
        return getTotalSuaraTps(menu)
    }

}