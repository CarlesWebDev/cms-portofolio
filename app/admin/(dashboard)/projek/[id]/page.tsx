import { connection } from "next/server";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { ProjectForm } from "../ProjectForm";
import { SetupNotice } from "@/components/admin/SetupNotice";
export const metadata = { title: "Ubah projek — CMS Portofolio" };
export default async function EditProjectPage({ params, }: PageProps<"/admin/projek/[id]">) {
    await connection();
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        return <SetupNotice />;
    const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
    if (!data)
        notFound();
    let thumbnailUrl: string | null = null;
    if (data.thumbnail_id) {
        const { data: media } = await supabase
            .from("media")
            .select("url")
            .eq("id", data.thumbnail_id)
            .single();
        thumbnailUrl = media?.url ?? null;
    }
    return <ProjectForm project={data as Project} thumbnailUrl={thumbnailUrl}/>;
}
