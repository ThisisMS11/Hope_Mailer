import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token");
  const refreshToken = req.cookies.get("refresh_token");

  if (!accessToken && refreshToken) {
    const refreshUrl = new URL("/api/auth/refresh", req.url);
    refreshUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(refreshUrl);
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
