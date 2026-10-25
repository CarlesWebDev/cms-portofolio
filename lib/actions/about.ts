"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { requireAdmin } from "@/lib/supabase/server";
import { aboutSchema } from "@/lib/validators";
export type ActionState = {
    error?: string;
    success?: string;
};
export async function saveAbout(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const parsed = aboutSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
    }
    const photoId = String(formData.get("photo_id") ?? "").trim();
    try {
        const { supabase } = await requireAdmin();
        const cleanBody = DOMPurify.sanitize(parsed.data.body, {
            ALLOWED_TAGS: ["p", "strong", "em", "a", "br"],
            ALLOWED_ATTR: ["href", "rel", "target"],
        });
        const { data: existing } = await supabase
            .from("about")
            .select("id")
            .eq("id", 1)
            .maybeSingle();
        const row = {
            headline: parsed.data.headline || null,
            body: cleanBody || null,
            photo_id: photoId || null,
        };
        const { error } = existing
            ? await supabase.from("about").update(row).eq("id", 1)
            : await supabase.from("about").insert({ id: 1, ...row });
        if (error)
            return { error: `Gagal menyimpan: ${error.message}` };
        await supabase.from("activity_log").insert({
            entity: "about",
            entity_id: null,
            action: "update",
            summary: "Memperbarui halaman Tentang",
        });
        revalidateTag("about", "max");
    }
    catch (e) {
        return { error: e instanceof Error ? e.message : "Terjadi kesalahan." };
    }
    redirect(`/admin/tentang?toast=${encodeURIComponent("Tentang tersimpan ✓")}`);
}
