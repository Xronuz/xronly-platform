import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Skip middleware for the homepage
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("__session"); // Firebase auth session cookie
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // Protect dashboard routes - redirect to login if not authenticated
  if (isDashboardRoute && !authCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // For authenticated users:
  // - Redirect login page to dashboard
  // - Allow access to register page (for business profile completion)
  if (authCookie) {
    if (request.nextUrl.pathname === "/auth/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
