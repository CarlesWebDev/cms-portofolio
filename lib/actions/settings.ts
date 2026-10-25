"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";
import { siteSettingsSchema } from "@/lib/validators";
export type ActionState = {
    error?: string;
    success?: string;
};
const PUBLIC_TAGS = ["projects", "achievements", "now", "about", "contact", "settings"];
export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const parsed = siteSettingsSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
    }
    const faviconId = String(formData.get("favicon_id") ?? "").trim();
    const ogImageId = String(formData.get("og_image_id") ?? "").trim();
    try {
        const { supabase } = await requireAdmin();
        const { data: existing } = await supabase
            .from("site_settings")
            .select("id")
            .eq("id", 1)
            .maybeSingle();
        const row = {
            site_title: parsed.data.site_title || null,
            meta_description: parsed.data.meta_description || null,
            favicon_id: faviconId || null,
            og_image_id: ogImageId || null,
            hero_greeting: parsed.data.hero_greeting || null,
            hero_label: parsed.data.hero_label || null,
            hero_cta_text: parsed.data.hero_cta_text || null,
            hero_cta_link: parsed.data.hero_cta_link || null,
            footer_text: parsed.data.footer_text || null,
        };
        const { error } = existing
            ? await supabase.from("site_settings").update(row).eq("id", 1)
            : await supabase.from("site_settings").insert({ id: 1, ...row });
        if (error)
            return { error: `Gagal menyimpan: ${error.message}` };
        await supabase.from("activity_log").insert({
            entity: "site_settings",
            entity_id: null,
            action: "update",
            summary: "Memperbarui Pengaturan situs",
        });
        for (const tag of PUBLIC_TAGS) {
            revalidateTag(tag, "max");
        }
    }
    catch (e) {
        return { error: e instanceof Error ? e.message : "Terjadi kesalahan." };
    }
    redirect(`/admin/pengaturan?toast=${encodeURIComponent("Pengaturan tersimpan ✓")}`);
}
