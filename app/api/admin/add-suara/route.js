import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server"
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";


const generateUniqueFileName = (namaKampung, noTps) => {
    // Mengambil waktu saat ini dalam format ISO String
    const currentDateTime = new Date().toISOString();
  
    // Mengganti karakter yang tidak diinginkan dalam ISO String (seperti ":" dan ".")
    const formattedDateTime = currentDateTime.replace(/[:.]/g, "-");
  
    // Format nama file menjadi "nomor-tps_namaSaksi_ISOString.png"
    return `${namaKampung}_${noTps}_${formattedDateTime}.png`;
};


export const POST = async (req) => {
    
    const headers = req.headers;
    const body = await req.formData()
    const file = body.get('file')

    const idTps = body.get('idTps')
    const jumlahSuara = body.get('jumlahSuara')

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

    let kampung = "admin"
    let noTps;
    try {
        const dataTps = await prisma.tps.findFirst({
            where:{
                id:parseInt(idTps)
            },
            include:{
                kampung:true
            }
        })
        kampung = dataTps.kampung.namaKampung
        noTps = dataTps.nomorTps
    } catch (error) {
        console.log("gagal mengambil kampung")
    }

    if (file !== 'empty') {
        const bytes = await file.arrayBuffer();
        const bufferFile = Buffer.from(bytes);
        
        // const folderPath = join(process.cwd(), 'public/c1', 'admin);
        const folderPath = join(process.cwd(), 'public/c1', kampung);
        
        // Membuat folder jika belum ada
        await mkdir(folderPath, { recursive: true });

        // const namaFile = generateUniqueFileName(); // Dapatkan nama file unik
        const namaFile = generateUniqueFileName(kampung, noTps); // Dapatkan nama file unik
        const filePath = join(folderPath, namaFile); // Gabungkan path folder dan nama file
        await writeFile(filePath, bufferFile);

        // const urlFoto = `/c1/admin/${namaFile}`; // Update URL foto sesuai dengan struktur folder
        const urlFoto = `/c1/${kampung}/${namaFile}`; // Update URL foto sesuai dengan struktur folder

        try {
            await prisma.tps.update({
                where:{
                    id:parseInt(idTps)
                },
                data:{
                    jumlahSuara:parseInt(jumlahSuara),
                    urlFotoSuara:urlFoto,
                    submit:true
                    
                }
            })
        } catch (error) {
            console.log("error disini", error)
            return NextResponse.json({'message':'Internal server error'}, {status:500})
        }
    }else{
        try {
            await prisma.tps.update({
                where:{
                    id:parseInt(idTps)
                },
                data:{
                    jumlahSuara:parseInt(jumlahSuara),
                    submit:true
                    
                }
            })
        } catch (error) {
            console.log("error disini", error)
            return NextResponse.json({'message':'Internal server error'}, {status:500})
        }
    }

    

    return NextResponse.json({"message":"sukses"}, {status:200})
}