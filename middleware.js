// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    // Cek status autentikasi dari cookie
    const token = request.cookies.get('status');
    const currentUrl = request.nextUrl.pathname;    
    
    // Jika rute mengarah ke folder gambar, izinkan akses tanpa autentikasi
    if (currentUrl.startsWith('/c1/')) {
        return NextResponse.next();
    }
    // Jika token tidak ada (user tidak authenticated)
    if (!token || token.value !== 'authenticated') {
        // Hanya redirect ke login jika bukan di halaman login (menghindari loop)
        if (currentUrl !== '/') {
            return NextResponse.redirect(new URL('/', request.url)); // Redirect ke halaman login
        }
    } else {
        // Jika user sudah authenticated dan mencoba mengakses halaman login
        if (currentUrl === '/') {
            // Redirect ke dashboard jika sudah login
            return NextResponse.redirect(new URL('/admin-side/home', request.url));
        }
    }

    return NextResponse.next(); // Lanjutkan permintaan jika authenticated
}

// Hanya terapkan middleware pada halaman, tidak pada API routes
export const config = {
    matcher: [
        // Semua halaman kecuali rute API
        '/((?!api|_next/static|_next/image|icon.png).*)',
    ],
};
