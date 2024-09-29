import { NextResponse } from "next/server";
import archiver from "archiver";
import { createReadStream, createWriteStream } from "fs";
import { join } from "path";
import fs from "fs/promises";

export const GET = async (req) => {
    const folderPath = join(process.cwd(), 'public/c1'); // Path ke folder yang ingin dikompres
    const zipFilePath = join(process.cwd(), 'public/c1.zip'); // Path untuk file ZIP yang dihasilkan

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
            'Content-Disposition': 'attachment; filename="c1.zip"',
        },
    });
};
