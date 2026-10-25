"use client";
import { useActionState } from "react";
import Link from "next/link";
import { saveContact, type ActionState } from "@/lib/actions/contact";
import type { Contact, SocialLink } from "@/lib/types";
import { SubmitButton } from "@/components/admin/ui";
const initial: ActionState = {};
const SOCIALS = [
    { platform: "github", label: "GitHub", placeholder: "https://github.com/username" },
    { platform: "linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/in/username" },
    { platform: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/username" },
    {
        platform: "whatsapp",
        label: "WhatsApp",
        placeholder: "6281234567890 (nomor, link wa.me dibuat otomatis)",
    },
] as const;
function socialValue(links: SocialLink[], platform: string) {
    const link = links.find((l) => l.platform === platform);
    if (!link)
        return "";
    if (platform === "whatsapp" && link.url.startsWith("wa.me/")) {
        return link.url.slice("wa.me/".length);
    }
    return link.url;
}
export function ContactForm({ contact, socials, }: {
    contact?: Contact;
    socials: SocialLink[];
}) {
    const [state, formAction] = useActionState(saveContact, initial);
    return (<div className="max-w-2xl">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="label-mono text-[var(--muted)] mb-2">Ngobrol yuk</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none">Kontak</h1>
        </div>
        <Link href="/admin" className="btn-ghost">
          ← Kembali
        </Link>
      </div>

      <form action={formAction} className="flex flex-col gap-8">
        <fieldset className="border border-[var(--line)] p-5 flex flex-col gap-5">
          <legend className="label-mono text-[var(--muted)] px-2">Teks section</legend>
          <div>
            <label htmlFor="section_title" className="label-mono block mb-2 text-[var(--muted)]">
              Judul section
            </label>
            <input id="section_title" name="section_title" className="input" defaultValue={contact?.section_title ?? ""} placeholder="Ada ide? Ceritain aja." maxLength={200}/>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="email" className="label-mono block mb-2 text-[var(--muted)]">
                Email
              </label>
              <input id="email" name="email" type="email" className="input" defaultValue={contact?.email ?? ""} placeholder="kamu@contoh.com"/>
            </div>
            <div>
              <label htmlFor="copy_button_label" className="label-mono block mb-2 text-[var(--muted)]">
                Teks tombol "Salin email"
              </label>
              <input id="copy_button_label" name="copy_button_label" className="input" defaultValue={contact?.copy_button_label ?? ""} placeholder="Salin email" maxLength={100}/>
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-[var(--line)] p-5 flex flex-col gap-5">
          <legend className="label-mono text-[var(--muted)] px-2">Sosmed</legend>
          {SOCIALS.map((s) => {
            const value = socialValue(socials, s.platform);
            const visible = socials.find((l) => l.platform === s.platform)?.visible ?? false;
            return (<div key={s.platform} className="flex items-center gap-3">
                <input type="checkbox" name={`visible_${s.platform}`} defaultChecked={visible} className="w-4 h-4 accent-[var(--accent)]" aria-label={`Tampilkan ${s.label}`}/>
                <span className="label-mono w-24 shrink-0">{s.label}</span>
                <input name={`social_${s.platform}`} className="input" defaultValue={value} placeholder={s.placeholder} inputMode={s.platform === "whatsapp" ? "tel" : undefined}/>
              </div>);
        })}
          <p className="label-mono text-[var(--muted)]">
            Centang = tampil di situs. Kosongkan URL untuk menyembunyikan.
          </p>
        </fieldset>

        {state.error && (<p role="alert" className="text-sm" style={{ color: "#ff4d4d" }}>
            {state.error}
          </p>)}

        <SubmitButton>Simpan</SubmitButton>
      </form>
    </div>);
}
