"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const MENU = [
    { href: "/admin", label: "Home" },
    { href: "/admin/projek", label: "Projek" },
    { href: "/admin/prestasi", label: "Prestasi" },
    { href: "/admin/sekarang", label: "Sekarang" },
    { href: "/admin/tentang", label: "Tentang" },
    { href: "/admin/kontak", label: "Kontak" },
    { href: "/admin/media", label: "Media" },
    { href: "/admin/pengaturan", label: "Pengaturan" },
];
export function Sidebar() {
    const pathname = usePathname();
    return (<>
      
      <aside className="hidden md:flex flex-col gap-6 w-56 shrink-0 border-r border-[var(--line)] px-6 py-8">
        <Link href="/admin" className="font-display text-2xl leading-none">
          Carles<span className="text-[var(--accent)]">.</span>
        </Link>
        <nav className="flex flex-col gap-1" aria-label="Menu admin">
          {MENU.map((item) => {
            const active = item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (<Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`label-mono py-2 border-l-2 pl-3 transition-colors ${active
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--fg)]"}`}>
                {item.label}
              </Link>);
        })}
        </nav>
      </aside>

      
      <nav className="md:hidden flex gap-1 overflow-x-auto border-b border-[var(--line)] px-4 py-3" aria-label="Menu admin">
        {MENU.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (<Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`label-mono whitespace-nowrap px-3 py-1.5 border rounded-sm ${active
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-[var(--line)] text-[var(--muted)]"}`}>
              {item.label}
            </Link>);
        })}
      </nav>
    </>);
}
