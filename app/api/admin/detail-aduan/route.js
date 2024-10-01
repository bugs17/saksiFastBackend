import { NextResponse } from "next/server"
import { readFile } from 'fs/promises';
import { join } from 'path';

export const POST = async (req) => {
    const body = await req.json()
    const imageUrl = body.url

    const filePath = join(process.cwd(), 'public', imageUrl); // Sesuaikan dengan path folder public
    const imageBuffer = await readFile(filePath); // Baca file gambar




    return NextResponse.json({"fotoAduan": imageBuffer.toString('base64'),})
}