"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { saveAbout, type ActionState } from "@/lib/actions/about";
import type { About } from "@/lib/types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SubmitButton } from "@/components/admin/ui";
const initial: ActionState = {};
function clean(html: string) {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["p", "strong", "em", "a", "br"],
        ALLOWED_ATTR: ["href", "rel", "target"],
    });
}
export function AboutForm({ about, photoUrl, headline }: {
    about?: About;
    photoUrl?: string | null;
    headline?: string | null;
}) {
    const [state, formAction] = useActionState(saveAbout, initial);
    const [body, setBody] = useState(about?.body ?? "");
    const [previewHeadline, setPreviewHeadline] = useState(headline ?? "");
    return (<div className="max-w-5xl">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="label-mono text-[var(--muted)] mb-2">Ceritakan dirimu</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none">Tentang</h1>
        </div>
        <Link href="/admin" className="btn-ghost">
          ← Kembali
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <form action={formAction} className="flex flex-col gap-6">
          <div>
            <label htmlFor="headline" className="label-mono block mb-2 text-[var(--muted)]">
              Headline
            </label>
            <input id="headline" name="headline" className="input" defaultValue={about?.headline ?? ""} onChange={(e) => setPreviewHeadline(e.target.value)} placeholder="Halo, saya Carles Marvin" maxLength={200}/>
          </div>

          <div>
            <span className="label-mono block mb-2 text-[var(--muted)]">
              Paragraf — bold, italic, dan link inline didukung
            </span>
            <RichTextEditor name="body" initialContent={about?.body ?? ""} onHtmlChange={setBody}/>
          </div>

          <ImageUpload name="photo_id" label="Foto (opsional)" initialId={about?.photo_id} initialUrl={photoUrl}/>

          {state.error && (<p role="alert" className="text-sm" style={{ color: "#ff4d4d" }}>
              {state.error}
            </p>)}

          <SubmitButton>Simpan</SubmitButton>
        </form>

        
        <aside aria-label="Preview" className="border border-[var(--line)] p-6 self-start">
          <p className="label-mono text-[var(--muted)] mb-4">Preview — seperti di situs</p>
          <h2 className="font-display text-4xl leading-tight mb-4">
            {previewHeadline || <span className="text-[var(--muted)]">Headline-nya di sini</span>}
          </h2>
          <div className="space-y-3 text-[var(--fg)] [&_a]:text-[var(--accent)] [&_a]:underline [&_strong]:font-semibold [&_p]:mb-3" dangerouslySetInnerHTML={{
            __html: clean(body) || '<p><em>Belum ada paragraf.</em></p>',
        }}/>
        </aside>
      </div>
    </div>);
}
