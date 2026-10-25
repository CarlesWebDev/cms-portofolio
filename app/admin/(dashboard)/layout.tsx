import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { createSupabaseServerClient, supabaseEnvReady } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";
import { Toaster } from "@/components/admin/Toaster";
import { ThemeToggle } from "@/components/admin/ui";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { logout } from "@/lib/actions/auth";
export const instant = false;
export default async function AdminDashboardLayout({ children, }: LayoutProps<"/admin">) {
    await connection();
    if (!supabaseEnvReady()) {
        return (<div className="flex flex-col flex-1 items-center px-[var(--space-gutter)] py-12">
        <span className="font-display text-3xl mb-2">
          Carles<span className="text-[var(--accent)]">.</span> CMS
        </span>
        <p className="label-mono text-[var(--muted)] mb-4">Belum terhubung ke Supabase</p>
        <SetupNotice />
      </div>);
    }
    const supabase = await createSupabaseServerClient();
    const { data: { user }, } = await supabase!.auth.getUser();
    if (!user)
        redirect("/admin/login");
    return (<div className="flex flex-col md:flex-row flex-1 min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between gap-4 px-[var(--space-gutter)] py-4 border-b border-[var(--line)]">
          <span className="font-display text-2xl leading-none md:hidden">
            Carles<span className="text-[var(--accent)]">.</span>
          </span>
          <span className="label-mono text-[var(--muted)] hidden md:block">
            {user.email}
          </span>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <form action={logout}>
              <button type="submit" className="label-mono hover:text-[var(--accent)] transition-colors">
                Keluar
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-[var(--space-gutter)] py-8 md:py-12">{children}</main>
      </div>
      <Suspense fallback={null}>
        <Toaster />
      </Suspense>
    </div>);
}
