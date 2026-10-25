"use client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
export async function toWebp(file: File): Promise<Blob> {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Gagal mengompres gambar."))), "image/webp", 0.8);
    });
}
export async function uploadMedia(file: File, compress = true) {
    const supabase = createSupabaseBrowserClient();
    const blob = compress ? await toWebp(file) : file;
    const base = file.name
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "gambar";
    const ext = compress ? "webp" : (file.name.split(".").pop() ?? "png");
    const path = `${base}-${Date.now()}.${ext}`;
    const mime = compress ? "image/webp" : file.type || "image/png";
    const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, blob, { contentType: mime });
    if (upErr)
        throw upErr;
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    const publicUrl = data.publicUrl;
    let width: number | null = null;
    let height: number | null = null;
    try {
        if (compress) {
            const bitmap = await createImageBitmap(file);
            width = Math.round(bitmap.width * Math.min(1, 1600 / bitmap.width));
            height = Math.round(bitmap.height * Math.min(1, 1600 / bitmap.width));
        }
    }
    catch {
    }
    const { data: media, error: dbErr } = await supabase
        .from("media")
        .insert({
        storage_path: path,
        url: publicUrl,
        filename: `${base}.${ext}`,
        size_bytes: blob.size,
        width,
        height,
        mime_type: mime,
    })
        .select()
        .single();
    if (dbErr)
        throw dbErr;
    return media as {
        id: string;
        url: string;
        filename: string;
    };
}
