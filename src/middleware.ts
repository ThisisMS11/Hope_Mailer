import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // Redirect to sign-in page if no token is found
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Add CORS headers

  const response = NextResponse.next();
  return response;
}

// Specify the paths you want to protect
export const config = {
  matcher: ["/dashboard/:path*"],
};
