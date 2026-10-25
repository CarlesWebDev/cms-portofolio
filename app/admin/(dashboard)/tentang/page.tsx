import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { About } from "@/lib/types";
import { AboutForm } from "./AboutForm";
export const metadata = { title: "Tentang — CMS Portofolio" };
export default async function TentangPage() {
    await connection();
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        return null;
    const { data } = await supabase.from("about").select("*").eq("id", 1).single();
    let photoUrl: string | null = null;
    if (data?.photo_id) {
        const { data: media } = await supabase
            .from("media")
            .select("url")
            .eq("id", data.photo_id)
            .single();
        photoUrl = media?.url ?? null;
    }
    return <AboutForm about={data as About | undefined} photoUrl={photoUrl}/>;
}
