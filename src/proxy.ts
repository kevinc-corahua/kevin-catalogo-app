import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/session-constants";

async function hasSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.ADMIN_LOGIN_PATH;

  // El link secreto se reescribe internamente a /admin/login.
  if (secret && pathname === `/${secret}`) {
    if (await hasSession(request)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const headers = new Headers(request.headers);
    headers.set("x-admin-login", "1");
    return NextResponse.rewrite(new URL("/admin/login", request.url), {
      request: { headers },
    });
  }

  // /admin/login directo no existe para el público (la página hace notFound()).
  if (pathname === "/admin/login") {
    const headers = new Headers(request.headers);
    headers.delete("x-admin-login");
    return NextResponse.next({ request: { headers } });
  }

  if (pathname.startsWith("/admin") && !(await hasSession(request))) {
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
