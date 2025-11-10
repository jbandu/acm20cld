import { auth } from "@/lib/auth/auth-config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes
  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based redirects
  if (isLoggedIn && req.auth) {
    const role = req.auth.user?.role;

    // Manager routes
    if (pathname.startsWith("/manager") && role !== "MANAGER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/researcher", req.url));
    }

    // Admin routes
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/researcher", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
