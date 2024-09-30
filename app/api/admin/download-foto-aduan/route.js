import { NextResponse } from "next/server";
import archiver from "archiver";
import { createReadStream, createWriteStream } from "fs";
import { join } from "path";
import fs from "fs/promises";
import { prisma } from "@/app/lib/db";

export const GET = async (req) => {

    const headers = req.headers;
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

    const folderPath = join(process.cwd(), 'public/aduan'); // Path ke folder yang ingin dikompres
    const zipFilePath = join(process.cwd(), 'public/aduan.zip'); // Path untuk file ZIP yang dihasilkan

    // Menghapus file ZIP jika sudah ada
    try {
        await fs.unlink(zipFilePath);
    } catch (error) {
        // File mungkin tidak ada, jadi kita bisa abaikan error ini
        if (error.code !== 'ENOENT') {
            // Jika error bukan karena file tidak ada, kita lempar error
            throw error;
        }
    }

    const output = createWriteStream(zipFilePath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Level kompresi
    });

    output.on('close', () => {
        console.log(`Archive created: ${archive.pointer()} total bytes`);
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);
    archive.directory(folderPath, false); // Mengarsipkan seluruh folder
    await archive.finalize(); // Menyelesaikan proses kompresi

    // Mengirim file ZIP sebagai response
    const fileStream = createReadStream(zipFilePath);

    return new NextResponse(fileStream, {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="aduan.zip"',
        },
    });
};
