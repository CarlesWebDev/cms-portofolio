"use client";
import { useActionState } from "react";
import { publishAll, type ActionState } from "@/lib/actions/projects";
import { SubmitButton } from "@/components/admin/ui";
const initial: ActionState = {};
export function PublishButton() {
    const [state, formAction] = useActionState(publishAll, initial);
    return (<form action={formAction} className="flex flex-col items-start gap-1">
      <SubmitButton pending="Memuat ulang situs…">Publish</SubmitButton>
      {state.error && (<p role="alert" className="text-xs" style={{ color: "#ff4d4d" }}>
          {state.error}
        </p>)}
    </form>);
}
