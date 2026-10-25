import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NowStatus } from "@/lib/types";
import { NowForm } from "./NowForm";
import { SetupNotice } from "@/components/admin/SetupNotice";
export const metadata = { title: "Sekarang — CMS Portofolio" };
export default async function NowPage() {
    await connection();
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        return <SetupNotice />;
    const { data } = await supabase.from("now_status").select("*").eq("id", 1).single();
    return <NowForm now={data as NowStatus | undefined}/>;
}
