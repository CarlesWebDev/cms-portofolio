import Link from "next/link";
export function ComingSoon({ title }: {
    title: string;
}) {
    return (<div className="max-w-xl">
      <p className="label-mono text-[var(--muted)] mb-2">Menu</p>
      <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none mb-4">{title}</h1>
      <p className="text-[var(--muted)] mb-6">
        Menu ini direncanakan untuk <strong>Fase 2</strong> sesuai PRD: konten lengkap
        (rich text, media library, pengaturan situs). Skema database-nya sudah siap —
        tinggal dibangunkan form-nya.
      </p>
      <Link href="/admin" className="btn-ghost">
        ← Kembali ke Home
      </Link>
    </div>);
}
