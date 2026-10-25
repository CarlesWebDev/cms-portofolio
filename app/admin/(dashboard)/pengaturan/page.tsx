import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";
import { SettingsForm } from "./SettingsForm";
export const metadata = { title: "Pengaturan — CMS Portofolio" };
export default async function PengaturanPage() {
    await connection();
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        return null;
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    async function mediaUrl(id: string | null) {
        if (!id)
            return null;
        const { data: media } = await supabase!
            .from("media")
            .select("url")
            .eq("id", id)
            .single();
        return media?.url ?? null;
    }
    const [faviconUrl, ogImageUrl] = await Promise.all([
        mediaUrl(data?.favicon_id ?? null),
        mediaUrl(data?.og_image_id ?? null),
    ]);
    return (<SettingsForm settings={data as SiteSettings | undefined} faviconUrl={faviconUrl} ogImageUrl={ogImageUrl}/>);
}
