"use client";
import { useActionState } from "react";
import { saveNow, type ActionState } from "@/lib/actions/now";
import type { NowStatus } from "@/lib/types";
import { SubmitButton } from "@/components/admin/ui";
const initial: ActionState = {};
const FIELDS = [
    { name: "coding", label: "Lagi ngoding", placeholder: "Membangun CMS untuk portofolio ini" },
    { name: "learning", label: "Lagi belajar", placeholder: "Next.js dan Supabase" },
    { name: "listening", label: "Lagi dengerin lagu", placeholder: "Lofi di jam kerja" },
] as const;
export function NowForm({ now }: {
    now?: NowStatus;
}) {
    const [state, formAction] = useActionState(saveNow, initial);
    return (<div className="max-w-xl">
      <p className="label-mono text-[var(--muted)] mb-2">Status terkini</p>
      <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none mb-3">Sekarang</h1>
      {now?.updated_at && (<p className="label-mono text-[var(--muted)] mb-8">
          Terakhir diupdate:{" "}
          {new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(new Date(now.updated_at))}
        </p>)}

      <form action={formAction} className="flex flex-col gap-6">
        {FIELDS.map((f) => (<div key={f.name}>
            <label htmlFor={`now-${f.name}`} className="label-mono block mb-2 text-[var(--muted)]">
              {f.label}
            </label>
            <input id={`now-${f.name}`} name={f.name} className="input" defaultValue={now?.[f.name] ?? ""} placeholder={f.placeholder} maxLength={200}/>
          </div>))}

        {state.error && (<p role="alert" className="text-sm" style={{ color: "#ff4d4d" }}>
            {state.error}
          </p>)}
        {state.success && (<p role="status" className="text-sm text-[var(--accent)]">
            {state.success}
          </p>)}

        <SubmitButton>Simpan</SubmitButton>
      </form>
    </div>);
}
