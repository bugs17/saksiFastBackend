import { prisma } from "@/app/lib/db"
import { NextResponse } from "next/server"
import { writeFile } from "fs/promises";
import { join } from "path";




export const POST = async (req) => {

    const generateUniqueFileName = () => {
        // Mengambil waktu saat ini dalam format ISO String
        const currentDateTime = new Date().toISOString();
      
        // Mengganti karakter yang tidak diinginkan dalam ISO String (seperti ":" dan ".")
        const formattedDateTime = currentDateTime.replace(/[:.]/g, "-");
      
        return formattedDateTime;
    };

    const headers = req.headers;
    const usernameSaksi = headers.get('username')
    const passwordSaksi = headers.get('password')
    const roleSaksi = headers.get('role')

    // form yang dikirim
    const formData = await req.formData();

    const idTps = formData.get('idTps');
    const jumlahSuara = formData.get('jumlahSuara');
    const fotoSuara = formData.get('fotoSuara');

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

    // mengolah foto
    const bytes = await fotoSuara.arrayBuffer()
    const bufferFile = Buffer.from(bytes)
    const namaSaksi = user.nama
    const namaFile = generateUniqueFileName()
    const namaFileReady = `${namaSaksi}-${namaFile}.png`
    const filePath = join(process.cwd(), 'public/c1', namaFileReady);
    await writeFile(filePath, bufferFile)

    const urlFotoSuara = `/c1/${namaFileReady}`;

    // update data suara dan juga foto url foto c1
    try {
        await prisma.tps.update({
            where:{
                id:parseInt(idTps)
            },
            data:{
                jumlahSuara:parseInt(jumlahSuara),
                urlFotoSuara:urlFotoSuara
            }
        })
    } catch (error) {
        return NextResponse.json({'message':'Internal server erro'}, {status:500})
    }

    

    return NextResponse.json({'message':'sukse'}, {status:200})


}