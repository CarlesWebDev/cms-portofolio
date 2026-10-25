import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActivityLog, PublishLog } from "@/lib/types";
import { PublishButton } from "./PublishButton";
import { SetupNotice } from "@/components/admin/SetupNotice";
export const metadata = { title: "Home — CMS Portofolio" };
function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)
        return "baru saja";
    if (m < 60)
        return `${m} menit lalu`;
    const h = Math.floor(m / 60);
    if (h < 24)
        return `${h} jam lalu`;
    return `${Math.floor(h / 24)} hari lalu`;
}
export default async function AdminHomePage() {
    await connection();
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        return <SetupNotice />;
    const [{ count: projectCount }, { count: publishedCount }, { count: achievementCount }, { data: logs }, { data: publish }] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("achievements").select("*", { count: "exact", head: true }),
        supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("publish_log").select("*").order("triggered_at", { ascending: false }).limit(1),
    ]);
    const lastPublish = (publish as PublishLog[] | null)?.[0];
    const draftCount = (projectCount ?? 0) - (publishedCount ?? 0);
    const stats = [
        { label: "Projek", value: projectCount ?? 0 },
        { label: "Prestasi", value: achievementCount ?? 0 },
        { label: "Draft projek", value: draftCount },
    ];
    return (<div className="max-w-3xl">
      <p className="label-mono text-[var(--muted)] mb-3">Home</p>
      <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.95] mb-10">
        Halo, Carles.
      </h1>

      <div className="grid grid-cols-3 gap-px bg-[var(--line)] border border-[var(--line)] mb-10">
        {stats.map((s) => (<div key={s.label} className="bg-[var(--bg)] p-3 sm:p-5">
            <p className="font-display text-3xl sm:text-4xl">{s.value}</p>
            <p className="label-mono text-[var(--muted)] mt-1">{s.label}</p>
          </div>))}
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-12">
        <Link href="/admin/sekarang" className="btn-ghost">
          Update Sekarang →
        </Link>
        <PublishButton />
        {lastPublish && (<p className="label-mono text-[var(--muted)]">
            Publish terakhir: {timeAgo(lastPublish.triggered_at)} ·{" "}
            <span style={{ color: lastPublish.status === "success" ? "var(--accent)" : "#ff4d4d" }}>
              {lastPublish.status === "success" ? "berhasil" : "gagal"}
            </span>
          </p>)}
      </div>

      <section>
        <h2 className="label-mono text-[var(--muted)] mb-4">Perubahan terakhir</h2>
        {logs && logs.length > 0 ? (<ul className="border-t border-[var(--line)]">
            {(logs as ActivityLog[]).map((log) => (<li key={log.id} className="flex items-baseline justify-between gap-4 py-3 border-b border-[var(--line)] text-sm">
                <span>{log.summary}</span>
                <span className="label-mono text-[var(--muted)] shrink-0">
                  {timeAgo(log.created_at)}
                </span>
              </li>))}
          </ul>) : (<p className="text-[var(--muted)] text-sm">
            Belum ada perubahan. Mulai dengan{" "}
            <Link href="/admin/projek/baru" className="underline">
              menambah projek
            </Link>
            .
          </p>)}
      </section>
    </div>);
}
