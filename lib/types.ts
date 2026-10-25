export type Project = {
    id: string;
    title: string;
    slug: string;
    category: string | null;
    year: number | null;
    status: "draft" | "published";
    thumbnail_id: string | null;
    summary: string | null;
    live_url: string | null;
    repo_url: string | null;
    tech_stack: string[] | null;
    cs_problem: string | null;
    cs_solution: string | null;
    cs_role: string | null;
    cs_result: string | null;
    gallery: string[] | null;
    sort_order: number;
};
export type Achievement = {
    id: string;
    title: string;
    issuer: string | null;
    year: number | null;
    credential_url: string | null;
    image_id: string | null;
    status: "draft" | "published";
    sort_order: number;
};
export type NowStatus = {
    id: number;
    coding: string | null;
    learning: string | null;
    listening: string | null;
    updated_at: string;
};
export type ActivityLog = {
    id: string;
    entity: string;
    entity_id: string | null;
    action: "create" | "update" | "delete";
    summary: string;
    created_at: string;
};
export type PublishLog = {
    id: string;
    status: "success" | "failed";
    message: string | null;
    triggered_at: string;
};
export type Media = {
    id: string;
    storage_path: string;
    url: string;
    filename: string;
    size_bytes: number | null;
    width: number | null;
    height: number | null;
    mime_type: string | null;
    created_at: string;
};
export type About = {
    id: number;
    headline: string | null;
    body: string | null;
    photo_id: string | null;
};
export type SocialLink = {
    id: string;
    platform: "github" | "linkedin" | "instagram" | "whatsapp";
    url: string;
    visible: boolean;
    sort_order: number;
};
export type Contact = {
    id: number;
    section_title: string | null;
    email: string | null;
    copy_button_label: string | null;
};
export type SiteSettings = {
    id: number;
    site_title: string | null;
    meta_description: string | null;
    favicon_id: string | null;
    og_image_id: string | null;
    hero_greeting: string | null;
    hero_label: string | null;
    hero_cta_text: string | null;
    hero_cta_link: string | null;
    footer_text: string | null;
};
