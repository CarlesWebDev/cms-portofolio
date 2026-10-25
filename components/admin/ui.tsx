"use client";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
export function SubmitButton({ children, className = "btn-primary", pending: pendingLabel = "Menyimpan…", }: {
    children: React.ReactNode;
    className?: string;
    pending?: string;
}) {
    const { pending } = useFormStatus();
    return (<button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : children}
    </button>);
}
export function ConfirmSubmitButton({ children, message, className = "btn-danger", }: {
    children: React.ReactNode;
    message: string;
    className?: string;
}) {
    const { pending } = useFormStatus();
    return (<button type="submit" className={className} disabled={pending} onClick={(e) => {
            if (!window.confirm(message))
                e.preventDefault();
        }}>
      {pending ? "Menghapus…" : children}
    </button>);
}
export function ThemeToggle() {
    const [dark, setDark] = useState(false);
    useEffect(() => {
        const isDark = localStorage.getItem("theme") === "dark";
        setDark(isDark);
        applyTheme(isDark);
    }, []);
    function applyTheme(next: boolean) {
        const root = document.documentElement;
        root.classList.toggle("dark", next);
        root.classList.toggle("light", !next);
    }
    return (<button type="button" aria-label={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"} title={dark ? "Mode terang" : "Mode gelap"} onClick={() => {
            const next = !dark;
            setDark(next);
            applyTheme(next);
            localStorage.setItem("theme", next ? "dark" : "light");
        }} className="w-9 h-9 flex items-center justify-center border border-[var(--line)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
      {dark ? <Sun size={16} weight="bold"/> : <Moon size={16} weight="bold"/>}
    </button>);
}
