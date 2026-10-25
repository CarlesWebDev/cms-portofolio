import { z } from "zod";
const optionalUrl = z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https?:\/\/.+\..+/.test(v), {
    message: "URL harus diawali http:// atau https://",
})
    .optional()
    .transform((v) => (v ? v : null));
export const projectSchema = z.object({
    title: z.string().trim().min(1, "Judul wajib diisi").max(200),
    slug: z
        .string()
        .trim()
        .min(1, "Slug wajib diisi")
        .max(200)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung"),
    category: z.string().trim().max(100).optional().default(""),
    year: z
        .string()
        .trim()
        .optional()
        .default("")
        .refine((v) => v === "" || /^\d{4}$/.test(v), "Tahun harus 4 angka")
        .transform((v) => (v ? Number(v) : null)),
    status: z.enum(["draft", "published"]),
    summary: z.string().trim().max(1000).optional().default(""),
    live_url: optionalUrl,
    repo_url: optionalUrl,
    tech_stack: z.string().trim().optional().default(""),
    cs_problem: z.string().trim().max(2000).optional().default(""),
    cs_role: z.string().trim().max(2000).optional().default(""),
    cs_result: z.string().trim().max(2000).optional().default(""),
});
export type ProjectInput = z.infer<typeof projectSchema>;
export const achievementSchema = z.object({
    title: z.string().trim().min(1, "Judul wajib diisi").max(200),
    issuer: z.string().trim().max(200).optional().default(""),
    year: z
        .string()
        .trim()
        .optional()
        .default("")
        .refine((v) => v === "" || /^\d{4}$/.test(v), "Tahun harus 4 angka")
        .transform((v) => (v ? Number(v) : null)),
    credential_url: optionalUrl,
    status: z.enum(["draft", "published"]),
});
export type AchievementInput = z.infer<typeof achievementSchema>;
export const nowSchema = z.object({
    coding: z.string().trim().max(200).optional().default(""),
    learning: z.string().trim().max(200).optional().default(""),
    listening: z.string().trim().max(200).optional().default(""),
});
export const aboutSchema = z.object({
    headline: z.string().trim().max(200).optional().default(""),
    body: z.string().max(20000).optional().default(""),
});
export const contactSchema = z.object({
    section_title: z.string().trim().max(200).optional().default(""),
    email: z.string().trim().max(200).refine((v) => v === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), {
        message: "Format email tidak valid",
    }),
    copy_button_label: z.string().trim().max(100).optional().default(""),
});
export const siteSettingsSchema = z.object({
    site_title: z.string().trim().max(120).optional().default(""),
    meta_description: z.string().trim().max(300).optional().default(""),
    hero_greeting: z.string().trim().max(200).optional().default(""),
    hero_label: z.string().trim().max(100).optional().default(""),
    hero_cta_text: z.string().trim().max(100).optional().default(""),
    hero_cta_link: z
        .string()
        .trim()
        .max(500)
        .optional()
        .default("")
        .refine((v) => v === "" ||
        /^https?:\/\/.+\..+/.test(v) ||
        /^[/#][^\s]*$/.test(v), { message: "Isi URL (https://…), anchor (#kontak), atau path (/karya)" }),
    footer_text: z.string().trim().max(300).optional().default(""),
});
export function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 120);
}
export function parseTechStack(raw: string) {
    return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}
