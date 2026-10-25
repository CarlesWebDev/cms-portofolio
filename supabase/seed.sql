

insert into public.now_status (id, coding, learning, listening)
values (1, 'Membangun CMS untuk portofolio ini', 'Next.js dan Supabase', 'Lagi nyari playlist baru')
on conflict (id) do nothing;

insert into public.about (id, headline, body)
values (
  1,
  'Halo, saya Carles Marvin',
  '<p>Web developer yang suka mengubah ide jadi website yang rapi, cepat, dan enak dipakai — dari landing page sampai aplikasi web lengkap.</p>'
)
on conflict (id) do nothing;

insert into public.contact (id, section_title, email, copy_button_label)
values (1, 'Ada ide? Ceritain aja.', 'halo@carlesmarvin.dev', 'Salin email')
on conflict (id) do nothing;

insert into public.site_settings (
  id, site_title, meta_description, hero_greeting, hero_label, hero_cta_text, hero_cta_link, footer_text
)
values (
  1,
  'Carles Marvin — Web Developer',
  'Portofolio Carles Marvin, web developer. Projek, prestasi, dan apa yang sedang dikerjakan.',
  'Halo, saya Carles Marvin',
  'Carles Marvin · Web Developer · Indonesia',
  'Ngobrol yuk',
  '#kontak',
  'Dibuat dengan sepenuh hati di Indonesia.'
)
on conflict (id) do nothing;

insert into public.social_links (platform, url, visible, sort_order) values
  ('github',    'https://github.com/CarlesWebDev', true, 1),
  ('linkedin',  'https://www.linkedin.com/',       true, 2),
  ('instagram', 'https://www.instagram.com/',      true, 3),
  ('whatsapp',  'https://wa.me/',                  true, 4)
on conflict do nothing;

insert into public.projects
  (title, slug, category, year, status, summary, live_url, repo_url, tech_stack, cs_problem, cs_role, cs_result, sort_order)
values
  ('Corelev Digital','corelev-digital','Website Agensi',2025,'published',
   'Agensi butuh website utama yang bisa nyambung langsung dengan calon klien tanpa bikin mereka repot.',
   'https://www.corelevdigital.web.id/', null, array['Next.js','Tailwind CSS'],
   'Agensi butuh website utama yang bisa nyambung langsung dengan calon klien tanpa bikin mereka repot.',
   'Saya desain halamannya, pasang live chat, dan tombol WhatsApp yang jalan mulus di HP Android.',
   'Website agensi live dengan live chat aktif dan tombol WhatsApp yang bisa diklik langsung dari HP Android — calon klien nyambung tanpa lewat form panjang.', 1),

  ('Kaspro','kaspro','Tools Internal',2025,'published',
   'Mencatat pengeluaran dari struk fisik itu ribet: struk hilang, angka lupa, catatan nggak konsisten.',
   null, null, array['Next.js','TypeScript'],
   'Mencatat pengeluaran dari struk fisik itu ribet: struk hilang, angka lupa, catatan nggak konsisten.',
   'Saya bikin tools internal: scan struk pakai OCR jadi data transaksi otomatis, lengkap dengan dashboard, riwayat, dan login JWT.',
   'Satu foto struk langsung jadi baris data transaksi — kategori, nominal, tanggal — tanpa diketik manual. Dashboard dan riwayat bisa dibuka rapi dari HP.', 2),

  ('Coffee Shop Templates','coffee-shop-templates','Template',2024,'published',
   'Kedai kopi kecil butuh landing page yang bagus tapi nggak punya developer dan nggak mau ribet dengan build step.',
   null, null, array['HTML','Tailwind CDN','JavaScript'],
   'Kedai kopi kecil butuh landing page yang bagus tapi nggak punya developer dan nggak mau ribet dengan build step.',
   'Saya bikin beberapa template landing page kedai kopi dalam satu file, dengan animasi SVG dan efek scroll.',
   'Beberapa landing page kedai kopi siap pakai dalam satu file — dibuka langsung jalan di browser, animasi SVG dan efek scroll ikut tanpa install apa pun.', 3),

  ('EduSavings','edusavings','Web Application',2025,'published',
   'Pencatatan tabungan siswa masih manual dan nggak ada rekap statistik yang gampang dibaca.',
   null, 'https://github.com/CarlesWebDev/Tabungan', array['Laravel 11','Node.js','MySQL'],
   'Pencatatan tabungan siswa masih manual dan nggak ada rekap statistik yang gampang dibaca.',
   'Saya bangun platform pengelolaan tabungan siswa dengan pencatatan transaksi real-time dan dashboard statistik.',
   'Setiap transaksi tabungan tercatat saat itu juga, dan pihak sekolah bisa lihat rekap statistiknya tanpa hitung manual.', 4),

  ('Bloggers App','bloggers-app','Web Platform',2025,'published',
   'Proses bikin dan mengelola artikel blog butuh satu tempat yang sederhana dan langsung jalan.',
   null, 'https://gitlab.com/oo5832246/blogger', array['Laravel 11','Bootstrap','MySQL'],
   'Proses bikin dan mengelola artikel blog butuh satu tempat yang sederhana dan langsung jalan.',
   'Saya bangun aplikasi web lengkap untuk membuat, membaca, mengedit, dan menghapus artikel secara interaktif.',
   'Artikel bisa dibuat, diedit, dan dihapus penuh dari satu aplikasi — kode sumbernya bisa dilihat publik di GitLab.', 5),

  ('STI','sti','Corporate Website',2025,'published',
   'Perusahaan sistem integrasi butuh website yang bisa menjelaskan layanannya dengan jelas ke calon klien.',
   null, null, array['React (TSX)','TailwindCSS','SpringBoot'],
   'Perusahaan sistem integrasi butuh website yang bisa menjelaskan layanannya dengan jelas ke calon klien.',
   'Saya bangun website perusahaan penyedia solusi sistem integrasi dan layanan digital untuk transformasi bisnis.',
   'Website perusahaan dengan halaman layanan yang menjelaskan tiap solusi secara konkret — dari integrasi sistem sampai transformasi digital.', 6),

  ('AAP','aap','Business Solution',2025,'published',
   'Bisnis butuh satu sistem terpadu untuk pembayaran digital dan komunikasi pelanggannya.',
   null, null, array['React (TSX)','TailwindCSS','SpringBoot'],
   'Bisnis butuh satu sistem terpadu untuk pembayaran digital dan komunikasi pelanggannya.',
   'Saya kembangkan solusi pembayaran digital, layanan komunikasi mobile, dan pengembangan sistem bisnis terintegrasi.',
   'Pembayaran digital dan layanan komunikasi pelanggan berjalan dari satu sistem yang sama, bukan tersebar di beberapa tools.', 7),

  ('TIM','tim','Fintech Platform',2025,'published',
   'Lembaga keuangan butuh proses pinjaman yang terpadu dan terlacak dari awal sampai akhir.',
   null, null, array['React (TSX)','TailwindCSS','Zustand'],
   'Lembaga keuangan butuh proses pinjaman yang terpadu dan terlacak dari awal sampai akhir.',
   'Saya bangun platform teknologi finansial dengan sistem terpadu proses pinjaman bagi lembaga keuangan.',
   'Alur pinjaman — dari pengajuan sampai pencairan — terlacak dalam satu platform, jadi tidak ada tahap yang hilang di tengah jalan.', 8),

  ('Sales App','sales-app','Mobile App',2025,'published',
   'Tim penjualan butuh cara memantau prospek dan aktivitas tanpa laporan manual yang lewat.',
   null, null, array['React Native','Expo','SpringBoot'],
   'Tim penjualan butuh cara memantau prospek dan aktivitas tanpa laporan manual yang lewat.',
   'Saya buat aplikasi mobile untuk tim penjualan mengelola prospek dan melacak aktivitas secara real-time.',
   'Tim penjualan update prospek dan aktivitas langsung dari HP, jadi laporan tidak lagi numpuk di akhir minggu.', 9),

  ('SIPASAR','sipasar','Management System',2025,'published',
   'Keluhan sarana prasarana sekolah masuk lewat banyak jalur, jadi susah ditindaklanjuti petugas.',
   null, 'https://github.com/CarlesWebDev/UKK', array['Laravel 11','Alpine.js','TailwindCSS'],
   'Keluhan sarana prasarana sekolah masuk lewat banyak jalur, jadi susah ditindaklanjuti petugas.',
   'Saya bangun platform pengaduan sarana prasarana sekolah untuk membantu petugas mengelola keluhan secara efisien.',
   'Semua keluhan masuk ke satu antrean terpusat dengan status jelas dan petugas tahu mana yang belum ditangani.', 10)
on conflict (slug) do nothing;

insert into public.achievements (title, issuer, year, status, sort_order) values
  ('Kelas Industri Batch 1','WellMagic',2024,'published',1),
  ('Sertifikat Penyelesaian IoT','Cisco',2026,'published',2),
  ('AI Productivity & AI API Integration for Developer','Hacktiv8',2026,'published',3)
on conflict do nothing;
