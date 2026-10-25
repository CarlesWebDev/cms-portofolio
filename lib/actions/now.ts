"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";
import { nowSchema } from "@/lib/validators";
export type ActionState = {
    error?: string;
    success?: string;
};
export async function saveNow(_prev: ActionState, formData: FormData): Promise<ActionState> {
    const parsed = nowSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
    }
    try {
        const { supabase } = await requireAdmin();
        const row = {
            coding: parsed.data.coding || null,
            learning: parsed.data.learning || null,
            listening: parsed.data.listening || null,
        };
        const { data: existing } = await supabase
            .from("now_status")
            .select("id")
            .eq("id", 1)
            .maybeSingle();
        const { error } = existing
            ? await supabase.from("now_status").update(row).eq("id", 1)
            : await supabase.from("now_status").insert({ id: 1, ...row });
        if (error)
            return { error: `Gagal menyimpan: ${error.message}` };
        await supabase.from("activity_log").insert({
            entity: "now_status",
            entity_id: null,
            action: "update",
            summary: "Memperbarui status Sekarang",
        });
        revalidateTag("now", "max");
    }
    catch (e) {
        return { error: e instanceof Error ? e.message : "Terjadi kesalahan." };
    }
    redirect(`/admin/sekarang?toast=${encodeURIComponent("Status Sekarang diperbarui ✓")}`);
}
