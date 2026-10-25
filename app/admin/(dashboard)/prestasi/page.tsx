import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Achievement } from "@/lib/types";
import { SetupNotice } from "@/components/admin/SetupNotice";
export const metadata = { title: "Prestasi — CMS Portofolio" };
export default async function PrestasiListPage({ searchParams, }: PageProps<"/admin/prestasi">) {
    await connection();
    const { q = "" } = await searchParams;
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        return <SetupNotice />;
    let query = supabase.from("achievements").select("*").order("sort_order");
    if (q)
        query = query.ilike("title", `%${q}%`);
    const { data: items } = await query;
    return (<div className="max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="label-mono text-[var(--muted)] mb-2">Bukti perjalanan</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none">Prestasi</h1>
        </div>
        <Link href="/admin/prestasi/baru" className="btn-primary">
          Tambah prestasi
        </Link>
      </div>

      <form className="flex gap-3 mb-8" role="search">
        <input type="search" name="q" defaultValue={q} placeholder="Cari judul…" className="input max-w-xs" aria-label="Cari prestasi"/>
        <button type="submit" className="btn-ghost">
          Cari
        </button>
      </form>

      {items && items.length > 0 ? (<ul className="border-t border-[var(--line)]">
          {(items as Achievement[]).map((a) => (<li key={a.id} className="border-b border-[var(--line)]">
              <Link href={`/admin/prestasi/${a.id}`} className="flex items-center justify-between gap-3 sm:gap-4 py-4 group">
                <div className="min-w-0">
                  <p className="font-display text-xl sm:text-2xl group-hover:text-[var(--accent)] transition-colors truncate">
                    {a.title}
                  </p>
                  <p className="label-mono text-[var(--muted)] mt-1">
                    {a.issuer ?? "Tanpa penerbit"} · {a.year ?? "—"}
                  </p>
                </div>
                <span className={`badge shrink-0 ${a.status === "published" ? "badge-published" : ""}`}>
                  {a.status === "published" ? "Published" : "Draft"}
                </span>
              </Link>
            </li>))}
        </ul>) : (<p className="text-[var(--muted)]">
          Belum ada prestasi.{" "}
          <Link href="/admin/prestasi/baru" className="underline">
            Tambah yang pertama?
          </Link>
        </p>)}
    </div>);
}
