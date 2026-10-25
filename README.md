# CMS Portofolio Carles Marvin

Panel admin di `/admin` untuk mengelola konten portofolio tanpa ngoding.
Next.js 16 (App Router, Cache Components) + Supabase + Tailwind, dengan tipografi
dan palet yang sama persis dengan portofolio.

## Setup sekali jalan

1. **Buat project Supabase** di [supabase.com/dashboard](https://supabase.com/dashboard).

2. **Jalankan SQL** di Supabase → SQL Editor, berurutan:
   - `supabase/migration.sql` — tabel, trigger `updated_at`, RLS, bucket `media`
   - `supabase/seed.sql` — isi awal (10 projek, 3 prestasi, Sekarang, Tentang, Kontak, Pengaturan, sosmed)

3. **Buat akun admin** (hanya satu):
   - Authentication → Providers → Email → **matikan** "Allow new users to sign up"
   - Authentication → Users → **Add user** → isi email & password kamu

4. **Isi `.env.local`** (salin dari `.env.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   ```
   lalu restart dev server.

5. **Jalankan CMS**: `npm run dev` → buka `http://localhost:3000/admin/login`.

## Sambungkan portofolio ke CMS

Di folder portofolio (`E:\PORTOFOLIO\Porto\Porto`), tambahkan `.env.local`:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Portofolio akan mengambil projek, prestasi, dan status "Sekarang" yang
berstatus **published** dari Supabase. Kalau env belum diisi atau Supabase
tidak terjangkau, portofolio otomatis memakai data bawaan di kode.

## Menu yang sudah jadi (Fase 1 — MVP)

- **Login** dengan sesi cookie (`@supabase/ssr`), middleware `proxy.ts` menjaga `/admin/*`
- **Home** — kartu ringkas, tombol cepat Update Sekarang, Publish, 5 perubahan terakhir
- **Projek** — daftar + search + filter kategori, tambah/ubah/hapus (konfirmasi), slug otomatis
- **Prestasi** — daftar + search, tambah/ubah/hapus
- **Sekarang** — tiga field teks pendek, tanggal update otomatis format Indonesia

Menu **Tentang, Kontak, Media, Pengaturan** = Fase 2 (skema DB sudah siap, form menyusul).

## Catatan

- Setiap simpan konten published memanggil `revalidateTag("projects"|"achievements"|"now")`
  sehingga situs publik langsung segar tanpa deploy ulang.
- Keamanan data ada di RLS: publik hanya bisa membaca baris `published`/`visible`;
  menulis butuh login (pendaftaran publik mati, jadi hanya akun admin).
- Publish manual di Home me-revalidate semua tag dan mencatat hasilnya di `publish_log`.
- Urutan projek/prestasi mengikuti kolom `sort_order` (drag-and-drop di Fase 2).
