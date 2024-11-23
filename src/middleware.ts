import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/signin' || path === '/signup'
    const token = request.cookies.get('token')?.value || ''

    // If the user is trying to access a public path and is already logged in, redirect to profile
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/profile', request.url))
    }

    // If the user is trying to access a protected path without a token, redirect to signin
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    // Allow the request to proceed if the user is authenticated or accessing public paths
    return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/signup',
    '/signin',
    '/profile',

  ]
}