# Atiga Prompter

> **Susun prompt yang bagus, untuk AI apa pun — tanpa perlu hafal rumus prompt.**

Atiga Prompter adalah aplikasi web untuk **menghasilkan prompt siap pakai** yang kemudian dijalankan di AI mana pun: ChatGPT, Claude, Gemini, DeepSeek, Qwen, Copilot, Grok, Meta AI, atau AI lain (format Universal).

🌐 **Alamat:** https://prompter.aantriono.com
📦 **Repositori:** https://github.com/aantriono82/prompter

---

## Cara Pakai (3 langkah)

1. **Pilih template** — mulai dari pertanyaan "Mau membuat apa?": ada 8 kategori dan 21 template.
2. **Isi kolomnya** — pilih Mode **Cepat** (kolom inti) atau **Detail** (semua kolom), lalu pilih **target AI** agar format prompt menyesuaikan dengan AI tujuan.
3. **Pratinjau → salin / kirim** — pratinjau berubah langsung saat mengetik dan boleh diedit manual. Tekan **Salin Prompt**, atau **Kirim ke AI** agar prompt tersalin dan situs AI terbuka di tab baru (khusus ChatGPT, prompt terisi otomatis bila tidak terlalu panjang).

Prompt bisa disimpan ke **Pustaka Saya**, diunduh sebagai `.txt` / `.md`, dan pustaka bisa diekspor–impor sebagai `.json` untuk pindah perangkat. Berkas pustaka memakai format berversi agar perubahan struktur data dapat ditangani dengan aman; format array lama tetap bisa diimpor.

## Kategori & Template (8 kategori, 21 template)

| Kategori | Template |
|---|---|
| 🌐 Blog / Website | Artikel Blog · Halaman Penjualan (Landing Page) · Website Satu Halaman |
| 🎓 MPI | MPI Lengkap · Simulasi Interaktif — *khusus jenjang SMP (Kelas VII–IX, Fase D), semua mata pelajaran* |
| 🎮 Game | Game Edukasi · Kuis Interaktif |
| 🛠️ Aplikasi / Tools | Aplikasi Web · Kalkulator / Alat Hitung · Dasbor Data |
| 📚 Materi Ajar & Soal | Modul Ajar / RPP · LKPD · Bank Soal · Slide Presentasi |
| ✍️ Tulisan & Konten | Artikel / Esai / Refleksi · Cerita / Cerpen · Konten Media Sosial & Naskah Video |
| 🎨 Gambar & Desain | Prompt Gambar AI · Logo & Identitas Visual · Infografis |
| 🧩 Prompt Bebas | Prompt Bebas Universal |

Catatan khusus:

- **Template Modul Ajar / RPP** mengikuti *Perencanaan Pembelajaran Mendalam* dalam **Panduan Mata Pelajaran Final Fase A–F (BSKAP Kemendikdasmen, 2025)**: Identifikasi → Desain Pembelajaran → Pengalaman Belajar (Memahami → Mengaplikasi → Merefleksi) → Asesmen Pembelajaran (awal, proses, akhir), dengan CP mengacu pada **Keputusan Kepala BSKAP No. 046/H/KR/2025**.
- **Template Prompt Gambar AI** memiliki kolom *Bahasa prompt gambar* — bawaan **Inggris** (alat gambar umumnya paling paham istilah gaya berbahasa Inggris, dan hasil Inggris selalu disertai terjemahan Bahasa Indonesia di bawahnya), dapat diganti ke Bahasa Indonesia.

## Format Prompt per Target AI

Isi prompt selalu dibangun dari 6 blok yang sama — **Peran → Konteks → Tugas → Spesifikasi → Aturan Wajib → Format Hasil** — tetapi pembungkusnya menyesuaikan target:

| Target | Gaya pembungkus |
|---|---|
| Universal | Markdown polos (`## PERAN`, dst.) — aman untuk AI apa pun |
| ChatGPT | Markdown + aturan bernomor + perintah langkah demi langkah |
| Claude | Tag XML (`<peran>`, `<tugas>`, `<spesifikasi>`, …) |
| Gemini | Judul tebal; spesifikasi panjang menjadi tabel |
| DeepSeek | Instruksi langsung & teknis, penalaran langkah demi langkah |
| Qwen | Markdown rapi |
| Copilot | Ringkas-padat dalam paragraf berlabel |
| Grok | Markdown + ruang untuk usulan variasi kreatif |
| Meta AI | Format percakapan terstruktur, daftar bernomor |

## Privasi

Atiga Prompter berjalan **100% di peramban pengguna**. Tidak ada server, tidak ada akun, tidak ada API key, dan tidak ada data yang dikirim ke mana pun. Isian formulir (draf), Pustaka, dan pilihan tema disimpan hanya di `localStorage` perangkat masing-masing pengguna.

## Teknologi

- HTML + CSS + JavaScript murni (vanilla) — tanpa framework, tanpa proses build, tanpa CDN.
- Berkas utama: `index.html`, `style.css`, `script.js`, `prompt-engine.js`, `storage.js`, dan `README.md`.
- Responsif: HP (±360px), tablet, laptop, dan IFP / TV layar besar. Mode gelap & terang.
- Setelah halaman termuat, aplikasi bisa dipakai tanpa internet (kecuali tombol Kirim ke AI).
- Validasi impor pustaka, batas ukuran berkas 2 MB, maksimal 500 item, dan sanitasi data sebelum ditampilkan.
- Data lokal memiliki penanda versi dan dinormalisasi saat aplikasi menemukan format lama.
- `_headers` menambahkan security headers saat deployment di Cloudflare Pages.

Pemeriksaan lokal tersedia tanpa dependensi tambahan:

```bash
npm run check
```

## Menjalankan Secara Lokal

Unduh / klon repositori ini, lalu buka `index.html` di peramban — atau sajikan dengan server statis apa pun, misalnya:

```bash
npx serve .
# atau
python3 -m http.server 8000
```

## Deploy (GitHub → Cloudflare Pages)

1. Buat repositori GitHub bernama **`prompter`** (publik).
2. Unggah seluruh berkas project ke akar repositori, termasuk `prompt-engine.js`, `storage.js`, `_headers`, dan workflow CI.
3. Di [Cloudflare Pages](https://pages.cloudflare.com): **Create application → Pages → Connect to Git** → pilih repositori `prompter`.
4. Pengaturan build:
   - **Framework preset:** None
   - **Build command:** *(kosong)*
   - **Build output directory:** `/` (akar)
5. **Save and Deploy** — alamat sementara berbentuk `prompter.pages.dev`.
6. Domain khusus: di proyek Pages → **Custom domains → Set up a custom domain** → isi **`prompter.aantriono.com`**. Karena domain `aantriono.com` dikelola Cloudflare, catatan DNS dan sertifikat HTTPS dibuat otomatis. Alamat akhir: **https://prompter.aantriono.com**
7. Setiap *push* berikutnya ke cabang `main` akan ter-deploy otomatis.

## Menambah Template Baru

Seluruh logika berbasis data. Untuk menambah template, tambahkan satu objek ke array `TEMPLATE` di `script.js`:

- `id` unik, `kategori` (id kategori yang sudah ada), `ikon`, `nama`, `deskripsi`
- `peran` — kalimat peran untuk AI; `tugas` — kalimat perintah utama
- `konteks` (opsional) — array kalimat dengan penanda `{idKolom}`; kalimat hanya dipakai bila semua kolomnya terisi
- `fields` — daftar kolom. Setiap kolom: `i` (id), `l` (label), `j` (jenis: `teks`/`area`/`pilih`/`centang`/`angka`), `m` (`C` = Mode Cepat & Detail, `D` = Mode Detail saja), `w` (wajib), `o` (pilihan), `c` (contoh untuk tombol Isi Contoh), `ph` (placeholder), `h` (petunjuk), `g` (nama grup), `aturan: true` (masuk blok Aturan Wajib, bukan Spesifikasi)
- `aturan` — array aturan tambahan yang selalu masuk ke prompt
- `format` — array ketentuan format hasil

Tidak perlu mengubah kode tampilan sama sekali.

## Lisensi & Kredit

Dibuat oleh **Aan Triono** (keluarga aplikasi Atiga). Silakan dipakai dan dibagikan untuk keperluan pribadi dan pendidikan; cantumkan sumber "Atiga Prompter — prompter.aantriono.com" bila membagikan ulang hasil modifikasi.

*Hasil akhir dari prompt tetap ditentukan oleh AI yang dipakai — selalu periksa kembali keluaran AI sebelum digunakan.*
