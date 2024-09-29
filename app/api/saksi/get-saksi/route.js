import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"


export const POST = async (req) => {

    const body = await req.json()
    const usernameSaksi = body?.username
    const passwordSaksi = body?.password
    const roleSaksi = body?.role

    let user;
    // mengambil admin user & validasi credential
    try {
        user = await prisma.saksi.findFirst({
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

    // mengambil data saksi
    try {
        const saksi = await prisma.saksi.findFirst({
            where:{
                id:user.id
            },
            include:{
                tps:{
                    include:{
                        kampung:{
                            include:{
                                distrik:true
                            }
                        }
                    }
                }
            }
        })
        return NextResponse.json({"saksi":saksi}, {status:200})
    } catch (error) {
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }


}