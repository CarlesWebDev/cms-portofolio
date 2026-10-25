"use server";
import { revalidateTag, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";
import { achievementSchema } from "@/lib/validators";
export type ActionState = {
    error?: string;
    success?: string;
};
async function logActivity(supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>["supabase"]>, entity: string, entityId: string | null, action: "create" | "update" | "delete", summary: string) {
    await supabase.from("activity_log").insert({ entity, entity_id: entityId, action, summary });
}
export async function saveAchievement(_prev: ActionState, formData: FormData): Promise<ActionState> {
    let id = String(formData.get("id") ?? "");
    const isNew = !id;
    const parsed = achievementSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
    }
    const input = parsed.data;
    const imageId = String(formData.get("image_id") ?? "").trim();
    try {
        const { supabase } = await requireAdmin();
        const row = {
            title: input.title,
            issuer: input.issuer || null,
            year: input.year,
            credential_url: input.credential_url,
            status: input.status,
            image_id: imageId || null,
        };
        let error: string | null = null;
        if (isNew) {
            const { data: last } = await supabase
                .from("achievements")
                .select("sort_order")
                .order("sort_order", { ascending: false })
                .limit(1)
                .maybeSingle();
            const { data, error: err } = await supabase
                .from("achievements")
                .insert({ ...row, sort_order: (last?.sort_order ?? 0) + 1 })
                .select("id")
                .single();
            error = err?.message ?? null;
            id = data?.id ?? id;
        }
        else {
            const { error: err } = await supabase
                .from("achievements")
                .update(row)
                .eq("id", id);
            error = err?.message ?? null;
        }
        if (error)
            return { error: `Gagal menyimpan: ${error}` };
        await logActivity(supabase, "achievements", id, isNew ? "create" : "update", isNew ? `Menambah prestasi ${input.title}` : `Mengubah prestasi ${input.title}`);
        if (input.status === "published") {
            revalidateTag("achievements", "max");
        }
        updateTag("admin-achievements");
    }
    catch (e) {
        return { error: e instanceof Error ? e.message : "Terjadi kesalahan." };
    }
    redirect(`/admin/prestasi?toast=${encodeURIComponent(isNew ? "Prestasi baru tersimpan ✓" : "Perubahan prestasi tersimpan ✓")}`);
}
export async function deleteAchievement(formData: FormData) {
    const id = String(formData.get("id") ?? "");
    if (!id)
        return;
    const { supabase } = await requireAdmin();
    const { data: existing } = await supabase
        .from("achievements")
        .select("title")
        .eq("id", id)
        .single();
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error)
        return;
    await logActivity(supabase, "achievements", id, "delete", `Menghapus prestasi ${existing?.title ?? id}`);
    revalidateTag("achievements", "max");
    updateTag("admin-achievements");
    redirect(`/admin/prestasi?toast=${encodeURIComponent("Prestasi dihapus ✓")}`);
}
