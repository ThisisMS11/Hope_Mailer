import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("🔄 Refresh route hit");

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log("🌐 Backend URL:", baseUrl);

  const cookieHeader = req.headers.get("cookie") || "";
  console.log("🍪 Incoming cookies:", cookieHeader);

  const backendRes = await fetch(`${baseUrl}/public/refresh-token`, {
    method: "POST",
    headers: {
      cookie: cookieHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
    credentials: "include",
  });

  console.log("📡 Refresh token response status:", backendRes.status);

  if (!backendRes.ok) {
    console.warn("⚠️ Failed to refresh token, redirecting to /auth");
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  const setCookieHeader = backendRes.headers.get("set-cookie");
  console.log("📥 Set-Cookie from backend:", setCookieHeader);

  const redirectTo = req.nextUrl.searchParams.get("redirect") || "/";
  console.log("🔀 Redirecting to:", redirectTo);

  const response = NextResponse.redirect(new URL(redirectTo, req.url));

  if (setCookieHeader) {
    response.headers.set("set-cookie", setCookieHeader);
    console.log("✅ Set-Cookie header forwarded to browser");
  } else {
    console.warn("⚠️ No Set-Cookie header found in backend response");
  }

  return response;
}
