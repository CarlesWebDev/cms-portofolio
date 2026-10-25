import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
export async function proxy(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    const envReady = supabaseUrl.startsWith("http") &&
        !supabaseUrl.includes("YOUR-PROJECT") &&
        supabaseKey.length > 20;
    if (!envReady)
        return NextResponse.next();
    let response = NextResponse.next({ request });
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
            },
        },
    });
    const { data: { user }, } = await supabase.auth.getUser();
    const { pathname } = request.nextUrl;
    const isAdminArea = pathname.startsWith("/admin") && pathname !== "/admin/login";
    if (isAdminArea && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
    }
    if (pathname === "/admin/login" && user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
    }
    return response;
}
export const config = {
    matcher: ["/admin/:path*"],
};
