import { ThemeToggle } from "@/components/admin/ui";
export default function AdminLoginLayout({ children }: LayoutProps<"/admin/login">) {
    return (<div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-[var(--space-gutter)] py-5 border-b border-[var(--line)]">
        <span className="font-display text-2xl leading-none">
          Carles<span className="text-[var(--accent)]">.</span>
        </span>
        <ThemeToggle />
      </header>
      <main className="flex flex-col flex-1 px-[var(--space-gutter)] pb-16">
        {children}
      </main>
    </div>);
}
