import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware executando...");

  // Lê o cookie
  const token = request.cookies.get("JSESSIONID")?.value;

  // Se não tiver token, redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/minha_agenda/:path*"],
};
