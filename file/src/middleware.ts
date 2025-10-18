import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const hostname = request.headers.get('host') || ''
  const protocol = request.nextUrl.protocol

  // Handle www to non-www redirect with HTTPS enforcement
  if (hostname.startsWith('www.')) {
    const newUrl = request.nextUrl.clone()
    newUrl.host = hostname.replace('www.', '')
    newUrl.protocol = 'https:'
    return NextResponse.redirect(newUrl, 301)
  }

  // Force HTTPS in production for non-www domains
  if (process.env.NODE_ENV === 'production' && protocol === 'http:' && !hostname.startsWith('localhost')) {
    const newUrl = request.nextUrl.clone()
    newUrl.protocol = 'https:'
    return NextResponse.redirect(newUrl, 301)
  }

  // Block bot access to API routes for certain patterns
  if (pathname.startsWith('/api/')) {
    const userAgent = request.headers.get('user-agent') || ''

    // Allow legitimate bots but block suspicious ones
    if (
      userAgent.includes('Googlebot') ||
      userAgent.includes('Bingbot') ||
      userAgent.includes('Chrome') ||
      userAgent.includes('Firefox') ||
      userAgent.includes('Safari')
    ) {
      return NextResponse.next()
    }
  }

  // Handle trailing slashes - remove them for consistency
  if (pathname.endsWith('/') && pathname !== '/') {
    const newUrl = request.nextUrl.clone()
    newUrl.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(newUrl, 301)
  }

  // Blog category parameter redirects
  if (pathname === '/blog' && search.includes('category=')) {
    // Allow blog category filtering but ensure it's clean
    const url = request.nextUrl.clone()
    const category = url.searchParams.get('category')

    // Redirect old category formats to new ones
    if (category === 'Tips %26 Tricks' || category === 'Tips & Tricks') {
      url.searchParams.set('category', 'Tips')
      return NextResponse.redirect(url, 301)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
}
