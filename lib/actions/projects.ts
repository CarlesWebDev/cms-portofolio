"use server";
import { revalidateTag, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";
import { projectSchema, parseTechStack, type ProjectInput } from "@/lib/validators";
export type ActionState = {
    error?: string;
    success?: string;
};
const PUBLIC_TAGS = ["projects", "now", "achievements", "about", "contact", "settings"];
async function logActivity(supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>["supabase"]>, entity: string, entityId: string | null, action: "create" | "update" | "delete", summary: string) {
    await supabase.from("activity_log").insert({ entity, entity_id: entityId, action, summary });
}
export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
    let id = String(formData.get("id") ?? "");
    const isNew = !id;
    const parsed = projectSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
    }
    const input = parsed.data as ProjectInput;
    const thumbnailId = String(formData.get("thumbnail_id") ?? "").trim();
    try {
        const { supabase, user } = await requireAdmin();
        const row = {
            title: input.title,
            slug: input.slug,
            category: input.category || null,
            year: input.year,
            status: input.status,
            summary: input.summary || null,
            live_url: input.live_url,
            repo_url: input.repo_url,
            tech_stack: parseTechStack(input.tech_stack ?? ""),
            cs_problem: input.cs_problem || null,
            cs_role: input.cs_role || null,
            cs_result: input.cs_result || null,
            thumbnail_id: thumbnailId || null,
        };
        let error: string | null = null;
        if (isNew) {
            let sort_order = 0;
            const { data: last } = await supabase
                .from("projects")
                .select("sort_order")
                .order("sort_order", { ascending: false })
                .limit(1)
                .maybeSingle();
            sort_order = (last?.sort_order ?? 0) + 1;
            const { data, error: err } = await supabase
                .from("projects")
                .insert({ ...row, sort_order })
                .select("id")
                .single();
            error = err?.message ?? null;
            id = data?.id ?? id;
        }
        else {
            const { error: err } = await supabase
                .from("projects")
                .update(row)
                .eq("id", id);
            error = err?.message ?? null;
        }
        if (error) {
            return { error: `Gagal menyimpan: ${error}` };
        }
        await logActivity(supabase, "projects", id, isNew ? "create" : "update", isNew ? `Menambah projek ${input.title}` : `Mengubah projek ${input.title}`);
        if (input.status === "published") {
            revalidateTag("projects", "max");
        }
        updateTag("admin-projects");
    }
    catch (e) {
        return { error: e instanceof Error ? e.message : "Terjadi kesalahan." };
    }
    redirect(`/admin/projek?toast=${encodeURIComponent(isNew ? "Projek baru tersimpan ✓" : "Perubahan projek tersimpan ✓")}`);
}
export async function deleteProject(formData: FormData) {
    const id = String(formData.get("id") ?? "");
    if (!id)
        return;
    const { supabase } = await requireAdmin();
    const { data: existing } = await supabase
        .from("projects")
        .select("title")
        .eq("id", id)
        .single();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error)
        return;
    await logActivity(supabase, "projects", id, "delete", `Menghapus projek ${existing?.title ?? id}`);
    revalidateTag("projects", "max");
    updateTag("admin-projects");
    redirect(`/admin/projek?toast=${encodeURIComponent("Projek dihapus ✓")}`);
}
export async function publishAll(_prev: ActionState, _formData: FormData): Promise<ActionState> {
    const { supabase } = await requireAdmin();
    try {
        for (const tag of PUBLIC_TAGS) {
            revalidateTag(tag, "max");
        }
        await supabase
            .from("publish_log")
            .insert({ status: "success", message: "Semua konten publik di-refresh." });
    }
    catch (e) {
        await supabase
            .from("publish_log")
            .insert({
            status: "failed",
            message: e instanceof Error ? e.message : "Gagal revalidate.",
        });
    }
    return { success: "Situs publik sudah di-refresh." };
}
