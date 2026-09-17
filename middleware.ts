import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths that don't require authentication
const publicPaths = [
  "/login",
  "/about",
  "/pricing",
  "/docs",
  "/blog",
  "/",
  // Add static asset patterns
  "/_next",
  "/favicon.ico",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Check if the path is public and should not require authentication
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Skip authentication check for localhost
  const isLocalhost = request.headers.get("host")?.includes("localhost");
  if (isLocalhost) {
    return NextResponse.next();
  }

  // If user is not authenticated and the path is not public, redirect to login
  if (!token && !isPublicPath) {
    console.log(`Redirecting unauthenticated user from ${pathname} to login`);
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access login, redirect to dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Match all routes except for specific static asset patterns
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
