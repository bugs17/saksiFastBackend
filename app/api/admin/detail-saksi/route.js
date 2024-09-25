import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server"


export const POST = async (req) => {

    const body = await req.json()
    const nama = body.namasaksi

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

    let detailSaksi;
    // mengambil detail data saksi
    try {
        detailSaksi = await prisma.saksi.findFirst({
            where:{
                nama:nama
            },
            include:{
                tps:true
            }
        })
    } catch (error) {
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }

    let distrik;
    // mengambil data distrik
    try {
        distrik = await prisma.kampung.findFirst({
            where:{
                id:detailSaksi.tps.kampungId
            },
            include:{
                distrik:true
            }
        })
    } catch (error) {
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }

    detailSaksi.tps.nomorTps


    return NextResponse.json({detailSaksi, distrik}, {status:200})
}