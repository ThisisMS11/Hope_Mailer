import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token");

  if (!accessToken?.value && accessToken) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  const response = NextResponse.next();
  return response;
}

// Specify the paths you want to protect
export const config = {
  matcher: ["/dashboard/:path*"],
};
