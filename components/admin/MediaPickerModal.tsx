"use client";
import { useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Media } from "@/lib/types";
export function MediaPickerModal({ open, onClose, onPick, }: {
    open: boolean;
    onClose: () => void;
    onPick: (media: {
        id: string;
        url: string;
    }) => void;
}) {
    const [items, setItems] = useState<Media[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (!open)
            return;
        setLoading(true);
        const supabase = createSupabaseBrowserClient();
        supabase
            .from("media")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data }) => {
            setItems((data ?? []) as Media[]);
            setLoading(false);
        });
    }, [open]);
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    if (!open)
        return null;
    async function handleFiles(files: FileList | File[]) {
        setError("");
        setUploading(true);
        const supabase = createSupabaseBrowserClient();
        try {
            for (const file of Array.from(files)) {
                if (!file.type.startsWith("image/"))
                    continue;
                const { uploadMedia } = await import("@/lib/media-upload");
                const media = await uploadMedia(file);
                setItems((prev) => [media as unknown as Media, ...prev]);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Upload gagal.");
        }
        finally {
            setUploading(false);
        }
        void supabase;
    }
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose} role="dialog" aria-modal="true" aria-label="Pilih gambar dari Media">
      <div className="w-full max-w-2xl max-h-[80vh] flex flex-col border border-[var(--line)] bg-[var(--bg)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--line)]">
          <p className="font-display text-2xl">Pilih gambar</p>
          <button type="button" onClick={onClose} className="label-mono hover:text-[var(--accent)]">
            Tutup ✕
          </button>
        </div>

        <div className={`px-5 py-4 border-b border-[var(--line)] transition-colors ${dragging ? "bg-[var(--line)]" : ""}`} onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
        }} onDragLeave={() => setDragging(false)} onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files.length)
                handleFiles(e.dataTransfer.files);
        }}>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)}/>
          <button type="button" className="btn-ghost" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? "Mengunggah…" : "Upload baru (bisa banyak sekaligus)"}
          </button>
          <p className="label-mono text-[var(--muted)] mt-2">
            Atau drop gambar ke sini — otomatis dikompres ke WebP.
          </p>
          {error && (<p role="alert" className="text-sm mt-2" style={{ color: "#ff4d4d" }}>
              {error}
            </p>)}
        </div>

        <div className="overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {loading && <p className="text-sm text-[var(--muted)]">Memuat…</p>}
          {!loading && items.length === 0 && (<p className="text-sm text-[var(--muted)]">Belum ada gambar di Media.</p>)}
          {items.map((m) => (<button key={m.id} type="button" className="text-left group" onClick={() => {
                onPick({ id: m.id, url: m.url });
                onClose();
            }}>
              
              <img src={m.url} alt={m.filename} className="w-full aspect-[4/3] object-cover border border-[var(--line)] group-hover:border-[var(--accent)] transition-colors"/>
              <p className="label-mono text-[var(--muted)] mt-1 truncate">{m.filename}</p>
            </button>))}
        </div>
      </div>
    </div>);
}
