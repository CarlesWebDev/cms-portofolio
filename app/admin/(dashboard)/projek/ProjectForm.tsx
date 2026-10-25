"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { saveProject, deleteProject, type ActionState } from "@/lib/actions/projects";
import { slugify } from "@/lib/validators";
import type { Project } from "@/lib/types";
import { ConfirmSubmitButton, SubmitButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";
const initial: ActionState = {};
function Field({ label, children, }: {
    label: string;
    children: React.ReactNode;
}) {
    return (<div>
      <span className="label-mono block mb-2 text-[var(--muted)]">{label}</span>
      {children}
    </div>);
}
export function ProjectForm({ project, thumbnailUrl, }: {
    project?: Project;
    thumbnailUrl?: string | null;
}) {
    const [state, formAction] = useActionState(saveProject, initial);
    const [title, setTitle] = useState(project?.title ?? "");
    const [slug, setSlug] = useState(project?.slug ?? "");
    const [slugLocked, setSlugLocked] = useState(!project);
    return (<div className="max-w-3xl">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="label-mono text-[var(--muted)] mb-2">Projek</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none">
            {project ? "Ubah projek" : "Projek baru"}
          </h1>
        </div>
        <Link href="/admin/projek" className="btn-ghost">
          ← Kembali
        </Link>
      </div>

      <form action={formAction} className="flex flex-col gap-6">
        {project && <input type="hidden" name="id" value={project.id}/>}

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Judul *">
            <input name="title" required className="input" value={title} onChange={(e) => {
            setTitle(e.target.value);
            if (slugLocked)
                setSlug(slugify(e.target.value));
        }} placeholder="Corelev Digital"/>
          </Field>
          <Field label="Slug (otomatis dari judul, bisa diubah) *">
            <input name="slug" required className="input font-mono" value={slug} onChange={(e) => {
            setSlugLocked(false);
            setSlug(e.target.value);
        }} placeholder="corelev-digital"/>
          </Field>
          <Field label="Kategori">
            <input name="category" className="input" defaultValue={project?.category ?? ""} placeholder="Website Agensi"/>
          </Field>
          <Field label="Tahun">
            <input name="year" className="input" inputMode="numeric" defaultValue={project?.year ?? ""} placeholder="2025"/>
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={project?.status ?? "draft"} className="select">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Tech stack (pisahkan dengan koma)">
            <input name="tech_stack" className="input" defaultValue={project?.tech_stack?.join(", ") ?? ""} placeholder="Next.js, Tailwind CSS"/>
          </Field>
          <Field label="Link live">
            <input name="live_url" type="url" className="input" defaultValue={project?.live_url ?? ""} placeholder="https://…"/>
          </Field>
          <Field label="Link repo">
            <input name="repo_url" type="url" className="input" defaultValue={project?.repo_url ?? ""} placeholder="https://github.com/…"/>
          </Field>
        </div>

        <ImageUpload name="thumbnail_id" label="Thumbnail" initialId={project?.thumbnail_id} initialUrl={thumbnailUrl}/>

        <Field label="Deskripsi singkat">
          <textarea name="summary" rows={2} className="textarea" defaultValue={project?.summary ?? ""} placeholder="Satu-dua kalimat yang muncul di daftar projek."/>
        </Field>

        <fieldset className="border border-[var(--line)] p-5 flex flex-col gap-5">
          <legend className="label-mono text-[var(--muted)] px-2">Case study (opsional)</legend>
          <Field label="Masalah">
            <textarea name="cs_problem" rows={2} className="textarea" defaultValue={project?.cs_problem ?? ""}/>
          </Field>
          <Field label="Peran saya">
            <textarea name="cs_role" rows={2} className="textarea" defaultValue={project?.cs_role ?? ""}/>
          </Field>
          <Field label="Hasil">
            <textarea name="cs_result" rows={2} className="textarea" defaultValue={project?.cs_result ?? ""}/>
          </Field>
        </fieldset>

        {state.error && (<p role="alert" className="text-sm" style={{ color: "#ff4d4d" }}>
            {state.error}
          </p>)}
        {state.success && (<p role="status" className="text-sm text-[var(--accent)]">
            {state.success}
          </p>)}

        <div className="flex items-center gap-3">
          <SubmitButton>Simpan</SubmitButton>
          {project && (<span className="text-xs text-[var(--muted)]">
              Form tetap terisi kalau gagal simpan.
            </span>)}
        </div>
      </form>

      {project && (<form action={deleteProject} className="mt-12 pt-8 border-t border-[var(--line)]">
          <input type="hidden" name="id" value={project.id}/>
          <ConfirmSubmitButton message={`Hapus projek "${project.title}"? Ini tidak bisa dibatalkan.`}>
            Hapus projek
          </ConfirmSubmitButton>
        </form>)}
    </div>);
}
