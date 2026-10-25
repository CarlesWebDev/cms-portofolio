"use client";
import { useRef, useState } from "react";
import { uploadMedia } from "@/lib/media-upload";
import { MediaPickerModal } from "./MediaPickerModal";
export function ImageUpload({ name, initialId, initialUrl, label = "Gambar (opsional)", compress = true, hint, }: {
    name: string;
    initialId?: string | null;
    initialUrl?: string | null;
    label?: string;
    compress?: boolean;
    hint?: string;
}) {
    const [id, setId] = useState(initialId ?? "");
    const [url, setUrl] = useState(initialUrl ?? "");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [pickerOpen, setPickerOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setError("");
        setUploading(true);
        try {
            const media = await uploadMedia(file, compress);
            setId(media.id);
            setUrl(media.url);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Upload gagal. Coba lagi.");
        }
        finally {
            setUploading(false);
            if (inputRef.current)
                inputRef.current.value = "";
        }
    }
    return (<div>
      <span className="label-mono block mb-2 text-[var(--muted)]">{label}</span>

      {url && (<img src={url} alt="Pratinjau gambar" className="w-full max-w-sm aspect-[3/2] object-contain border border-[var(--line)] bg-[var(--bg)] mb-3"/>)}

      <input type="hidden" name={name} value={id}/>

      <div className="flex flex-wrap gap-3">
        <input ref={inputRef} type="file" accept="image/*" onChange={onFile} disabled={uploading} className="text-sm text-[var(--muted)] file:mr-3 file:btn-ghost file:cursor-pointer" aria-label={label}/>
        <button type="button" className="btn-ghost" onClick={() => setPickerOpen(true)}>
          Pilih dari Media
        </button>
        {id && (<button type="button" className="btn-danger" onClick={() => {
                setId("");
                setUrl("");
            }}>
            Hapus gambar
          </button>)}
      </div>

      {hint && <p className="label-mono text-[var(--muted)] mt-2">{hint}</p>}
      {uploading && <p className="text-sm text-[var(--muted)] mt-2">Mengompres & mengunggah…</p>}
      {error && (<p role="alert" className="text-sm mt-2" style={{ color: "#ff4d4d" }}>
          {error}
        </p>)}
      {id && !uploading && !error && (<p className="text-sm text-[var(--accent)] mt-2">
          Gambar siap — tersimpan saat kamu tekan Simpan.
        </p>)}

      <MediaPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={(m) => {
            setId(m.id);
            setUrl(m.url);
        }}/>
    </div>);
}
