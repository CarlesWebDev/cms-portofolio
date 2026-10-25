"use client";
import { useActionState } from "react";
import { login, type AuthState } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/admin/ui";
const initial: AuthState = {};
export default function LoginForm() {
    const [state, formAction] = useActionState(login, initial);
    return (<form action={formAction} className="flex flex-col gap-5 max-w-sm w-full">
      <div>
        <label htmlFor="email" className="label-mono block mb-2 text-[var(--muted)]">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" placeholder="kamu@contoh.com"/>
      </div>
      <div>
        <label htmlFor="password" className="label-mono block mb-2 text-[var(--muted)]">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" placeholder="••••••••"/>
      </div>

      {state.error && (<p role="alert" className="text-sm" style={{ color: "#ff4d4d" }}>
          {state.error}
        </p>)}

      <SubmitButton pending="Masuk…">Masuk</SubmitButton>
    </form>);
}
