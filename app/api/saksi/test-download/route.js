import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server"


export const GET = async (req) => {


    // // Ambil semua distrik
    // const distrik = await prisma.distrik.findMany({
    //     include: {
    //         kampung: {
    //             include: {
    //                 tps: true // Sertakan relasi TPS
    //             }
    //         }
    //     }
    // });

    // // Mengelompokkan dan menjumlahkan suara per kampung
    // const hasil = distrik.map(d => {
    //     const kampungData = d.kampung.map(k => {
    //         const totalJumlahSuara = k.tps.reduce((sum, t) => sum + t.jumlahSuara, 0); // Menjumlahkan suara per kampung

    //         return {
    //             namaKampung: k.namaKampung,
    //             totalJumlahSuara
    //         };
    //     });

    //     return {
    //         namaDistrik: d.namaDistrik,
    //         kampung: kampungData
    //     };
    // });

    const distrik = await prisma.distrik.findMany({
        include: {
            kampung: {
                include: {
                    tps: true // Sertakan relasi TPS
                }
            }
        }
    });

    // Mengelompokkan dan menjumlahkan suara per kampung dan total suara per distrik
    const hasil = distrik.map(d => {
        const kampungData = d.kampung.map(k => {
            const tpsData = k.tps.map(t => ({
                nomorTps: t.nomorTps,
                totalJumlahSuara: t.jumlahSuara
            }));

            const totalJumlahSuaraKampung = tpsData.reduce((sum, t) => sum + t.totalJumlahSuara, 0); // Menjumlahkan suara per kampung

            return {
                namaKampung: k.namaKampung,
                totalJumlahSuara: totalJumlahSuaraKampung,
                tps: tpsData // Menambahkan data TPS ke dalam kampung
            };
        });

        // Menghitung total suara untuk distrik
        const totalSuaraDistrik = kampungData.reduce((sum, k) => sum + k.totalJumlahSuara, 0);

        return {
            namaDistrik: d.namaDistrik,
            totalSuara: totalSuaraDistrik, // Menambahkan total suara per distrik
            kampung: kampungData
        };
    });

    return NextResponse.json({'data':hasil},{status:200})
}