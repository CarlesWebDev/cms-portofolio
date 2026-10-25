import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { SetupNotice } from "@/components/admin/SetupNotice";
export const metadata: Metadata = { title: "Login — CMS Portofolio" };
export default function AdminLoginPage() {
    return (<section className="flex flex-col items-center pt-16 md:pt-24">
      <p className="label-mono text-[var(--muted)] mb-3">Panel admin</p>
      <h1 className="font-display text-[clamp(2.5rem,11vw,5rem)] leading-[0.95] text-center">
        Ngatur konten<br />
        jadi gampang.
      </h1>
      <div className="mt-10 flex justify-center w-full">
        <LoginForm />
      </div>
      <SetupNotice />
    </section>);
}
