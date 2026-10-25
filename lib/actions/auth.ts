"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, supabaseEnvReady } from "@/lib/supabase/server";
export type AuthState = {
    error?: string;
};
export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
    if (!supabaseEnvReady()) {
        return { error: "Supabase belum dikonfigurasi. Isi .env.local dulu." };
    }
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (!email || !password) {
        return { error: "Email dan password wajib diisi." };
    }
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        return { error: "Supabase belum dikonfigurasi." };
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        return { error: "Email atau password salah. Coba lagi." };
    }
    redirect("/admin");
}
export async function logout() {
    const supabase = await createSupabaseServerClient();
    if (supabase)
        await supabase.auth.signOut();
    redirect("/admin/login");
}
