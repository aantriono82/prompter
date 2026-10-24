# Atiga Prompter

> **Susun prompt yang bagus, untuk AI apa pun — tanpa perlu hafal rumus prompt.**

Atiga Prompter adalah aplikasi web untuk **membantu guru menghasilkan prompt siap pakai** yang kemudian dijalankan di AI mana pun: ChatGPT, Claude, Gemini, DeepSeek, Qwen, Copilot, Grok, Meta AI, atau AI lain (format Universal).

🌐 **Alamat:** https://prompter.aantriono.com
📦 **Repositori:** https://github.com/aantriono82/prompter

---

## Cara Pakai (3 langkah)

1. **Pilih template** — mulai dari pertanyaan "Mau membuat apa?": ada 6 kategori dan 17 template utama.
2. **Isi kolomnya** — pilih Mode **Cepat** (kolom inti) atau **Detail** (semua kolom), lalu pilih **target AI** agar format prompt menyesuaikan dengan AI tujuan.
3. **Pratinjau → salin / kirim** — pratinjau berubah langsung saat mengetik dan boleh diedit manual. Tekan **Salin Prompt**, atau **Kirim ke AI** agar prompt tersalin ke clipboard dan situs AI terbuka di tab baru untuk ditempel manual.

Prompt bisa disimpan ke **Pustaka Saya**, diunduh sebagai `.txt` / `.md`, dan pustaka bisa diekspor–impor sebagai `.json` untuk pindah perangkat. Berkas pustaka memakai format berversi agar perubahan struktur data dapat ditangani dengan aman; format array lama tetap bisa diimpor.

## Kategori & Template (6 kategori, 17 template utama)

| Kategori | Template |
|---|---|
| 📚 Perencanaan & Materi | Modul Ajar / RPP Ringkas · LKPD · Slide Presentasi (.pptx / PDF / HTML) |
| 🧾 Asesmen & Penilaian | Bank Soal · Kuis Interaktif · Rubrik & Penilaian · Rekap Nilai & Analisis Hasil Belajar |
| 🗂️ Administrasi Guru | Absensi & Jurnal Mengajar · Umpan Balik & Laporan Perkembangan |
| 🎓 Media Pembelajaran | MPI Lengkap · Simulasi Interaktif · Game Edukasi — *khusus jenjang SMP (Kelas VII–IX, Fase D), semua mata pelajaran* |
| 🎨 Gambar & Infografis | Gambar AI · Infografis |
| 🧩 Lainnya | Aplikasi Web Bebas · Website Satu Halaman · Prompt Bebas Universal |

Catatan khusus:

- **Template Modul Ajar / RPP Ringkas** mempertahankan empat bagian *Perencanaan Pembelajaran Mendalam*: Identifikasi → Desain Pembelajaran → Pengalaman Belajar (Memahami → Mengaplikasi → Merefleksi) → Asesmen Pembelajaran (awal, proses, akhir). Formulirnya hanya meminta masukan inti; rincian opsional berada di Mode Detail. Acuan CP wajib ditempel dari [Panduan Mata Pelajaran Matematika Fase A–F dan Fase F Tingkat Lanjut (BSKAP, 2025)](https://repositori.kemendikdasmen.go.id/33608/) atau [Lampiran Keputusan Kepala BSKAP No. 046/H/KR/2025](https://kurikulum.kemendikdasmen.go.id/file/1753929861_manage_file.pdf).
- **Template Gambar AI** menghasilkan satu gambar langsung. Kolom *Bahasa teks dalam gambar* menentukan bahasa teks yang terlihat di dalam gambar bila ada.
- **Template Slide Presentasi** meminta AI membuat satu file presentasi yang dapat diunduh. Format defaultnya PowerPoint `.pptx`, dengan pilihan PDF atau HTML slide sebagai alternatif. Jika AI yang dipakai tidak mendukung pembuatan atau lampiran berkas, prompt meminta fallback berupa satu file HTML slide mandiri.

## Format Prompt per Target AI

Isi prompt selalu dibangun dari 6 blok yang sama — **Peran → Konteks → Tugas → Spesifikasi → Aturan Wajib → Format Hasil** — tetapi pembungkusnya menyesuaikan target. Di akhir prompt selalu ada **Daftar Periksa** yang mengulang isian penting (jumlah, bentuk, bagian wajib, bahasa) agar AI mencocokkan hasilnya sebelum menjawab.

| Target | Gaya pembungkus |
|---|---|
| Universal | Markdown polos (`## PERAN`, dst.) — aman untuk AI apa pun |
| ChatGPT | Markdown + aturan bernomor + urutan instruksi yang jelas |
| Claude | Tag XML (`<peran>`, `<tugas>`, `<spesifikasi>`, …) |
| Gemini | Judul tebal; spesifikasi panjang menjadi tabel |
| DeepSeek | Instruksi langsung & teknis yang mengikuti format hasil |
| Qwen | Markdown rapi |
| Copilot | Ringkas-padat dalam paragraf berlabel |
| Grok | Markdown rapi dengan aturan template tetap berlaku |
| Meta AI | Format percakapan terstruktur, daftar bernomor |

## Privasi

Atiga Prompter berjalan **100% di peramban pengguna**. Tidak ada server, akun, atau API key milik aplikasi. Isian formulir (draf), Pustaka, dan pilihan tema disimpan hanya di `localStorage` perangkat masing-masing pengguna. Data baru diteruskan ke layanan AI ketika pengguna memilih **Kirim ke AI** dan menempelkannya di layanan tersebut.

## Teknologi

- HTML + CSS + JavaScript murni (vanilla) — tanpa framework, tanpa proses build, tanpa CDN.
- Berkas utama: `index.html`, `style.css`, `script.js`, `prompt-engine.js`, `prompt-lint.js`, `storage.js`, dan `README.md`.
- Responsif: HP (±360px), tablet, laptop, dan IFP / TV layar besar. Mode gelap & terang.
- Setelah halaman termuat, aplikasi bisa dipakai tanpa internet (kecuali tombol Kirim ke AI).
- Validasi impor pustaka, batas ukuran berkas 2 MB, maksimal 500 item, dan sanitasi data sebelum ditampilkan.
- Data lokal memiliki penanda versi dan dinormalisasi saat aplikasi menemukan format lama.
- Pemeriksaan kualitas memberi peringatan tentang sumber data, placeholder, dan panjang prompt sebelum prompt disalin atau dikirim.
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
