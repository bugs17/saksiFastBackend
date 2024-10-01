import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server"


export const GET = async (req) => {

    const headers = await req.headers;
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
        console.log("eror disini", error)
        return NextResponse.json({'message':'Unauthorized'}, {status:401})
    }
    console.log(usernameAdmin, passwordAdmin)
    let semuaAduan;
    try {
        semuaAduan = await prisma.tps.findMany({
            where:{
                aduan:true
            },
            include:{
                saksi:{
                    include:{
                        tps:{
                            include:{
                                kampung:{
                                    include:{
                                        distrik:true
                                    }
                                }
                            }
                        },

                    }
                },
                kampung:{
                    include:{
                        distrik:true
                    }
                }
                }
        })
    } catch (error) {
        console.log(500)
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }

    if (semuaAduan.length === 0) {
        return NextResponse.json({"message":"No data"}, {status:404})
    }

    

    return NextResponse.json({"aduan":semuaAduan}, {status:200})
}