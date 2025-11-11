import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Get cookies object
    const cookieStore = await cookies();

    // Clear all auth-related cookies
    cookieStore.delete("authjs.session-token");
    cookieStore.delete("__Secure-authjs.session-token");
    cookieStore.delete("authjs.callback-url");
    cookieStore.delete("authjs.csrf-token");

    // Create redirect response to login
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error("Logout error:", error);

    // Still try to redirect even if there's an error
    const loginUrl = new URL("/login", req.url);
    const response = NextResponse.redirect(loginUrl);

    // Try to clear cookies in response as fallback
    response.cookies.delete("authjs.session-token");
    response.cookies.delete("__Secure-authjs.session-token");
    response.cookies.delete("authjs.callback-url");
    response.cookies.delete("authjs.csrf-token");

    return response;
  }
}

export async function GET(req: NextRequest) {
  // Support GET requests too for convenience
  return POST(req);
}
