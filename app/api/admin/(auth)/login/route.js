import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"


export const POST = async (req) => {
    const body = await req.json()
    
    const {username, password, role} = body

    try {
        const user = await prisma.user.findFirst({
            where:{
                username:username
            }
        })

        if (!user || password !== user.password || role !== user.role) {
            console.log('user tidak ditemukan')
            return NextResponse.json({'message':'username atau password salah'}, {status:401})
        }

        const userData = {
            username: user.username,
            password:user.password
        }

        const response = NextResponse.json(userData, {status:200})
        response.cookies.set('status', 'authenticated', {
            httpOnly: true,
            secure: false,
            path: '/',
            maxAge: 60 * 60 * 24,
        })

        return response
    } catch (error) {
        console.log(error)
        return NextResponse.json({'message':'username atau password salah'}, {status:401})
    }
    
}