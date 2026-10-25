"use client";
import { useActionState } from "react";
import Link from "next/link";
import { saveAchievement, deleteAchievement, type ActionState } from "@/lib/actions/achievements";
import type { Achievement } from "@/lib/types";
import { ConfirmSubmitButton, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";
const initial: ActionState = {};
export function AchievementForm({ achievement, imageUrl, }: {
    achievement?: Achievement;
    imageUrl?: string | null;
}) {
    const [state, formAction] = useActionState(saveAchievement, initial);
    return (<div className="max-w-2xl">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="label-mono text-[var(--muted)] mb-2">Prestasi</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none">
            {achievement ? "Ubah prestasi" : "Prestasi baru"}
          </h1>
        </div>
        <Link href="/admin/prestasi" className="btn-ghost">
          ← Kembali
        </Link>
      </div>

      <form action={formAction} className="flex flex-col gap-6">
        {achievement && <input type="hidden" name="id" value={achievement.id}/>}

        <div>
          <span className="label-mono block mb-2 text-[var(--muted)]">Judul *</span>
          <input name="title" required className="input" defaultValue={achievement?.title ?? ""} placeholder="Sertifikat Penyelesaian IoT"/>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <span className="label-mono block mb-2 text-[var(--muted)]">Penerbit</span>
            <input name="issuer" className="input" defaultValue={achievement?.issuer ?? ""} placeholder="Cisco"/>
          </div>
          <div>
            <span className="label-mono block mb-2 text-[var(--muted)]">Tahun</span>
            <input name="year" inputMode="numeric" className="input" defaultValue={achievement?.year ?? ""} placeholder="2026"/>
          </div>
          <div>
            <span className="label-mono block mb-2 text-[var(--muted)]">Link kredensial</span>
            <input name="credential_url" type="url" className="input" defaultValue={achievement?.credential_url ?? ""} placeholder="https://…"/>
          </div>
          <div>
            <span className="label-mono block mb-2 text-[var(--muted)]">Status</span>
            <select name="status" defaultValue={achievement?.status ?? "draft"} className="select">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <ImageUpload name="image_id" label="Gambar sertifikat (opsional)" initialId={achievement?.image_id} initialUrl={imageUrl}/>

        {state.error && (<p role="alert" className="text-sm" style={{ color: "#ff4d4d" }}>
            {state.error}
          </p>)}
        {state.success && (<p role="status" className="text-sm text-[var(--accent)]">
            {state.success}
          </p>)}

        <SubmitButton>Simpan</SubmitButton>
      </form>

      {achievement && (<form action={deleteAchievement} className="mt-12 pt-8 border-t border-[var(--line)]">
          <input type="hidden" name="id" value={achievement.id}/>
          <ConfirmSubmitButton message={`Hapus prestasi "${achievement.title}"? Ini tidak bisa dibatalkan.`}>
            Hapus prestasi
          </ConfirmSubmitButton>
        </form>)}
    </div>);
}
