import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/lib/auth/auth-config";

export async function POST(req: NextRequest) {
  try {
    // Use NextAuth signOut function
    await signOut({ redirect: false });

    // Create redirect response
    const response = NextResponse.redirect(new URL("/login", req.url));

    // Clear all auth-related cookies
    response.cookies.delete("authjs.session-token");
    response.cookies.delete("__Secure-authjs.session-token");
    response.cookies.delete("session");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    // Still redirect even if there's an error
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("authjs.session-token");
    response.cookies.delete("__Secure-authjs.session-token");
    response.cookies.delete("session");
    return response;
  }
}

export async function GET(req: NextRequest) {
  // Support GET requests too for convenience
  return POST(req);
}
