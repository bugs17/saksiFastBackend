import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"



export const POST = async (req) => {

    const body = await req.json()
    const nama = body.namasaksi

    if (nama === '') {
        return NextResponse.json({'message':'Bad request'}, {status:400})
    }

    const headers = req.headers;
    const usernameAdmin = headers.get('usernameAdmin')
    const passwordAdmin = headers.get('passwordAdmin')
    const role = headers.get('role')


    // mengambil admin user & validasi credential
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

    // hapus saksi berdasarkan nama
    try {

        const saksi = await prisma.saksi.findFirst({
            where:{
                nama:nama
            }
        })

        await prisma.saksi.delete({
            where:{
                id:saksi.id
            }
        })
        
    } catch (error) {
        console.log("pesan error", error)
        return NextResponse.json({'message':'Bad request'}, {status:400})
    }

    let listSaksi;
    // mengambil semua saksi untuk dikirim sebagai list saksi yang tersisa
    try {
        listSaksi = await prisma.saksi.findMany()
    } catch (error) {
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }



    return NextResponse.json({listSaksi}, {status:200})
}