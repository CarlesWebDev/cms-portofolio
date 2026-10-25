import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Contact, SocialLink } from "@/lib/types";
import { ContactForm } from "./ContactForm";
export const metadata = { title: "Kontak — CMS Portofolio" };
export default async function KontakPage() {
    await connection();
    const supabase = await createSupabaseServerClient();
    if (!supabase)
        return null;
    const [{ data: contact }, { data: socials }] = await Promise.all([
        supabase.from("contact").select("*").eq("id", 1).single(),
        supabase.from("social_links").select("*").order("sort_order"),
    ]);
    return (<ContactForm contact={contact as Contact | undefined} socials={(socials ?? []) as SocialLink[]}/>);
}
