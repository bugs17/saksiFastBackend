import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server"



export const POST = async (req) => {

    const headers = req.headers;
    const body = await req.json()

    const idTps = body.idTps
    const jumlahSuara = body.jumlahSuara

    const usernameAdmin = headers.get('username')
    const passwordAdmin = headers.get('password')
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

    try {
        await prisma.tps.update({
            where:{
                id:idTps
            },
            data:{
                jumlahSuara:jumlahSuara
            }
        })
    } catch (error) {
        console.log("error disini", error)
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }

    return NextResponse.json({"message":"sukses"}, {status:200})
}