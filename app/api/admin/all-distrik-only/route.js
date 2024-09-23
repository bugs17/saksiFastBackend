import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server"


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

    let distrik;

    // mengambill semua distrik dan kampungnya
    try {
        distrik = await prisma.distrik.findMany({
            select:{
                namaDistrik:true
            }
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }

    

    return NextResponse.json({"distrik":distrik}, {status:200})
}