import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { SetupNotice } from "@/components/admin/SetupNotice";
export const metadata = { title: "Projek — CMS Portofolio" };
export default async function ProjekListPage({ searchParams, }: PageProps<"/admin/projek">) {
    await connection();
    const { q = "", kategori = "" } = await searchParams;
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        return <SetupNotice />;
    let query = supabase.from("projects").select("*").order("sort_order");
    if (q)
        query = query.ilike("title", `%${q}%`);
    if (kategori)
        query = query.eq("category", kategori);
    const { data: projects } = await query;
    const { data: all } = await supabase.from("projects").select("category");
    const categories = [...new Set((all ?? []).map((p) => p.category).filter(Boolean))];
    return (<div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="label-mono text-[var(--muted)] mb-2">Yang pernah saya bikin</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none">Projek</h1>
        </div>
        <Link href="/admin/projek/baru" className="btn-primary">
          Tambah projek
        </Link>
      </div>

      <form className="flex flex-wrap gap-3 mb-8" role="search">
        <input type="search" name="q" defaultValue={q} placeholder="Cari judul…" className="input max-w-xs" aria-label="Cari projek"/>
        <select name="kategori" defaultValue={kategori} className="select max-w-[12rem]" aria-label="Filter kategori">
          <option value="">Semua kategori</option>
          {categories.map((c) => (<option key={c} value={c as string}>
              {c as string}
            </option>))}
        </select>
        <button type="submit" className="btn-ghost">
          Cari
        </button>
      </form>

      {projects && projects.length > 0 ? (<ul className="border-t border-[var(--line)]">
          {(projects as Project[]).map((p) => (<li key={p.id} className="border-b border-[var(--line)]">
              <Link href={`/admin/projek/${p.id}`} className="flex items-center justify-between gap-3 sm:gap-4 py-4 group">
                <div className="min-w-0">
                  <p className="font-display text-xl sm:text-2xl group-hover:text-[var(--accent)] transition-colors truncate">
                    {p.title}
                  </p>
                  <p className="label-mono text-[var(--muted)] mt-1">
                    {p.category ?? "Tanpa kategori"} · {p.year ?? "—"}
                  </p>
                </div>
                <span className={`badge shrink-0 ${p.status === "published" ? "badge-published" : ""}`}>
                  {p.status === "published" ? "Published" : "Draft"}
                </span>
              </Link>
            </li>))}
        </ul>) : (<p className="text-[var(--muted)]">
          Tidak ada projek yang cocok.{" "}
          <Link href="/admin/projek/baru" className="underline">
            Tambah yang baru?
          </Link>
        </p>)}
    </div>);
}
