import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server"

export const POST = async (req) => {

    const headers = req.headers;
    const body = await req.json()

    const noTps = body.noTps
    const nama = body.nama
    const distrik = body.distrik
    const kampung = body.kampung
    const username = body.username
    const password = body.password


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

    let saksi;

    // create saksi
    try {
        saksi = await prisma.saksi.create({
            data: {
                username:username,
                password:password,
                nama:nama,
                tps:{
                    create:{
                        nomorTps:noTps,
                        kampung:{
                            connect:{
                                namaKampung:kampung
                            }
                        }
                    }
                }
            }
          });
        
    } catch (error) {
        
        console.log("Error message", error)
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }

    return NextResponse.json({"saksi":saksi}, {status:200})
}