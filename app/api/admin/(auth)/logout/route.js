import { NextResponse } from 'next/server';

export const POST = async (req) => {
    const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    
    // Hapus cookie dengan mengatur expires di masa lalu
    response.cookies.set('status', '', {
        httpOnly: true,
        secure: false,
        path: '/',
        expires: new Date(0), // Mengatur waktu kedaluwarsa di masa lalu untuk menghapus cookie
    });

    return response;
};