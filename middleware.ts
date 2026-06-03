import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;
  const method = request.method;
  const ip = getClientIp(request);

  // Server Actions se envían como POST a la misma URL de la página.
  if (method === "POST") {
    let limitCfg: { limit: number; windowMs: number } | null = null;
    let action = "";

    if (path === "/registro") {
      limitCfg = LIMITS.signup;
      action = "signup";
    } else if (path === "/login") {
      limitCfg = LIMITS.login;
      action = "login";
    } else if (path === "/reservar") {
      limitCfg = LIMITS.booking;
      action = "booking";
    }

    if (limitCfg) {
      const key = `ip:${ip}:${action}`;
      const { allowed, remaining, resetMs } = rateLimit(key, limitCfg.limit, limitCfg.windowMs);

      if (!allowed) {
        const retryAfterSec = Math.ceil(resetMs / 1000);
        return new NextResponse(
          JSON.stringify({ error: "Demasiadas solicitudes. Intentá de nuevo en unos minutos." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(retryAfterSec),
              "X-RateLimit-Limit": String(limitCfg.limit),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(retryAfterSec),
            },
          },
        );
      }

      response.headers.set("X-RateLimit-Remaining", String(remaining));
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: getUser() revalida el token contra Supabase (no confíes en getSession en middleware).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (path.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const protectedPaths = ["/mi-cuenta", "/reservar"];
  if (protectedPaths.some((p) => path.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const authOnlyPaths = ["/login", "/registro"];
  if (authOnlyPaths.some((p) => path.startsWith(p)) && user) {
    return NextResponse.redirect(new URL("/mi-cuenta", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
