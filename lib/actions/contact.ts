"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validators";
export type ActionState = {
    error?: string;
    success?: string;
};
const PLATFORMS = ["github", "linkedin", "instagram", "whatsapp"] as const;
export async function saveContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const parsed = contactSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
    }
    try {
        const { supabase } = await requireAdmin();
        const { data: existing } = await supabase
            .from("contact")
            .select("id")
            .eq("id", 1)
            .maybeSingle();
        const row = {
            section_title: parsed.data.section_title || null,
            email: parsed.data.email || null,
            copy_button_label: parsed.data.copy_button_label || null,
        };
        const { error } = existing
            ? await supabase.from("contact").update(row).eq("id", 1)
            : await supabase.from("contact").insert({ id: 1, ...row });
        if (error)
            return { error: `Gagal menyimpan: ${error.message}` };
        for (const platform of PLATFORMS) {
            let value = String(formData.get(`social_${platform}`) ?? "").trim();
            if (platform === "whatsapp") {
                value = value.replace(/[^0-9]/g, "");
                if (value.startsWith("0"))
                    value = `62${value.slice(1)}`;
            }
            const visible = formData.get(`visible_${platform}`) === "on";
            const { data: existing } = await supabase
                .from("social_links")
                .select("id")
                .eq("platform", platform)
                .maybeSingle();
            if (existing) {
                await supabase
                    .from("social_links")
                    .update({ url: value, visible })
                    .eq("id", existing.id);
            }
            else {
                await supabase.from("social_links").insert({
                    platform,
                    url: value || " ",
                    visible,
                    sort_order: PLATFORMS.indexOf(platform) + 1,
                });
            }
        }
        await supabase.from("activity_log").insert({
            entity: "contact",
            entity_id: null,
            action: "update",
            summary: "Memperbarui halaman Kontak",
        });
        revalidateTag("contact", "max");
    }
    catch (e) {
        return { error: e instanceof Error ? e.message : "Terjadi kesalahan." };
    }
    redirect(`/admin/kontak?toast=${encodeURIComponent("Kontak tersimpan ✓")}`);
}
