import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Only run auth middleware for protected routes
  if (
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/analytics")
  ) {
    try {
      const supabase = createMiddlewareClient({ req, res })
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        const redirectUrl = new URL("/auth/signin", req.url)
        redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      // If there's an error with Supabase, redirect to signin
      console.error("Middleware auth error:", error)
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/analytics/:path*"],
}
