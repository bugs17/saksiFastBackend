import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"


export const POST = async (req) => {

    const body = await req.json()
    const usernameSaksi = body?.username
    const passwordSaksi = body?.password
    const roleSaksi = body?.role

    
    // mengambil admin user & validasi credential
    try {
        const user = await prisma.saksi.findFirst({
            where:{
                username:usernameSaksi
            }
        })
        if (!user || passwordSaksi !== user.password || roleSaksi !== 'saksi') {
            return NextResponse.json({'message':'Unauthorized'}, {status:401})
        }

    } catch (error) {
        console.log("Error validasi", error)
        return NextResponse.json({'message':'Unauthorized'}, {status:401})
    }


    return NextResponse.json({"message":"sukses"}, {status:200})
}