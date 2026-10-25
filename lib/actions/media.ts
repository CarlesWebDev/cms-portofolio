"use server";
import { updateTag } from "next/cache";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
export type MediaActionState = {
    error?: string;
    success?: string;
};
export async function deleteMedia(_prev: MediaActionState, formData: FormData): Promise<MediaActionState> {
    const id = String(formData.get("id") ?? "");
    if (!id)
        return {};
    const { supabase } = await requireAdmin();
    const [proj, ach, abt, st] = await Promise.all([
        supabase.from("projects").select("title").eq("thumbnail_id", id).limit(1),
        supabase.from("achievements").select("title").eq("image_id", id).limit(1),
        supabase.from("about").select("id").eq("photo_id", id).limit(1),
        supabase
            .from("site_settings")
            .select("id")
            .or(`favicon_id.eq.${id},og_image_id.eq.${id}`)
            .limit(1),
    ]);
    const usedIn: string[] = [];
    if (proj.data?.length)
        usedIn.push(`Projek ${proj.data[0].title}`);
    if (ach.data?.length)
        usedIn.push(`Prestasi ${ach.data[0].title}`);
    if (abt.data?.length)
        usedIn.push("Tentang");
    if (st.data?.length)
        usedIn.push("Pengaturan");
    if (usedIn.length > 0) {
        return {
            error: `Gambar masih dipakai di: ${usedIn.join(", ")}. Ganti dulu gambarnya sebelum menghapus.`,
        };
    }
    const { data: media } = await supabase
        .from("media")
        .select("storage_path")
        .eq("id", id)
        .single();
    await supabase.from("media").delete().eq("id", id);
    if (media?.storage_path) {
        await supabase.storage.from("media").remove([media.storage_path]);
    }
    await supabase.from("activity_log").insert({
        entity: "media",
        entity_id: id,
        action: "delete",
        summary: "Menghapus gambar dari Media",
    });
    updateTag("admin-media");
    revalidatePath("/admin/media");
    return { success: "Gambar dihapus ✓" };
}
