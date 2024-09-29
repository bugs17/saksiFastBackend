import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises"; // Import mkdir untuk membuat folder

export const POST = async (req) => {

    const generateUniqueFileName = (idTps, namaSaksi) => {
        // Mengambil waktu saat ini dalam format ISO String
        const currentDateTime = new Date().toISOString();
      
        // Mengganti karakter yang tidak diinginkan dalam ISO String (seperti ":" dan ".")
        const formattedDateTime = currentDateTime.replace(/[:.]/g, "-");
      
        // Format nama file menjadi "nomor-tps_namaSaksi_ISOString.png"
        return `${idTps}_${namaSaksi}_${formattedDateTime}.png`;
    };

    const headers = req.headers;
    const usernameSaksi = headers.get('username');
    const passwordSaksi = headers.get('password');
    const roleSaksi = headers.get('role');

    // Form yang dikirim
    const formData = await req.formData();

    const idTps = formData.get('idTps');
    const jumlahSuara = formData.get('jumlahSuara');
    const fotoSuara = formData.get('fotoSuara');

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

    // Mengolah foto
    const bytes = await fotoSuara.arrayBuffer();
    const bufferFile = Buffer.from(bytes);
    const namaSaksi = user.nama;
    
    // Mendapatkan nama kampung untuk membuat folder
    const namaKampung = user.tps.kampung.namaKampung; // Pastikan ini sesuai dengan struktur data
    const folderPath = join(process.cwd(), 'public/c1', namaKampung);
    
    // Membuat folder jika belum ada
    await mkdir(folderPath, { recursive: true });

    const namaFile = generateUniqueFileName(idTps, namaSaksi); // Dapatkan nama file unik
    const filePath = join(folderPath, namaFile); // Gabungkan path folder dan nama file
    await writeFile(filePath, bufferFile);

    const urlFotoSuara = `/c1/${namaKampung}/${namaFile}`; // Update URL foto sesuai dengan struktur folder

    // Update data suara dan juga foto url foto c1
    try {
        await prisma.tps.update({
            where: {
                id: parseInt(idTps)
            },
            data: {
                jumlahSuara: parseInt(jumlahSuara),
                urlFotoSuara: urlFotoSuara
            }
        });
    } catch (error) {
        console.log("Error saat update TPS:", error);
        return NextResponse.json({ 'message': 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json({ 'message': 'sukses' }, { status: 200 });
};
