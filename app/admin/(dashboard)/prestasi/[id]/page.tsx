import { connection } from "next/server";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Achievement } from "@/lib/types";
import { AchievementForm } from "../AchievementForm";
import { SetupNotice } from "@/components/admin/SetupNotice";
export const metadata = { title: "Ubah prestasi — CMS Portofolio" };
export default async function EditAchievementPage({ params, }: PageProps<"/admin/prestasi/[id]">) {
    await connection();
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        return <SetupNotice />;
    const { data } = await supabase
        .from("achievements")
        .select("*")
        .eq("id", id)
        .single();
    if (!data)
        notFound();
    let imageUrl: string | null = null;
    if (data.image_id) {
        const { data: media } = await supabase
            .from("media")
            .select("url")
            .eq("id", data.image_id)
            .single();
        imageUrl = media?.url ?? null;
    }
    return <AchievementForm achievement={data as Achievement} imageUrl={imageUrl}/>;
}
