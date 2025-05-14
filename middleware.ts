import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJwt } from './lib/jwt'

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // deja pasar todo lo de /auth y /api/auth
    if (pathname.startsWith('/auth/') || pathname.startsWith('/api/auth/')) {
        return NextResponse.next()
    }

    // comprueba token (cookie o header)
    const token = req.cookies.get('token')?.value
                || req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
        const url = req.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    }

    try {
        verifyJwt(token)
        return NextResponse.next()
    } catch {
        const url = req.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    }
}
