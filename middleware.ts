import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";


export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = Buffer.from(process.env.JWT_SECRET!, "base64");
    
    const decoded: any = jwt.verify(token, secret);

    if (
      req.nextUrl.pathname.startsWith("/player") &&
      !decoded.authorities?.includes("ROLE_PLAYER")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      !decoded.authorities?.includes("ROLE_ADMIN")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verify failed:", err);
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Vilka routes middleware ska gälla på
export const config = {
  matcher: ["/player/:path*", "/admin/:path*"],
  runtime: "nodejs",
};