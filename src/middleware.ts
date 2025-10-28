import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const protectedRoute = ["/profile"]

// Middleware is to protect routes 

// In Nextjs 16 Middleware is replaced with proxy

export async function middleware(req: NextRequest){
    const {nextUrl} = req 
    const sessionCookie = getSessionCookie(req)

    const res = NextResponse.next()
    
    const isLoggedIn = !!sessionCookie
    const isOnProtectedRoute = protectedRoute.includes(nextUrl.pathname)
    const isOnAuthRoute = nextUrl.pathname.startsWith("/auth")

    if(isOnProtectedRoute && !isLoggedIn){
        return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    if(isOnAuthRoute && isLoggedIn){
        return NextResponse.redirect(new URL("/profile", req.url))
    }

    return res
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}