"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { saveSettings, type ActionState } from "@/lib/actions/settings";
import type { SiteSettings } from "@/lib/types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SubmitButton } from "@/components/admin/ui";
const initial: ActionState = {};
function Counter({ value, max }: {
    value: string;
    max: number;
}) {
    const len = value.length;
    const over = len > max;
    return (<span className="label-mono" style={{ color: over ? "#ff4d4d" : "var(--muted)" }}>
      {len}/{max}
    </span>);
}
export function SettingsForm({ settings, faviconUrl, ogImageUrl, }: {
    settings?: SiteSettings;
    faviconUrl?: string | null;
    ogImageUrl?: string | null;
}) {
    const [state, formAction] = useActionState(saveSettings, initial);
    const [siteTitle, setSiteTitle] = useState(settings?.site_title ?? "");
    const [metaDesc, setMetaDesc] = useState(settings?.meta_description ?? "");
    const [ogUrl, setOgUrl] = useState(ogImageUrl ?? "");
    return (<div className="max-w-2xl">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="label-mono text-[var(--muted)] mb-2">Rumahnya situs</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none">Pengaturan</h1>
        </div>
        <Link href="/admin" className="btn-ghost">
          ← Kembali
        </Link>
      </div>

      <form action={formAction} className="flex flex-col gap-8">
        <fieldset className="border border-[var(--line)] p-5 flex flex-col gap-5">
          <legend className="label-mono text-[var(--muted)] px-2">Identitas situs</legend>
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label htmlFor="site_title" className="label-mono text-[var(--muted)]">
                Judul situs
              </label>
              <Counter value={siteTitle} max={60}/>
            </div>
            <input id="site_title" name="site_title" className="input" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} placeholder="Carles Marvin — Web Developer"/>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label htmlFor="meta_description" className="label-mono text-[var(--muted)]">
                Meta description
              </label>
              <Counter value={metaDesc} max={155}/>
            </div>
            <textarea id="meta_description" name="meta_description" rows={3} className="textarea" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder="Portofolio Carles Marvin, web developer…"/>
            <p className="label-mono text-[var(--muted)] mt-1">
              Lebih dari batas itu, teks terpotong di hasil pencarian.
            </p>
          </div>
          <ImageUpload name="favicon_id" label="Favicon" initialId={settings?.favicon_id} initialUrl={faviconUrl} compress={false} hint="PNG, SVG, atau ICO — tanpa kompres"/>
        </fieldset>

        <fieldset className="border border-[var(--line)] p-5 flex flex-col gap-5">
          <legend className="label-mono text-[var(--muted)] px-2">Berbagi link</legend>
          <ImageUpload name="og_image_id" label="OG image (gambar saat link dibagikan)" initialId={settings?.og_image_id} initialUrl={ogImageUrl} compress={false} hint="JPG atau PNG 1200×630 — tanpa kompres"/>

          
          <div className="border border-[var(--line)] max-w-md" aria-label="Preview kartu share">
            {ogUrl ? (<img src={ogUrl} alt="Preview OG image" className="w-full aspect-[1200/630] object-cover"/>) : (<div className="w-full aspect-[1200/630] bg-[var(--line)] flex items-center justify-center">
                <span className="label-mono text-[var(--muted)]">OG image menyusul</span>
              </div>)}
            <div className="p-3">
              <p className="text-sm truncate">{siteTitle || "Judul situs"}</p>
              <p className="label-mono text-[var(--muted)] mt-1 line-clamp-2">
                {metaDesc || "Meta description muncul di sini."}
              </p>
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-[var(--line)] p-5 flex flex-col gap-5">
          <legend className="label-mono text-[var(--muted)] px-2">Hero</legend>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="hero_greeting" className="label-mono block mb-2 text-[var(--muted)]">
                Sapaan
              </label>
              <input id="hero_greeting" name="hero_greeting" className="input" defaultValue={settings?.hero_greeting ?? ""} placeholder="Halo, saya Carles Marvin"/>
            </div>
            <div>
              <label htmlFor="hero_label" className="label-mono block mb-2 text-[var(--muted)]">
                Label atas
              </label>
              <input id="hero_label" name="hero_label" className="input" defaultValue={settings?.hero_label ?? ""} placeholder="Web Developer"/>
            </div>
            <div>
              <label htmlFor="hero_cta_text" className="label-mono block mb-2 text-[var(--muted)]">
                Teks CTA
              </label>
              <input id="hero_cta_text" name="hero_cta_text" className="input" defaultValue={settings?.hero_cta_text ?? ""} placeholder="Ngobrol yuk"/>
            </div>
            <div>
              <label htmlFor="hero_cta_link" className="label-mono block mb-2 text-[var(--muted)]">
                Link CTA
              </label>
              <input id="hero_cta_link" name="hero_cta_link" className="input" defaultValue={settings?.hero_cta_link ?? ""} placeholder="#kontak, /karya, atau https://…"/>
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-[var(--line)] p-5">
          <legend className="label-mono text-[var(--muted)] px-2">Footer</legend>
          <label htmlFor="footer_text" className="sr-only">
            Teks footer
          </label>
          <input id="footer_text" name="footer_text" className="input" defaultValue={settings?.footer_text ?? ""} placeholder="Dibuat dengan sepenuh hati di Indonesia."/>
        </fieldset>

        {state.error && (<p role="alert" className="text-sm" style={{ color: "#ff4d4d" }}>
            {state.error}
          </p>)}

        <SubmitButton>Simpan</SubmitButton>
      </form>
    </div>);
}
