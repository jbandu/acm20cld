import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Delete the session cookie
    const cookieStore = await cookies();
    cookieStore.delete("session");

    // Redirect to login page
    return NextResponse.redirect(new URL("/login", req.url));
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export async function GET(req: NextRequest) {
  // Support GET requests too for convenience
  return POST(req);
}
