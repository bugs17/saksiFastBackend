import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { readFile } from 'fs/promises';
import { join } from 'path';


export const POST = async (req) => {

    const body = await req.json()
    const idTps = body.idTps


    try {
        const totalSuara = await prisma.tps.findFirst({
            where:{
                id:parseInt(idTps)
            }
        })
        

        const imageUrl = totalSuara.fotoAduan; // Ambil URL gambar dari database
        if (imageUrl === '') {
            return NextResponse.json({"urlFotoSuara": null}, {status:200})
        }
        const filePath = join(process.cwd(), 'public', imageUrl); // Sesuaikan dengan path folder
        const imageBuffer = await readFile(filePath); // Baca file gambar

        return NextResponse.json({
            "urlFotoAduan": imageBuffer.toString('base64'), // Mengirim gambar dalam format base64
            "keterangan":totalSuara.keteranganAduan
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json' // Set header yang sesuai
            }
        });
    } catch (error) {
        console.log("Terjadi error query", error)
        return NextResponse.json({'message':'Internal server error'}, {status:500})
    }
}