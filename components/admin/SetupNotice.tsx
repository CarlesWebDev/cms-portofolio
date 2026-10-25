import { supabaseEnvReady } from "@/lib/supabase/server";
export function SetupNotice() {
    if (supabaseEnvReady())
        return null;
    return (<div className="mx-auto max-w-xl border border-[var(--line)] p-6 mt-8 text-sm">
      <p className="font-display text-2xl mb-3">Setup dulu, yuk.</p>
      <ol className="list-decimal pl-5 space-y-2 text-[var(--muted)]">
        <li>
          Buat project baru di{" "}
          <a href="https://supabase.com/dashboard" className="underline" target="_blank" rel="noreferrer">
            supabase.com
          </a>
          .
        </li>
        <li>
          Jalankan <code className="label-mono">supabase/migration.sql</code> lalu{" "}
          <code className="label-mono">supabase/seed.sql</code> di SQL Editor.
        </li>
        <li>
          Matikan pendaftaran publik: Authentication → Providers → Email →
          nonaktifkan <em>Sign up</em>, lalu buat akun admin di Authentication → Users.
        </li>
        <li>
          Isi <code className="label-mono">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
          <code className="label-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di{" "}
          <code className="label-mono">.env.local</code>, lalu restart dev server.
        </li>
      </ol>
    </div>);
}
