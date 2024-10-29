// middleware.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname

  // Get the token using new edge runtime compatible `getToken`
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  })

  // Admin route protection
  if (path.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
    
    // Check for admin role in token
    // Make sure this matches how you store the admin status in your token
    if (!token.isAdmin) {
      // Redirect non-admin users to the home page
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // If user is authenticated, continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
    // Add other protected routes as needed
    // '/protected/:path*',
  ]
}