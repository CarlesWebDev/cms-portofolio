# CMS Portofolio

Panel admin di `/admin` untuk mengelola seluruh konten portofolio tanpa ngoding.
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
   URL-nya **tanpa** `/rest/v1/` — hanya domain project. Restart dev server setelah mengisi.

5. **Jalankan CMS**: `npm run dev` → buka `http://localhost:3000/admin/login`.

## Sambungkan portofolio ke CMS

Di folder portofolio (`E:\PORTOFOLIO\Porto\Porto`), `.env.local`:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Portofolio mengambil semua konten published dari Supabase REST (tanpa dependency
tambahan). Kalau env belum diisi atau Supabase tidak terjangkau, portofolio
otomatis memakai data bawaan di kode — situs tidak pernah kosong.

Saat deploy ke Netlify, tambahkan kedua env ini juga di
Site configuration → Environment variables (Vite hanya membaca env saat build).

## Menu di CMS

- **Home** — kartu ringkas (total projek/prestasi/draft), tombol cepat
  *Update Sekarang*, tombol **Publish** (revalidate semua tag + catat ke
  `publish_log`), status publish terakhir, 5 perubahan terakhir.
- **Projek** — daftar dengan search + filter kategori, tambah/ubah/hapus
  (konfirmasi), slug otomatis dari judul, thumbnail (upload atau pilih dari Media),
  deskripsi singkat, link live & repo, tech stack, case study (masalah/peran/hasil).
- **Prestasi** — daftar + search, tambah/ubah/hapus, gambar sertifikat,
  link kredensial, status Draft/Published.
- **Sekarang** — tiga field teks pendek; tanggal update otomatis format Indonesia.
- **Tentang** — headline + paragraf rich text (Tiptap: bold, italic, link inline)
  dengan preview live bergaya portofolio, foto opsional (tampil di kolom kiri
  section Tentang situs publik).
- **Kontak** — judul section, email (tervalidasi), label tombol "Salin email",
  empat sosmed tetap dengan toggle tampil/sembunyi. WhatsApp cukup diisi nomor
  (62…) — link `wa.me/<nomor>` dibuat otomatis saat render.
- **Media** — upload drag-and-drop (banyak file sekaligus), kompres WebP di
  browser (lebar maks 1600px, kualitas 80%), grid dengan nama/ukuran/tanggal dan
  penanda **"Dipakai di: …"**. Hapus diblokir jika gambar masih dipakai, pesannya
  menyebutkan lokasinya.
- **Pengaturan** — identitas situs (judul 60 karakter, meta description 155,
  favicon) dengan penghitung karakter; OG image + preview kartu share (upload
  tanpa kompres); hero (sapaan, label atas, teks & link CTA — boleh `#kontak`,
  `/karya`, atau URL lengkap); teks footer. Simpan → semua tag publik di-revalidate.

Semua aksi berhasil memunculkan toast di pojok layar dan langsung redirect ke
halaman daftar yang sesuai. Tema terang/gelap murni lewat tombol ikon (bulan/matahari),
tersimpan di localStorage — tidak ikut preferensi OS.

## Cara situs publik membaca data

- Projek, prestasi, Sekarang, Tentang, Kontak, Hero, Footer, dan metadata
  (judul, meta description, favicon, OG) dibaca dari Supabase dengan fallback
  ke data hardcoded per bagian.
- Hero/CTA/link internal: CTA menerima anchor (`#kontak`), path (`/karya`),
  atau URL lengkap.
- Rich text Tentang disanitasi (DOMPurify, hanya `p strong em a`) **sebelum
  disimpan**, jadi aman dirender di situs publik.

## Keamanan

- Sesi login via cookie (`@supabase/ssr`); `proxy.ts` menjaga `/admin/*`
  (middleware Next 16). Setiap Server Action tetap memverifikasi `auth.getUser()`.
- RLS aktif di semua tabel: publik hanya membaca baris `published`/`visible`;
  menulis butuh login (pendaftaran publik dimatikan, hanya akun admin).
- Bucket `media`: baca publik, tulis hanya admin, maks ±5 MB, tipe gambar.
- Hanya `NEXT_PUBLIC_*` env yang sampai ke client.

## Catatan teknis

- Tabel satu-baris (`about`, `contact`, `site_settings`, `now_status`) **tidak
  memakai `upsert`** — pola cek-then-update/insert, karena upsert bentrok dengan
  RLS (bisa gagal senyap).
- Setiap simpan konten published memanggil `revalidateTag` per tag
  (`projects`, `achievements`, `now`, `about`, `contact`, `settings`) sehingga
  situs publik segar tanpa deploy ulang. Cache admin memakai `updateTag`
  (read-your-own-writes).
- Area admin dirender on-demand (`export const instant = false` + `await connection()`).
- next.config: `remotePatterns` untuk domain `**.supabase.co` (gambar Storage).
- Belum dikerjakan (PRD Fase 2–3 tersisa): drag-and-drop urutan Projek/Prestasi,
  preview draft sebelum publish, galeri gambar case study.
- Free tier Supabase bisa di-pause jika 7 hari tanpa aktivitas — buka CMS
  sekali seminggu atau pasang uptime ping.
