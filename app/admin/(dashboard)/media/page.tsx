import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Media } from "@/lib/types";
import { MediaManager } from "./MediaManager";
export const metadata = { title: "Media — CMS Portofolio" };
export default async function MediaPage() {
    await connection();
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        return null;
    const { data: media } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false });
    const [thumbs, certs, about, settings] = await Promise.all([
        supabase.from("projects").select("title,thumbnail_id"),
        supabase.from("achievements").select("title,image_id"),
        supabase.from("about").select("photo_id"),
        supabase.from("site_settings").select("favicon_id,og_image_id"),
    ]);
    const usage = new Map<string, string[]>();
    const addUse = (id: string | null, label: string) => {
        if (!id)
            return;
        usage.set(id, [...(usage.get(id) ?? []), label]);
    };
    (thumbs.data ?? []).forEach((p) => addUse(p.thumbnail_id, `Projek ${p.title}`));
    (certs.data ?? []).forEach((a) => addUse(a.image_id, `Prestasi ${a.title}`));
    (about.data ?? []).forEach((a) => addUse(a.photo_id, "Tentang"));
    (settings.data ?? []).forEach((s) => {
        addUse(s.favicon_id, "Favicon");
        addUse(s.og_image_id, "OG image");
    });
    const items = ((media ?? []) as Media[]).map((m) => ({ ...m, usedIn: usage.get(m.id) ?? [] }));
    return (<div>
      <p className="label-mono text-[var(--muted)] mb-2">Gudang gambar</p>
      <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none mb-10">Media</h1>
      <MediaManager initialMedia={items}/>
    </div>);
}
