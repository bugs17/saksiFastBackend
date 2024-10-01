import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises"; // Import mkdir untuk membuat folder
import { decode } from "base64-arraybuffer";

export const POST = async (req) => {

    const generateUniqueFileName = (idTps, namaSaksi) => {
        // Mengambil waktu saat ini dalam format ISO String
        const currentDateTime = new Date().toISOString();
      
        // Mengganti karakter yang tidak diinginkan dalam ISO String (seperti ":" dan ".")
        const formattedDateTime = currentDateTime.replace(/[:.]/g, "-");
      
        // Format nama file menjadi "nomor-tps_namaSaksi_ISOString.png"
        return `${idTps}_${namaSaksi}_${formattedDateTime}.png`;
    };

    const data = await req.json()
    const idTps = data.idTps
    const ketAduan = data.ketAduan
    const usernameSaksi = data.username
    const passwordSaksi = data.password
    const roleSaksi = data.role
    const fotoAduan = data.fotoAduan
    

    
    let user;
    // Mengambil saksi user & validasi credential
    try {
        user = await prisma.saksi.findFirst({
            where: {
                username: usernameSaksi
            },
            include: {
                tps: {
                    include: {
                        kampung: {
                            include: {
                                distrik: true
                            }
                        }
                    }
                }
            }
        });
        if (!user || passwordSaksi !== user.password || roleSaksi !== 'saksi') {
            return NextResponse.json({ 'message': 'Unauthorized' }, { status: 401 });
        }

    } catch (error) {
        console.log("Error validasi", error);
        return NextResponse.json({ 'message': 'Unauthorized' }, { status: 401 });
    }

    if(fotoAduan !== null) {
        
        // Mengolah foto
        const bytes = decode(data.fotoAduan)
        // const bytes = await fotoSuara.arrayBuffer();
        const bufferFile = Buffer.from(bytes);
        const namaSaksi = user.nama;
        
        // Mendapatkan nama kampung untuk membuat folder
        const namaKampung = user.tps.kampung.namaKampung; // Pastikan ini sesuai dengan struktur data
        const folderPath = join(process.cwd(), 'upload/aduan', namaKampung);
        
        // Membuat folder jika belum ada
        await mkdir(folderPath, { recursive: true });
    
        const namaFile = generateUniqueFileName(idTps, namaSaksi); // Dapatkan nama file unik
        const filePath = join(folderPath, namaFile); // Gabungkan path folder dan nama file
        await writeFile(filePath, bufferFile);
    
        const urlFotoAduan = `/upload/aduan/${namaKampung}/${namaFile}`; // Update URL foto sesuai dengan struktur folder
    
        // Update data suara dan juga foto url foto c1
        try {
            const data = await prisma.tps.update({
                where: {
                    id: parseInt(idTps)
                },
                data: {
                    fotoAduan:urlFotoAduan,
                    keteranganAduan:ketAduan,
                    aduan:true
                }
            });
            return NextResponse.json({ 'data': data }, { status: 200 });
        } catch (error) {
            console.log("Error saat update Aduan:", error);
            return NextResponse.json({ 'message': 'Internal server error' }, { status: 500 });
        }
    }else{
        try {
            const data = await prisma.tps.update({
                where: {
                    id: parseInt(idTps)
                },
                data: {
                    keteranganAduan:ketAduan,
                    aduan:true
                }
            });
            return NextResponse.json({ 'data': data }, { status: 200 });
        } catch (error) {
            console.log("Error saat update Aduan:", error);
            return NextResponse.json({ 'message': 'Internal server error' }, { status: 500 });
        }
    }

};
