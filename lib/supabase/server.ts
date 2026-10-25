import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export function supabaseEnvReady() {
    return (SUPABASE_URL.startsWith("http") &&
        !SUPABASE_URL.includes("YOUR-PROJECT") &&
        SUPABASE_ANON_KEY.length > 20);
}
export async function createSupabaseServerClient() {
    if (!supabaseEnvReady())
        return null;
    const cookieStore = await cookies();
    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                }
                catch {
                }
            },
        },
    });
}
export async function requireAdmin() {
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        throw new Error("Supabase belum dikonfigurasi.");
    const { data: { user }, } = await supabase.auth.getUser();
    if (!user)
        throw new Error("Kamu harus login dulu.");
    return { supabase, user };
}
