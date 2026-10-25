"use client";
import { useCallback, useEffect, useRef, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia } from "@/lib/media-upload";
import { deleteMedia, type MediaActionState } from "@/lib/actions/media";
import type { Media } from "@/lib/types";
const initial: MediaActionState = {};
function fmtSize(bytes: number | null) {
    if (!bytes)
        return "—";
    if (bytes < 1024 * 1024)
        return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export function MediaManager({ initialMedia, }: {
    initialMedia: (Media & {
        usedIn: string[];
    })[];
}) {
    const [items, setItems] = useState(initialMedia);
    const [uploading, setUploading] = useState(0);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [state, formAction] = useActionState(deleteMedia, initial);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFiles = useCallback(async (files: FileList | File[]) => {
        setError("");
        setUploading((n) => n + 1);
        try {
            for (const file of Array.from(files)) {
                if (!file.type.startsWith("image/"))
                    continue;
                const media = await uploadMedia(file);
                setItems((prev) => [{ ...(media as unknown as Media), usedIn: [] }, ...prev]);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Upload gagal.");
        }
        finally {
            setUploading((n) => n - 1);
        }
    }, []);
    return (<div className="max-w-5xl">
      
      <div className={`border border-dashed p-8 text-center transition-colors ${dragging ? "border-[var(--accent)] bg-[var(--line)]" : "border-[var(--line)]"}`} onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
        }} onDragLeave={() => setDragging(false)} onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files.length)
                handleFiles(e.dataTransfer.files);
        }}>
        <p className="font-display text-3xl mb-2">Drop gambarnya di sini.</p>
        <p className="label-mono text-[var(--muted)] mb-4">
          Bisa banyak sekaligus — otomatis dikompres ke WebP (lebar maks 1600px, kualitas 80%)
        </p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)}/>
        <button type="button" className="btn-primary" onClick={() => inputRef.current?.click()}>
          Pilih file
        </button>
        {uploading > 0 && (<p className="text-sm text-[var(--muted)] mt-3">
            Mengunggah {uploading} batch…
          </p>)}
        {error && (<p role="alert" className="text-sm mt-3" style={{ color: "#ff4d4d" }}>
            {error}
          </p>)}
      </div>

      {state.error && (<p role="alert" className="mt-6 text-sm" style={{ color: "#ff4d4d" }}>
          {state.error}
        </p>)}

      
      {items.length === 0 ? (<p className="text-[var(--muted)] mt-8">Belum ada gambar. Mulai dengan drop di atas.</p>) : (<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {items.map((m) => (<li key={m.id} className="border border-[var(--line)]">
              
              <img src={m.url} alt={m.filename} loading="lazy" className="w-full aspect-[4/3] object-cover"/>
              <div className="p-4">
                <p className="text-sm truncate" title={m.filename}>
                  {m.filename}
                </p>
                <p className="label-mono text-[var(--muted)] mt-1">
                  {fmtSize(m.size_bytes)} ·{" "}
                  {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(m.created_at))}
                </p>
                {m.usedIn.length > 0 ? (<p className="label-mono text-[var(--accent)] mt-2">
                    Dipakai di: {m.usedIn.join(", ")}
                  </p>) : (<p className="label-mono text-[var(--muted)] mt-2">Belum dipakai</p>)}
                <form action={formAction} className="mt-3" onSubmit={(e) => {
                    if (!window.confirm(`Hapus gambar "${m.filename}"?`))
                        e.preventDefault();
                    else
                        setDeleting(m.id);
                }}>
                  <input type="hidden" name="id" value={m.id}/>
                  <button type="submit" className="btn-danger w-full" disabled={state.error ? false : deleting === m.id}>
                    {deleting === m.id ? "Menghapus…" : "Hapus"}
                  </button>
                </form>
              </div>
            </li>))}
        </ul>)}
    </div>);
}
