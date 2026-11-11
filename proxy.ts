import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL, hasSupabase } from "@/lib/supabase/env";

/**
 * Keeps the admin session fresh and sends signed-out visitors to the login page.
 * This is only a fast first check; every admin page and action verifies admin access again on the server.
 */
export async function proxy(request: NextRequest) {
  const isLogin = request.nextUrl.pathname.startsWith("/admin/login");
  if (!hasSupabase) return isLogin ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login/", request.url));

  let response = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login/", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
