import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server"


export const POST = async (req) => {

    const headers = req.headers;
    const body = await req.json()

    const distrik = body.distrik

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

    let kampung;

    // mengambill semua distrik dan kampungnya
    try {
        kampung = await prisma.kampung.findMany({
            where:{
                distrik:{
                    namaDistrik:distrik
                }
            },
            select:{
                namaKampung:true
            }
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }

    

    return NextResponse.json({"kampung":kampung}, {status:200})
}