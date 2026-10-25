"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
export function Toaster() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const message = searchParams.get("toast");
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!message)
            return;
        setVisible(true);
        const hide = setTimeout(() => setVisible(false), 3500);
        const clean = setTimeout(() => {
            const next = new URLSearchParams(window.location.search);
            next.delete("toast");
            router.replace(`?${next.toString()}`, { scroll: false });
        }, 4000);
        return () => {
            clearTimeout(hide);
            clearTimeout(clean);
        };
    }, [message, router]);
    if (!message)
        return null;
    return (<div role="status" aria-live="polite" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 transition-all duration-300" style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
        }}>
      <div className="flex items-center gap-3 border border-[var(--line)] bg-[var(--bg)] px-5 py-3 shadow-lg">
        <span className="text-[var(--accent)]" aria-hidden>
          ✓
        </span>
        <span className="text-sm">{message}</span>
      </div>
    </div>);
}
