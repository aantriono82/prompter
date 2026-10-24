/* ============================================================
   ATIGA PROMPTER — script.js
   Generator prompt untuk AI: pilih template → isi variabel →
   pratinjau → salin / kirim ke AI.
   Vanilla JS, tanpa pustaka luar. Seluruh data & logika lokal.

   Struktur berkas:
   1) DATA  : KATEGORI, TARGET_AI, TEMPLATE (17 template utama)
   2) MESIN : susunBlok() + bungkus() — penyusun prompt per target AI
   3) UI    : render & interaksi halaman (hanya berjalan di peramban)

   Cara menambah template: tambahkan satu objek ke TEMPLATE lalu masukkan id-nya ke ID_TEMPLATE_UTAMA.
   Kolom (fields) — singkatan:
     i = id unik kolom          l = label yang tampil
     j = jenis: 'teks' | 'area' | 'pilih' | 'centang' | 'angka'
     m = mode : 'C' tampil di Cepat & Detail, 'D' hanya di Detail
     w = true bila wajib diisi
     o = daftar pilihan (untuk j 'pilih' / 'centang')
     c = nilai contoh untuk tombol "Isi Contoh"
     ph = placeholder            h = petunjuk di bawah kolom
     g = nama grup (field set)   aturan = true bila masuk blok ATURAN
   ============================================================ */
'use strict';

/* ---------------- 1) DATA ---------------- */

const KATEGORI = [
  { id:'materi',       ikon:'📚', nama:'Perencanaan & Materi', deskripsi:'Modul ajar, LKPD, dan slide presentasi' },
  { id:'asesmen',      ikon:'🧾', nama:'Asesmen & Penilaian',   deskripsi:'Bank soal, kuis, rubrik, dan rekap nilai' },
  { id:'administrasi', ikon:'🗂️', nama:'Administrasi Guru',    deskripsi:'Absensi, jurnal, dan laporan perkembangan siswa' },
  { id:'mpi',          ikon:'🎓', nama:'Media Pembelajaran',    deskripsi:'MPI, simulasi, dan game edukasi untuk kelas' },
  { id:'media',        ikon:'🎨', nama:'Gambar & Infografis',   deskripsi:'Visual edukasi untuk materi dan kelas' },
  { id:'umum',         ikon:'🧩', nama:'Lainnya',               deskripsi:'Aplikasi web bebas dan prompt universal' }
];

const TARGET_AI = [
  { id:'universal', nama:'Universal', url:null,                              batasToken:12000, petunjuk:'Format Markdown polos — aman ditempel ke AI apa pun.' },
  { id:'chatgpt',   nama:'ChatGPT',   url:'https://chatgpt.com/',            batasToken:12000, petunjuk:'Markdown dengan aturan bernomor. Prompt disalin ke clipboard sebelum situs dibuka.' },
  { id:'claude',    nama:'Claude',    url:'https://claude.ai/new',           batasToken:16000, petunjuk:'Dibungkus tag XML — paling rapi untuk konteks panjang dan Mode Detail.' },
  { id:'gemini',    nama:'Gemini',    url:'https://gemini.google.com/app',   batasToken:16000, petunjuk:'Judul tebal; spesifikasi yang panjang ditampilkan sebagai tabel.' },
  { id:'deepseek',  nama:'DeepSeek',  url:'https://chat.deepseek.com/',      batasToken:12000, petunjuk:'Instruksi langsung dan teknis, dengan pemeriksaan keluaran internal.' },
  { id:'qwen',      nama:'Qwen',      url:'https://chat.qwen.ai/',           batasToken:12000, petunjuk:'Markdown rapi; aman untuk konteks panjang.' },
  { id:'copilot',   nama:'Copilot',   url:'https://copilot.microsoft.com/',  batasToken:8000,  petunjuk:'Ringkas dan padat — paling cocok dipadukan dengan Mode Cepat.' },
  { id:'grok',      nama:'Grok',      url:'https://grok.com/',               batasToken:12000, petunjuk:'Gaya langsung dengan kontrak keluaran tetap berlaku.' },
  { id:'meta',      nama:'Meta AI',   url:'https://www.meta.ai/',            batasToken:8000,  petunjuk:'Format percakapan terstruktur dengan daftar bernomor.' }
];

const MAPEL_SMP = ['Matematika','IPA','IPS','Bahasa Indonesia','Bahasa Inggris','Bahasa Daerah',
  'Pendidikan Pancasila','Pendidikan Agama dan Budi Pekerti','PJOK','Informatika','Seni Budaya',
  'Prakarya dan Kewirausahaan','Bimbingan Konseling','Muatan Lokal','Lainnya (isi di materi pokok)'];

const DIMENSI_PROFIL = ['Keimanan dan ketakwaan terhadap Tuhan YME','Kewargaan','Penalaran kritis',
  'Kreativitas','Kolaborasi','Kemandirian','Kesehatan','Komunikasi'];

const FITUR_MPI = ['Satu file HTML mandiri, berjalan offline tanpa internet/CDN',
  'Responsif di HP (±360px) dan ramah sentuhan','Mode IFP / layar besar (font & tombol besar)',
  'Diferensiasi 3 tingkat: mudah, sedang, menantang','Progres tersimpan di perangkat (localStorage)',
  'Umpan balik langsung pada setiap jawaban','Skor akhir','Bisa dicetak / disertai LKPD'];

const TEMPLATE = [

/* ---------- Kategori 1: Blog / Website ---------- */
{
  id:'artikel-blog', kategori:'blog', ikon:'📝', nama:'Artikel Blog',
  deskripsi:'Artikel blog yang utuh dan siap terbit, termasuk untuk SEO.',
  peran:'Anda adalah penulis blog berpengalaman yang menulis dalam Bahasa Indonesia yang jernih, mengalir, dan enak dibaca, serta memahami dasar-dasar SEO.',
  tugas:'Tuliskan satu artikel blog yang lengkap dan siap terbit berdasarkan spesifikasi berikut. Keluarkan langsung naskah artikelnya, bukan rencana, analisis, atau penjelasan tentang proses penulisan.',
  konteks:['Artikel ini ditujukan untuk pembaca: {pembaca}.'],
  fields:[
    { i:'judul', l:'Judul / topik artikel', j:'teks', m:'C', w:true, ph:'mis. 7 Cara Menghafal Rumus Matematika Tanpa Stres', c:'7 Cara Menghafal Rumus Matematika Tanpa Stres' },
    { i:'tujuan', l:'Tujuan artikel', j:'pilih', m:'C', w:true, o:['Mengedukasi','Menghibur','Membujuk / menjual','Berbagi pengalaman','Lainnya'], c:'Mengedukasi' },
    { i:'pembaca', l:'Pembaca sasaran', j:'teks', m:'C', w:true, ph:'mis. siswa SMP dan orang tua', c:'siswa SMP dan orang tua' },
    { i:'kataKunci', l:'Kata kunci utama (SEO)', j:'teks', m:'C', ph:'mis. cara menghafal rumus matematika', c:'cara menghafal rumus matematika' },
    { i:'gaya', l:'Gaya bahasa', j:'pilih', m:'C', o:['Santai','Formal','Akademis','Persuasif','Bercerita'], c:'Santai' },
    { i:'panjang', l:'Panjang artikel', j:'pilih', m:'C', o:['Pendek (±500 kata)','Sedang (±1.000 kata)','Panjang (±2.000 kata)','Sangat panjang (3.000+ kata)'], c:'Sedang (±1.000 kata)' },
    { i:'sudutPandang', l:'Sudut pandang & pengalaman pribadi', j:'area', m:'D', ph:'Pengalaman atau kisah nyata yang ingin disisipkan…', c:'Saya guru matematika SMP; sisipkan pengalaman mengajar di kelas VII.' },
    { i:'struktur', l:'Struktur wajib', j:'centang', m:'D', o:['Pembuka yang kuat','Subjudul yang teratur','Contoh nyata','Penutup','Ajakan bertindak (CTA)'], c:['Pembuka yang kuat','Subjudul yang teratur','Penutup'] },
    { i:'hindari', l:'Hal yang harus dihindari', j:'area', m:'D', ph:'mis. bahasa terlalu teknis, klaim tanpa dasar…', c:'Hindari istilah teknis tanpa penjelasan.' },
    { i:'sumber', l:'Fakta / sumber yang harus dimasukkan', j:'area', m:'D', ph:'Satu baris satu fakta atau sumber…', c:'Penelitian menunjukkan pengulangan berjarak (spaced repetition) memperkuat ingatan.' }
  ],
  aturan:[
    'Keluarkan hanya naskah yang siap dipublikasikan; jangan menulis analisis, outline, atau komentar di luar artikel.',
    'Gunakan urutan: Judul, meta description bila kata kunci tersedia, pembuka, isi dengan subjudul H2/H3, lalu penutup.',
    'Sisipkan kata kunci utama secara alami di judul, paragraf pertama, dan minimal satu subjudul tanpa pengulangan yang terasa dipaksakan.',
    'Gunakan paragraf pendek, contoh konkret, dan transisi yang jelas sesuai pembaca sasaran.',
    'Gunakan hanya fakta atau sumber yang diberikan. Jika sumber tidak tersedia, jangan membuat nama penelitian, angka, atau kutipan palsu.'
  ],
  format:['Markdown siap terbit dengan struktur: # Judul, Meta description, pembuka, ## subjudul, isi, dan penutup. Panjang mengikuti pilihan Panjang artikel.']
},
{
  id:'landing-page', kategori:'blog', ikon:'🛒', nama:'Halaman Penjualan (Landing Page)',
  deskripsi:'Halaman satu layar yang meyakinkan pengunjung untuk bertindak.',
  peran:'Anda adalah copywriter halaman penjualan (landing page) berpengalaman yang menulis dalam Bahasa Indonesia yang meyakinkan tanpa berlebihan.',
  tugas:'Buatlah naskah lengkap satu halaman penjualan (landing page) berdasarkan spesifikasi berikut. Hasil harus berupa copy siap ditempatkan ke halaman web, bukan teori pemasaran atau analisis.',
  fields:[
    { i:'produk', l:'Produk / jasa yang ditawarkan', j:'teks', m:'C', w:true, ph:'mis. Kursus Matematika Online untuk SMP', c:'Kursus Matematika Online untuk SMP' },
    { i:'pembeli', l:'Target pembeli', j:'teks', m:'C', w:true, ph:'mis. orang tua siswa SMP kelas VII–IX', c:'orang tua siswa SMP kelas VII–IX' },
    { i:'keunggulan', l:'Keunggulan utama', j:'area', m:'C', w:true, ph:'Satu baris satu keunggulan…', c:'Pengajar berpengalaman 10 tahun\nLatihan soal bertingkat\nLaporan perkembangan tiap bulan' },
    { i:'harga', l:'Harga & penawaran khusus', j:'teks', m:'C', ph:'mis. Rp150.000/bulan, diskon 50% bulan ini', c:'Rp150.000/bulan, gratis coba 1 minggu' },
    { i:'cta', l:'Ajakan bertindak (CTA)', j:'teks', m:'C', w:true, ph:'mis. Daftar via WhatsApp', c:'Daftar via WhatsApp' },
    { i:'testimoni', l:'Bukti sosial / testimoni', j:'area', m:'D', ph:'Tempel testimoni nyata bila ada…', c:'"Nilai anak saya naik dari 65 menjadi 88 dalam satu semester." — Ibu Rina, Surabaya' },
    { i:'gayaTulis', l:'Gaya penulisan', j:'pilih', m:'D', o:['Meyakinkan','Premium','Ramah','Mendesak'], c:'Meyakinkan' },
    { i:'jaminan', l:'Jaminan / garansi', j:'teks', m:'D', ph:'mis. garansi uang kembali 14 hari', c:'Garansi uang kembali 14 hari' }
  ],
  aturan:[
    'Keluarkan hanya naskah landing page; jangan menyertakan analisis strategi, kode HTML, atau catatan proses.',
    'Susun bagian dalam urutan: Hero, masalah atau kebutuhan, manfaat utama, cara kerja, bukti sosial bila tersedia, harga atau penawaran, jaminan bila tersedia, lalu CTA akhir.',
    'Jangan membuat klaim, angka, diskon, testimoni, atau jaminan yang tidak diberikan pengguna.',
    'Gunakan keunggulan yang diberikan sebagai manfaat yang mudah dipahami target pembeli, tanpa janji berlebihan.',
    'CTA utama harus sama dengan ajakan bertindak yang diberikan dan tampil di Hero serta bagian akhir.'
  ],
  format:['Markdown siap salin dengan heading per bagian. Untuk setiap bagian tulis hanya Headline, Subheadline bila perlu, Body copy, dan CTA atau teks tombol bila relevan. Jangan menambahkan tujuan bagian, analisis strategi, atau catatan proses.']
},
{
  id:'website-satu-halaman', kategori:'umum', ikon:'🌐', nama:'Website Satu Halaman',
  deskripsi:'Prompt untuk membuat website satu halaman utuh (profil, portofolio, usaha, acara).',
  peran:'Anda adalah pengembang web front-end berpengalaman yang membuat website satu halaman yang modern, responsif, dan siap pakai dalam satu file HTML (CSS & JS di dalam file yang sama bila tidak diminta lain).',
  tugas:'Buatlah website satu halaman yang lengkap dan siap jalan berdasarkan spesifikasi berikut. Hasil akhir harus berupa satu berkas HTML yang bisa langsung dibuka di peramban.',
  konteks:['Website ini bertema: {tema}.'],
  fields:[
    { i:'jenis', l:'Jenis website', j:'pilih', m:'C', w:true, o:['Profil pribadi','Portofolio','Profil usaha','Acara','Komunitas'], c:'Profil usaha' },
    { i:'nama', l:'Nama / merek', j:'teks', m:'C', w:true, ph:'mis. Les Privat Atiga', c:'Les Privat Atiga' },
    { i:'bagian', l:'Bagian halaman', j:'centang', m:'C', w:true, o:['Hero (pembuka)','Tentang','Layanan / fitur','Galeri','Testimoni','Harga','Tanya-jawab (FAQ)','Kontak'], c:['Hero (pembuka)','Tentang','Layanan / fitur','Harga','Kontak'] },
    { i:'tema', l:'Tema & suasana', j:'teks', m:'C', w:true, ph:'mis. tenang, minimalis, terpercaya', c:'tenang, minimalis, terpercaya' },
    { i:'warna', l:'Warna utama', j:'teks', m:'D', ph:'mis. indigo dan amber', c:'indigo dan amber' },
    { i:'teksUtama', l:'Teks utama yang harus tampil', j:'area', m:'D', ph:'Judul besar, slogan, atau teks penting lain…', c:'Belajar Matematika Jadi Menyenangkan' },
    { i:'fitur', l:'Fitur interaktif', j:'centang', m:'D', o:['Formulir kontak','Tombol WhatsApp melayang','Peta lokasi','Mode gelap','Animasi halus'], c:['Tombol WhatsApp melayang','Mode gelap'] }
  ],
  aturan:[
    'Gunakan hanya bagian halaman dan fitur yang dipilih pengguna; jangan menambahkan bagian utama yang tidak diminta.',
    'Kode harus lengkap dan langsung bisa dibuka di peramban, bukan potongan atau pseudocode.',
    'Letakkan HTML, CSS, dan JavaScript dalam satu file HTML tanpa CDN atau dependensi eksternal kecuali diminta pengguna.',
    'Semua tombol dan fitur interaktif yang ditampilkan harus benar-benar berfungsi.',
    'Responsif di HP sekitar 360px, tablet, laptop, dan layar besar; utamakan aksesibilitas keyboard dan kontras yang jelas.',
    'Jangan membuat data, testimoni, alamat, atau klaim bisnis yang tidak diberikan; gunakan placeholder yang jelas bila diperlukan.',
    'Komentar kode dan seluruh teks antarmuka dalam Bahasa Indonesia.'
  ],
  format:['Keluarkan tepat satu blok kode HTML lengkap yang dapat langsung disimpan sebagai index.html. Jangan menambahkan ringkasan atau penjelasan di luar blok kode.']
},

/* ---------- Kategori 2: MPI (khusus SMP, semua mata pelajaran) ---------- */
{
  id:'mpi-lengkap', kategori:'mpi', ikon:'🎓', nama:'MPI Lengkap',
  deskripsi:'Media Pembelajaran Interaktif lengkap untuk SMP (Kelas VII–IX, Fase D), semua mata pelajaran.',
  peran:'Anda adalah pengembang media pembelajaran interaktif (MPI) berpengalaman yang menguasai Kurikulum Merdeka, Panduan Mata Pelajaran Kemendikdasmen, dan pembuatan media satu file HTML.',
  tugas:'Buatlah satu media pembelajaran interaktif yang lengkap dan siap dipakai di kelas berdasarkan spesifikasi berikut. Hasil akhir harus berupa media yang benar-benar dapat digunakan, bukan rancangan atau pseudocode.',
  konteks:['Media ini untuk pembelajaran {mapel} kelas {kelas} SMP, materi pokok {materi}.'],
  fields:[
    { i:'namaGuru', l:'Nama guru (opsional)', j:'teks', m:'C', ph:'mis. Aan Triono, S.Pd.', c:'Aan Triono, S.Pd.' },
    { i:'kelas', l:'Kelas (SMP)', j:'pilih', m:'C', w:true, o:['VII','VIII','IX'], c:'VII' },
    { i:'mapel', l:'Mata pelajaran', j:'pilih', m:'C', w:true, o:MAPEL_SMP, c:'IPA' },
    { i:'materi', l:'Materi pokok', j:'teks', m:'C', w:true, ph:'mis. Sistem Pencernaan Manusia', c:'Sistem Pencernaan Manusia' },
    { i:'judulMedia', l:'Judul media', j:'teks', m:'C', ph:'mis. Petualangan di Sistem Pencernaan', c:'Petualangan di Sistem Pencernaan' },
    { i:'tp', l:'Tujuan Pembelajaran (dari CP/ATP)', j:'area', m:'C', w:true, ph:'Satu baris satu tujuan pembelajaran…', c:'Mengidentifikasi organ-organ pencernaan manusia\nMenjelaskan proses pencernaan makanan\nMenganalisis gangguan pada sistem pencernaan' },
    { i:'jenis', l:'Jenis MPI', j:'pilih', m:'C', w:true, o:['Simulasi','Eksplorasi','Tutorial interaktif','Latihan & kuis','Cerita interaktif'], c:'Latihan & kuis' },
    { i:'jumlahBagian', l:'Jumlah bagian / level', j:'angka', m:'C', ph:'mis. 3', c:'3' },
    { i:'fiturWajib', l:'Fitur wajib', j:'centang', m:'C', aturan:true, o:FITUR_MPI, c:['Satu file HTML mandiri, berjalan offline tanpa internet/CDN','Responsif di HP (±360px) dan ramah sentuhan','Diferensiasi 3 tingkat: mudah, sedang, menantang','Progres tersimpan di perangkat (localStorage)','Umpan balik langsung pada setiap jawaban','Skor akhir'] },
    { i:'dimensi', l:'Dimensi Profil Lulusan yang dituju', j:'centang', m:'D', o:DIMENSI_PROFIL, c:['Penalaran kritis','Kemandirian'] },
    { i:'model', l:'Model pembelajaran', j:'pilih', m:'D', o:['Penemuan (discovery)','Berbasis masalah (PBL)','Berbasis proyek (PjBL)','Pembelajaran langsung','Kooperatif'], c:'Penemuan (discovery)' },
    { i:'tema', l:'Tema / narasi', j:'teks', m:'D', ph:'mis. perjalanan makanan di tubuh', c:'perjalanan makanan di dalam tubuh' },
    { i:'maskot', l:'Maskot / pemandu', j:'teks', m:'D', ph:'mis. Si Enzim yang ceria', c:'Si Enzim yang ceria' },
    { i:'gayaVisual', l:'Gaya visual', j:'pilih', m:'D', o:['Datar modern','Kartun ceria','Semi-realistis','Minimalis'], c:'Kartun ceria' },
    { i:'konteksLokal', l:'Konteks lokal', j:'teks', m:'D', ph:'mis. makanan khas daerah, contoh dari lingkungan sekitar', c:'contoh makanan khas daerah setempat' },
    { i:'karakteristik', l:'Karakteristik peserta didik', j:'area', m:'D', ph:'Kemampuan awal, minat, kebutuhan khusus…', c:'Peserta didik kelas VII, kemampuan membaca beragam, menyukai tantangan berlevel.' },
    { i:'waktu', l:'Alokasi waktu', j:'teks', m:'D', ph:'mis. 2 × 40 menit', c:'2 × 40 menit' }
  ],
  aturan:[
    'Tujuan pembelajaran harus menjadi acuan isi media; setiap aktivitas, soal, dan umpan balik harus terkait dengan tujuan tersebut.',
    'Buat alur yang jelas: halaman pembuka, petunjuk, materi atau eksplorasi, aktivitas atau latihan, umpan balik, dan hasil akhir.',
    'Jumlah bagian atau level harus sesuai nilai yang diminta pada kolom Jumlah bagian / level.',
    'Bila Dimensi Profil Lulusan dipilih, wujudkan secara nyata di dalam aktivitas media, bukan hanya disebut.',
    'Semua fitur wajib yang dipilih harus benar-benar berfungsi dan dapat dicoba pengguna.',
    'Gunakan hanya materi dan konteks yang diberikan; jangan mengarang fakta pembelajaran yang spesifik.',
    'Kode harus satu file HTML mandiri tanpa CDN atau dependensi eksternal, berjalan offline, responsif, dan mudah dipakai dengan keyboard serta sentuhan.',
    'Komentar kode dan seluruh teks antarmuka dalam Bahasa Indonesia.'
  ],
  format:['Keluarkan tepat satu blok kode HTML lengkap yang siap disimpan dan dibuka di peramban. Jangan memberikan ringkasan, pseudocode, atau penjelasan di luar blok kode.']
},
{
  id:'simulasi-interaktif', kategori:'mpi', ikon:'🔬', nama:'Simulasi Interaktif',
  deskripsi:'Simulasi pembelajaran SMP yang bisa digeser, diubah, dan dieksplorasi murid.',
  peran:'Anda adalah pengembang simulasi pembelajaran interaktif berpengalaman untuk jenjang SMP yang membuat simulasi satu file HTML.',
  tugas:'Buatlah satu simulasi interaktif yang lengkap dan siap dipakai berdasarkan spesifikasi berikut. Hasil akhir harus berupa simulasi yang dapat langsung dicoba, bukan deskripsi konsep saja.',
  konteks:['Simulasi ini untuk {mapel} kelas {kelas} SMP.'],
  fields:[
    { i:'mapel', l:'Mata pelajaran', j:'pilih', m:'C', w:true, o:MAPEL_SMP, c:'IPA' },
    { i:'kelas', l:'Kelas (SMP)', j:'pilih', m:'C', w:true, o:['VII','VIII','IX'], c:'VIII' },
    { i:'konsep', l:'Materi / konsep yang disimulasikan', j:'teks', m:'C', w:true, ph:'mis. Getaran dan Gelombang', c:'Getaran dan Gelombang' },
    { i:'variabel', l:'Yang bisa digeser / diubah pengguna', j:'area', m:'C', w:true, ph:'Satu baris satu variabel simulasi…', c:'Frekuensi getaran\nAmplitudo\nPanjang tali' },
    { i:'tampilan', l:'Tampilan visual simulasi', j:'area', m:'C', w:true, ph:'Jelaskan apa yang terlihat dan berubah di layar…', c:'Tali bergetar mengikuti frekuensi; grafik gelombang tergambar langsung di bawahnya.' },
    { i:'pertanyaan', l:'Pertanyaan pemandu / tantangan', j:'area', m:'D', ph:'Satu baris satu pertanyaan…', c:'Apa yang terjadi pada gelombang bila frekuensi digandakan?' },
    { i:'miskonsepsi', l:'Miskonsepsi yang harus dideteksi', j:'area', m:'D', ph:'Kesalahan konsep yang umum terjadi…', c:'Murid sering mengira amplitudo memengaruhi cepat rambat gelombang.' },
    { i:'fitur', l:'Fitur wajib', j:'centang', m:'D', aturan:true, o:['Tombol atur ulang (reset)','Petunjuk bertingkat','Mode guru','Satu file HTML mandiri offline','Responsif HP & IFP'], c:['Tombol atur ulang (reset)','Petunjuk bertingkat'] }
  ],
  aturan:[
    'Sediakan kontrol yang jelas untuk setiap variabel yang boleh diubah pengguna dan tampilkan nilai atau satuannya.',
    'Setiap perubahan variabel harus langsung terlihat akibatnya di simulasi dan dijelaskan dengan indikator atau label yang mudah dibaca.',
    'Sediakan tombol reset, petunjuk singkat, dan penjelasan konsep setelah pengguna bereksplorasi.',
    'Jika pertanyaan pemandu diisi, tampilkan pertanyaan tersebut sebagai tugas eksplorasi dan berikan ruang untuk kesimpulan murid.',
    'Sertakan umpan balik bila jawaban atau kesimpulan murid menunjukkan miskonsepsi yang disebutkan.',
    'Gunakan rumus dan hubungan konsep yang konsisten dengan materi; jangan menampilkan angka hasil yang tidak dihitung oleh kode.',
    'Kode harus satu file HTML mandiri, berjalan offline, responsif, dan seluruh kontrol yang ditampilkan harus berfungsi.'
  ],
  format:['Keluarkan satu blok kode HTML lengkap yang siap dibuka di peramban. Jangan memberikan ringkasan, pseudocode, rancangan antarmuka, atau penjelasan di luar blok kode.']
},

/* ---------- Kategori 3: Game ---------- */
{
  id:'game-edukasi', kategori:'mpi', ikon:'🎮', nama:'Game Edukasi',
  deskripsi:'Game yang melatih materi atau keterampilan tertentu sambil bermain.',
  peran:'Anda adalah pengembang game edukasi berpengalaman yang membuat game satu file HTML yang seru, adil, dan benar-benar melatih materi.',
  tugas:'Buatlah satu game edukasi yang lengkap dan siap dimainkan berdasarkan spesifikasi berikut. Hasil akhir harus berupa game yang bisa langsung dimainkan, bukan konsep game atau pseudocode.',
  fields:[
    { i:'materi', l:'Materi / keterampilan yang dilatih', j:'teks', m:'C', w:true, ph:'mis. perkalian 1–10 untuk kelas III SD', c:'operasi hitung bilangan bulat untuk kelas VII SMP' },
    { i:'pemain', l:'Pemain sasaran (usia / kelas)', j:'teks', m:'C', w:true, ph:'mis. siswa SMP kelas VII', c:'siswa SMP kelas VII' },
    { i:'jenis', l:'Jenis game', j:'pilih', m:'C', w:true, o:['Petualangan','Balapan','Tembak sasaran','Papan','Memori','Teka-teki'], c:'Petualangan' },
    { i:'mekanisme', l:'Cara bermain inti', j:'area', m:'C', w:true, ph:'Jelaskan mekanisme utama: pemain melakukan apa, bagaimana maju/menang…', c:'Pemain menjawab soal untuk membuka pintu berikutnya; jawaban salah mengurangi nyawa.' },
    { i:'level', l:'Jumlah level & kenaikan kesulitan', j:'teks', m:'C', ph:'mis. 5 level, soal makin sulit', c:'5 level, soal makin sulit tiap level' },
    { i:'skor', l:'Sistem skor & nyawa', j:'teks', m:'D', ph:'mis. +10 per jawaban benar, 3 nyawa', c:'+10 per jawaban benar, 3 nyawa' },
    { i:'temaGame', l:'Tema, tokoh & dunia game', j:'area', m:'D', ph:'Ceritakan dunia dan tokohnya…', c:'Tokoh penjelajah luar angkasa mengumpulkan bintang energi.' },
    { i:'suara', l:'Efek suara & musik', j:'pilih', m:'D', o:['Perlu — sebutkan sumber bebas lisensi (mis. freesound.org) beserta kreditnya','Tanpa suara'], c:'Perlu — sebutkan sumber bebas lisensi (mis. freesound.org) beserta kreditnya' },
    { i:'fitur', l:'Fitur wajib', j:'centang', m:'D', aturan:true, o:['Kolom nama pemain','Skor terbaik tersimpan (localStorage)','Layar mulai & layar selesai','Ramah sentuhan (HP)','Satu file HTML mandiri offline'], c:['Kolom nama pemain','Skor terbaik tersimpan (localStorage)','Layar mulai & layar selesai','Ramah sentuhan (HP)'] }
  ],
  aturan:[
    'Buat alur bermain yang utuh: layar mulai, petunjuk, permainan, perkembangan level, kondisi menang atau kalah, dan tombol bermain lagi.',
    'Jumlah level dan kenaikan kesulitan harus sesuai pilihan pengguna; jangan membuat level kosong atau hanya berbeda judul.',
    'Soal atau tantangan harus sesuai materi dan tingkat pemain sasaran. Jangan memasukkan materi di luar yang diberikan.',
    'Berikan umpan balik langsung pada setiap aksi pemain dan jelaskan jawaban atau alasan yang benar bila relevan.',
    'Sistem skor, nyawa, dan aturan menang harus terlihat jelas serta diterapkan konsisten.',
    'Semua fitur wajib yang dipilih harus berfungsi. Jika suara dipilih, gunakan sumber bebas lisensi atau Web Audio sederhana tanpa menghambat game.',
    'Kode harus satu file HTML mandiri, berjalan offline, responsif, dan ramah sentuhan.'
  ],
  format:['Keluarkan satu blok kode HTML lengkap yang siap dimainkan. Pastikan cara bermain dan petunjuk tersedia di dalam game. Jangan memberikan ringkasan, pseudocode, atau uraian di luar blok kode.']
},
{
  id:'kuis-interaktif', kategori:'asesmen', ikon:'❓', nama:'Kuis Interaktif',
  deskripsi:'Kuis dengan soal dari materimu, lengkap dengan pembahasan dan skor.',
  peran:'Anda adalah pengembang kuis interaktif dan penyusun soal berpengalaman yang membuat kuis satu file HTML.',
  tugas:'Buatlah satu kuis interaktif yang lengkap dan siap dipakai berdasarkan spesifikasi berikut. Hasil akhir harus berupa kuis yang dapat langsung dimainkan dan seluruh soalnya harus disusun hanya dari materi sumber yang diberikan.',
  fields:[
    { i:'topik', l:'Topik kuis', j:'teks', m:'C', w:true, ph:'mis. Bilangan Bulat', c:'Bilangan Bulat' },
    { i:'jumlahSoal', l:'Jumlah soal', j:'angka', m:'C', w:true, ph:'mis. 10', c:'10' },
    { i:'jenisSoal', l:'Jenis soal', j:'centang', m:'C', w:true, o:['Pilihan ganda','Benar–salah','Isian singkat','Menjodohkan'], c:['Pilihan ganda'] },
    { i:'kesulitan', l:'Tingkat kesulitan', j:'pilih', m:'C', w:true, o:['Mudah','Sedang','Sulit','Campuran bertingkat'], c:'Campuran bertingkat' },
    { i:'materiSumber', l:'Materi sumber soal', j:'area', m:'C', w:true, ph:'Tempel materi di sini agar soal tidak mengarang…', c:'Bilangan bulat terdiri dari bilangan positif, nol, dan negatif. Operasi hitung campuran dikerjakan dengan urutan: kurung, kali/bagi, lalu tambah/kurang.' },
    { i:'timer', l:'Timer per soal', j:'pilih', m:'D', o:['Tanpa timer','15 detik','30 detik','60 detik'], c:'30 detik' },
    { i:'pembahasan', l:'Pembahasan tiap soal', j:'pilih', m:'D', o:['Tampilkan pembahasan','Tanpa pembahasan'], c:'Tampilkan pembahasan' },
    { i:'hasil', l:'Hasil akhir', j:'centang', m:'D', o:['Skor akhir','Predikat / nilai huruf','Tombol ulangi kuis','Daftar jawaban salah'], c:['Skor akhir','Tombol ulangi kuis','Daftar jawaban salah'] }
  ],
  aturan:[
    'Buat tepat sejumlah soal sesuai kolom Jumlah soal dan gunakan hanya jenis soal yang dipilih.',
    'Dilarang membuat soal, istilah, fakta, atau jawaban di luar materi sumber yang diberikan.',
    'Tampilkan satu soal pada satu waktu atau dalam urutan yang jelas; jangan tampilkan kunci sebelum pengguna mengirim jawaban.',
    'Untuk soal pilihan ganda, setiap soal memiliki satu jawaban benar dan pengecoh yang masuk akal.',
    'Untuk soal hitungan, periksa kembali kunci jawaban dengan menghitung ulang sebelum ditampilkan.',
    'Jika pembahasan dipilih, tampilkan setelah jawaban dikirim dan jelaskan langkah atau alasan secara singkat.',
    'Terapkan timer hanya bila dipilih. Setelah waktu habis, tandai soal dan lanjutkan dengan aman.',
    'Semua fitur hasil akhir yang dipilih harus tersedia, dan seluruh soal, kunci, serta pembahasan tertanam di dalam kode.'
  ],
  format:['Keluarkan satu blok kode HTML lengkap yang memuat seluruh soal, kunci, pembahasan, skor, dan fitur hasil yang diminta. Jangan memberikan ringkasan atau penjelasan di luar blok kode.']
},

/* ---------- Kategori 4: Alat Kerja Guru ---------- */
{
  id:'aplikasi-web', kategori:'umum', ikon:'🛠️', nama:'Aplikasi Web Bebas',
  deskripsi:'Aplikasi web apa pun: pencatat, pengelola, alat bantu kerja, dan lainnya.',
  peran:'Anda adalah pengembang aplikasi web berpengalaman yang membuat aplikasi yang sederhana, cepat, dan benar-benar menyelesaikan masalah penggunanya.',
  tugas:'Buatlah satu aplikasi web yang lengkap dan siap dipakai berdasarkan spesifikasi berikut. Hasil akhir harus berupa aplikasi yang dapat langsung digunakan, bukan wireframe, pseudocode, atau daftar fitur saja.',
  fields:[
    { i:'namaApp', l:'Nama aplikasi', j:'teks', m:'C', w:true, ph:'mis. Catatan Belanja Bulanan', c:'Pencatat Tugas Kelas' },
    { i:'masalah', l:'Masalah yang diselesaikan', j:'area', m:'C', w:true, ph:'Masalah apa yang dialami pengguna sekarang…', c:'Guru kesulitan melacak tugas yang sudah dikumpulkan tiap kelas.' },
    { i:'pengguna', l:'Pengguna aplikasi', j:'teks', m:'C', w:true, ph:'mis. guru SMP', c:'guru SMP' },
    { i:'fiturUtama', l:'Fitur utama', j:'area', m:'C', w:true, ph:'Satu baris satu fitur…', c:'Tambah tugas per kelas\nTandai tugas terkumpul\nRekap per siswa' },
    { i:'penyimpanan', l:'Data disimpan di mana', j:'pilih', m:'C', o:['Tidak disimpan (hilang saat ditutup)','Di perangkat (localStorage)','Diunduh sebagai berkas'], c:'Di perangkat (localStorage)' },
    { i:'tampilanApp', l:'Tampilan (halaman / bagian)', j:'area', m:'C', w:true, ph:'Satu baris satu halaman atau bagian…', c:'Beranda: daftar kelas\nHalaman kelas: daftar tugas & status' },
    { i:'strukturFile', l:'Struktur berkas', j:'pilih', m:'D', aturan:true, o:['Satu file HTML','Beberapa file terpisah'], c:'Satu file HTML' },
    { i:'batasan', l:'Batasan tambahan', j:'centang', m:'D', aturan:true, o:['Berjalan tanpa internet','Tanpa daftar akun / login'], c:['Tanpa daftar akun / login'] },
    { i:'gayaVisual', l:'Gaya visual', j:'teks', m:'D', ph:'mis. bersih, biru muda, banyak ruang kosong', c:'bersih dan sederhana' }
  ],
  aturan:[
    'Ubah setiap fitur utama menjadi alur interaksi yang benar-benar dapat dicoba pengguna dari awal sampai selesai.',
    'Sediakan keadaan kosong, validasi masukan, pesan sukses atau error, dan tombol reset bila alurnya membutuhkan.',
    'Terapkan pilihan penyimpanan persis seperti yang diminta. Jangan menyimpan data bila pengguna memilih tidak menyimpan.',
    'Gunakan bagian tampilan yang diminta dan buat navigasi antarbagian mudah dipahami.',
    'Utamakan kemudahan pemakaian untuk pengguna yang disebutkan, termasuk tampilan responsif dan aksesibilitas dasar.',
    'Seluruh teks antarmuka dan komentar kode dalam Bahasa Indonesia.',
    'Kode harus lengkap dan dapat dijalankan tanpa pseudocode. Jika Struktur berkas Satu file HTML atau batasan Berjalan tanpa internet dipilih, jangan gunakan CDN atau dependensi eksternal.'
  ],
  format:['Jika Struktur berkas Satu file HTML dipilih, keluarkan tepat satu blok kode HTML lengkap. Jika Beberapa file terpisah dipilih, keluarkan setiap file dalam blok kode terpisah dengan nama file yang jelas. Jangan memberikan ringkasan, potongan kode, atau penjelasan di luar blok kode.']
},
{
  id:'kalkulator', kategori:'aplikasi', ikon:'🧮', nama:'Kalkulator / Alat Hitung',
  deskripsi:'Alat hitung khusus: konversi, simulasi biaya, penghitung nilai, dan sejenisnya.',
  peran:'Anda adalah pengembang alat hitung (kalkulator) web berpengalaman yang teliti terhadap rumus dan satuan.',
  tugas:'Buatlah satu kalkulator atau alat hitung yang lengkap dan siap dipakai berdasarkan spesifikasi berikut. Hasil akhir harus menghitung sesuai rumus yang diberikan, bukan sekadar menampilkan contoh hasil.',
  fields:[
    { i:'dihitung', l:'Yang dihitung', j:'teks', m:'C', w:true, ph:'mis. nilai akhir siswa dari tugas, UH, dan UAS', c:'nilai akhir siswa' },
    { i:'masukan', l:'Masukan (input)', j:'area', m:'C', w:true, ph:'Satu baris satu masukan beserta satuannya…', c:'Nilai tugas (0–100)\nNilai ulangan harian (0–100)\nNilai ujian (0–100)' },
    { i:'rumus', l:'Rumus / aturan hitung', j:'area', m:'C', w:true, ph:'Tulis rumusnya dengan jelas…', c:'Nilai akhir = 30% tugas + 30% ulangan harian + 40% ujian' },
    { i:'keluaran', l:'Keluaran (output)', j:'area', m:'C', w:true, ph:'Satu baris satu keluaran…', c:'Nilai akhir (angka)\nPredikat huruf A–E' },
    { i:'kasusUji', l:'Contoh kasus uji', j:'area', m:'D', ph:'Masukan → hasil yang benar…', c:'Tugas 80, UH 70, Ujian 90 → nilai akhir 81, predikat A' },
    { i:'salahInput', l:'Penanganan masukan salah', j:'teks', m:'D', ph:'mis. tampilkan pesan ramah, jangan sampai halaman error', c:'Tampilkan pesan ramah berwarna merah di bawah kolom' }
  ],
  aturan:[
    'Buat satu input untuk setiap masukan yang diberikan, dengan label dan satuan yang jelas.',
    'Hasil hitungan harus persis mengikuti rumus atau aturan hitung yang diberikan; jangan mengganti bobot, pembulatan, atau asumsi tanpa menyatakannya.',
    'Verifikasi perhitungan dengan setiap kasus uji yang diberikan sebelum menulis kode.',
    'Tampilkan hasil utama, satuan, dan rincian perhitungan bila membantu pengguna memeriksa hasilnya.',
    'Tolak masukan kosong, nonangka, di luar rentang, atau pembagian dengan nol menggunakan pesan yang ramah; halaman tidak boleh error.',
    'Tombol hitung, reset, dan seluruh keluaran yang ditentukan harus berfungsi.',
    'Kode harus satu file HTML mandiri, berjalan offline, dan memakai Bahasa Indonesia.'
  ],
  format:['Keluarkan satu blok kode HTML lengkap dengan rumus dan contoh kasus uji terisi di dalam aplikasi. Jangan memberikan ringkasan atau penjelasan di luar blok kode.']
},
{
  id:'dasbor-data', kategori:'aplikasi', ikon:'📊', nama:'Dasbor Data',
  deskripsi:'Dasbor ringkasan data: kartu angka, grafik, dan tabel yang bisa disaring.',
  peran:'Anda adalah pengembang dasbor data berpengalaman yang menyajikan data secara jujur dan mudah dibaca.',
  tugas:'Buatlah satu dasbor data yang lengkap dan siap dipakai berdasarkan spesifikasi berikut. Hasil akhir harus berupa dasbor yang benar-benar menampilkan, meringkas, dan memfilter data, bukan sekadar contoh tata letak.',
  fields:[
    { i:'data', l:'Data yang ditampilkan', j:'area', m:'C', w:true, ph:'Satu baris satu jenis data…', c:'Nilai ulangan per kelas\nKehadiran siswa\nTugas terkumpul' },
    { i:'sumberData', l:'Sumber data', j:'pilih', m:'C', w:true, o:['Diketik manual di aplikasi','Ditempel sebagai tabel','Diimpor dari berkas CSV'], c:'Ditempel sebagai tabel' },
    { i:'kartu', l:'Ringkasan / kartu angka utama', j:'area', m:'C', w:true, ph:'Satu baris satu kartu…', c:'Rata-rata nilai\nNilai tertinggi\nPersentase ketuntasan' },
    { i:'grafik', l:'Jenis grafik', j:'centang', m:'D', o:['Batang','Garis','Lingkaran','Tabel saja'], c:['Batang'] },
    { i:'saring', l:'Saring / urutkan', j:'teks', m:'D', ph:'mis. saring per kelas, urutkan nilai tertinggi', c:'saring per kelas' }
  ],
  aturan:[
    'Gunakan data yang diberikan pengguna tanpa mengubah angka, nama kategori, urutan penting, atau satuannya.',
    'Jika data pengguna belum tersedia, gunakan data contoh yang diberi label "Data contoh" dan buat struktur input mudah diganti.',
    'Tampilkan setiap kartu ringkasan yang diminta dan hitung nilainya dari data, bukan mengetik angka hasil secara manual.',
    'Beri judul, label sumbu, legenda bila perlu, dan satuan yang jelas pada setiap grafik serta kartu.',
    'Aktifkan sumber data yang dipilih: input manual, tempel tabel, atau impor CSV. Berikan validasi dan pesan error yang jelas.',
    'Sediakan penyaring atau pengurutan yang diminta dan pastikan kartu, grafik, serta tabel ikut diperbarui.',
    'Kode harus satu file HTML mandiri, berjalan offline, responsif, dan tidak memakai angka fiktif sebagai fakta pengguna.'
  ],
  format:['Keluarkan satu blok kode HTML lengkap dengan data contoh berlabel bila diperlukan. Jangan memberikan ringkasan, mockup, pseudocode, atau penjelasan di luar blok kode.']
},
{
  id:'rekap-nilai', kategori:'asesmen', ikon:'🧾', nama:'Rekap Nilai & Analisis Hasil Belajar',
  deskripsi:'Mengolah nilai siswa menjadi rekap, ringkasan, dan analisis yang mudah dibaca.',
  peran:'Anda adalah pengembang aplikasi penilaian kelas yang teliti, memahami alur kerja guru, dan menyajikan data hasil belajar secara jujur serta mudah diperiksa.',
  tugas:'Buatlah satu aplikasi web rekap nilai dan analisis hasil belajar yang lengkap dan siap dipakai berdasarkan spesifikasi berikut. Hasil akhir harus benar-benar dapat menerima data, menghitung nilai, dan menampilkan rekap, bukan sekadar mockup atau tabel contoh.',
  konteks:['Aplikasi ini digunakan oleh {penggunaNilai} untuk mengelola hasil belajar {kelasNilai}.'],
  fields:[
    { i:'penggunaNilai', l:'Pengguna aplikasi', j:'teks', m:'C', w:true, ph:'mis. guru SMP', c:'guru SMP' },
    { i:'kelasNilai', l:'Jenjang, kelas, dan mata pelajaran', j:'teks', m:'C', w:true, ph:'mis. SMP kelas VII, Matematika', c:'SMP kelas VII, Matematika' },
    { i:'komponenNilai', l:'Komponen penilaian', j:'area', m:'C', w:true, ph:'Satu baris satu komponen…', c:'Tugas harian\nKuis\nProyek\nPenilaian akhir' },
    { i:'bobotNilai', l:'Bobot setiap komponen', j:'area', m:'C', w:true, ph:'Satu baris satu bobot…', c:'Tugas harian 20%\nKuis 20%\nProyek 30%\nPenilaian akhir 30%' },
    { i:'dataSiswaNilai', l:'Data siswa / nilai awal', j:'area', m:'C', w:true, ph:'Tempel nama siswa dan nilai, atau jelaskan kolom datanya…', c:'Nama,Nama Tugas harian,Kuis,Proyek,Penilaian akhir\nAlya,80,75,88,90\nBima,65,70,72,68' },
    { i:'sumberNilai', l:'Cara memasukkan data', j:'pilih', m:'C', w:true, o:['Diketik langsung di aplikasi','Ditempel sebagai tabel','Diimpor dari CSV'], c:'Ditempel sebagai tabel' },
    { i:'hasilNilai', l:'Keluaran yang diperlukan', j:'area', m:'C', w:true, ph:'Satu baris satu keluaran…', c:'Nilai akhir tiap siswa\nRata-rata kelas\nNilai tertinggi dan terendah\nRingkasan per komponen' },
    { i:'fiturNilai', l:'Fitur tambahan', j:'centang', m:'D', aturan:true, o:['Edit dan hapus data','Saring per siswa atau rentang nilai','Urutkan nilai','Ekspor CSV','Cetak rekap','Simpan di perangkat (localStorage)'], c:['Edit dan hapus data','Saring per siswa atau rentang nilai','Urutkan nilai','Cetak rekap','Simpan di perangkat (localStorage)'] }
  ],
  aturan:[
    'Gunakan bobot persis seperti yang diberikan dan tampilkan rincian perhitungan agar guru dapat memeriksa hasilnya.',
    'Jangan mengubah nama siswa, nilai, bobot, atau satuan. Jika data belum lengkap, sediakan data contoh yang diberi label dan mudah diganti.',
    'Validasi nilai kosong, bukan angka, dan nilai di luar rentang yang ditentukan; tampilkan pesan yang ramah tanpa membuat halaman error.',
    'Tampilkan rekap individu dan ringkasan kelas sesuai keluaran yang diminta. Semua ringkasan harus dihitung dari data, bukan ditulis sebagai angka tetap.',
    'Jangan menetapkan batas ketuntasan, predikat, atau kebijakan penilaian yang tidak diberikan pengguna. Jika dibutuhkan tetapi belum ada, sediakan pengaturan yang dapat diubah guru.',
    'Seluruh teks antarmuka dan komentar kode dalam Bahasa Indonesia. Kode harus satu file HTML mandiri, responsif, berjalan offline, dan tidak memakai CDN.'
  ],
  format:['Keluarkan satu blok kode HTML lengkap. Sertakan data contoh berlabel bila diperlukan, rumus yang terlihat, validasi, dan seluruh fitur tambahan yang dipilih. Jangan memberikan ringkasan atau penjelasan di luar blok kode.']
},
{
  id:'absensi-jurnal', kategori:'administrasi', ikon:'📅', nama:'Absensi & Jurnal Mengajar',
  deskripsi:'Mencatat kehadiran, materi, aktivitas, dan tindak lanjut setiap pertemuan.',
  peran:'Anda adalah pengembang aplikasi administrasi kelas yang memahami kebutuhan guru untuk mencatat kehadiran dan jurnal pembelajaran secara cepat.',
  tugas:'Buatlah satu aplikasi web absensi dan jurnal mengajar yang lengkap dan siap dipakai. Aplikasi harus membantu guru mencatat satu pertemuan dari awal sampai selesai, melihat rekap, dan menemukan catatan yang diperlukan.',
  konteks:['Aplikasi ini digunakan oleh {penggunaAbsensi} untuk kelas {kelasAbsensi}.'],
  fields:[
    { i:'penggunaAbsensi', l:'Pengguna aplikasi', j:'teks', m:'C', w:true, ph:'mis. guru kelas atau guru mata pelajaran', c:'guru mata pelajaran' },
    { i:'kelasAbsensi', l:'Kelas dan mata pelajaran', j:'teks', m:'C', w:true, ph:'mis. VII A — Matematika', c:'VII A — Matematika' },
    { i:'daftarSiswaAbsensi', l:'Daftar siswa', j:'area', m:'C', w:true, ph:'Satu nama per baris…', c:'Alya\nBima\nCitra\nDanu' },
    { i:'statusAbsensi', l:'Status kehadiran', j:'centang', m:'C', w:true, o:['Hadir','Sakit','Izin','Alpa','Terlambat'], c:['Hadir','Sakit','Izin','Alpa','Terlambat'] },
    { i:'isiJurnal', l:'Isi jurnal pertemuan', j:'area', m:'C', w:true, ph:'Misalnya materi, tujuan, kegiatan, dan catatan…', c:'Materi: Operasi bilangan bulat\nKegiatan: diskusi berpasangan dan latihan soal\nCatatan: beberapa siswa perlu penguatan konsep tanda negatif' },
    { i:'fiturAbsensi', l:'Fitur tambahan', j:'centang', m:'D', aturan:true, o:['Riwayat pertemuan','Rekap per siswa','Filter tanggal atau status','Edit dan hapus catatan','Cetak jurnal','Ekspor CSV','Simpan di perangkat (localStorage)'], c:['Riwayat pertemuan','Rekap per siswa','Filter tanggal atau status','Cetak jurnal','Simpan di perangkat (localStorage)'] }
  ],
  aturan:[
    'Sediakan alur yang cepat untuk memilih tanggal atau pertemuan, mengisi status setiap siswa, menulis jurnal, lalu menyimpan catatan.',
    'Nama siswa dan status harus tetap konsisten. Berikan penanda bila ada siswa yang belum diberi status.',
    'Tampilkan rekap jumlah dan persentase tiap status serta rekap per siswa bila diminta. Hitung semua ringkasan dari data yang tersimpan.',
    'Sediakan keadaan kosong, validasi masukan, konfirmasi sebelum menghapus, dan pesan sukses atau error yang jelas.',
    'Jangan mengarang nama siswa, tanggal, materi, atau catatan sebagai data nyata. Data contoh harus diberi label.',
    'Seluruh teks antarmuka dan komentar kode dalam Bahasa Indonesia. Kode harus satu file HTML mandiri, responsif, berjalan offline, dan tidak memakai CDN.'
  ],
  format:['Keluarkan satu blok kode HTML lengkap dengan formulir, daftar siswa, penyimpanan, rekap, dan fitur tambahan yang dipilih. Jangan memberikan ringkasan atau penjelasan di luar blok kode.']
},
{
  id:'rubrik-penilaian', kategori:'asesmen', ikon:'📐', nama:'Rubrik & Penilaian',
  deskripsi:'Membuat rubrik, menilai karya siswa, dan menghasilkan skor serta umpan balik.',
  peran:'Anda adalah pengembang alat asesmen yang membantu guru membuat rubrik yang jelas, konsisten, dan mudah digunakan saat menilai pekerjaan siswa.',
  tugas:'Buatlah satu aplikasi web rubrik dan penilaian yang lengkap dan siap dipakai. Guru harus dapat menentukan kriteria, memilih level pencapaian, menilai beberapa siswa, lalu memperoleh skor dan umpan balik yang dapat diperiksa.',
  konteks:['Rubrik ini digunakan untuk {tugasRubrik} pada {kelasRubrik}.'],
  fields:[
    { i:'tugasRubrik', l:'Tugas / karya yang dinilai', j:'teks', m:'C', w:true, ph:'mis. presentasi proyek pencemaran lingkungan', c:'presentasi proyek pencemaran lingkungan' },
    { i:'kelasRubrik', l:'Jenjang, kelas, dan mata pelajaran', j:'teks', m:'C', w:true, ph:'mis. SMP kelas VIII, IPA', c:'SMP kelas VIII, IPA' },
    { i:'tujuanRubrik', l:'Tujuan atau kompetensi yang dinilai', j:'area', m:'C', w:true, ph:'Satu baris satu tujuan…', c:'Menjelaskan hubungan sebab-akibat\nMenggunakan bukti yang relevan\nMenyampaikan gagasan dengan jelas' },
    { i:'kriteriaRubrik', l:'Kriteria penilaian', j:'area', m:'C', w:true, ph:'Satu baris satu kriteria…', c:'Ketepatan isi\nPenggunaan bukti\nKejelasan komunikasi' },
    { i:'levelRubrik', l:'Level pencapaian', j:'teks', m:'C', w:true, ph:'mis. 4 level: Sangat baik, Baik, Cukup, Perlu bimbingan', c:'4 level: Sangat baik, Baik, Cukup, Perlu bimbingan' },
    { i:'bobotRubrik', l:'Bobot kriteria (opsional)', j:'area', m:'D', ph:'Satu baris satu bobot…', c:'Ketepatan isi 40%\nPenggunaan bukti 30%\nKejelasan komunikasi 30%' },
    { i:'dataSiswaRubrik', l:'Nama siswa / hasil penilaian awal', j:'area', m:'D', ph:'Satu nama per baris atau tempel data…', c:'Alya\nBima\nCitra' },
    { i:'fiturRubrik', l:'Fitur tambahan', j:'centang', m:'D', aturan:true, o:['Skor otomatis','Umpan balik per kriteria','Penilaian beberapa siswa','Edit rubrik','Cetak rubrik kosong','Ekspor hasil','Simpan di perangkat (localStorage)'], c:['Skor otomatis','Umpan balik per kriteria','Penilaian beberapa siswa','Cetak rubrik kosong','Simpan di perangkat (localStorage)'] }
  ],
  aturan:[
    'Buat deskriptor yang dapat diamati untuk setiap kriteria dan level. Hindari kata yang terlalu umum tanpa indikator perilaku atau bukti.',
    'Jika bobot diberikan, pastikan jumlah bobot terlihat dan perhitungan skor mengikuti bobot tersebut. Jika tidak diberikan, gunakan bobot sama rata dan tampilkan asumsi itu di aplikasi.',
    'Sediakan tampilan rubrik kosong untuk dipakai guru dan tampilan penilaian untuk satu atau beberapa siswa sesuai fitur yang dipilih.',
    'Skor, predikat, dan umpan balik harus dihitung atau dipilih dari data rubrik. Jangan membuat hasil penilaian siswa yang tidak dimasukkan guru.',
    'Validasi kriteria kosong, bobot tidak valid, dan level yang tidak lengkap; tampilkan pesan yang ramah.',
    'Seluruh teks antarmuka dan komentar kode dalam Bahasa Indonesia. Kode harus satu file HTML mandiri, responsif, berjalan offline, dan tidak memakai CDN.'
  ],
  format:['Keluarkan satu blok kode HTML lengkap yang memuat pembuat rubrik, formulir penilaian, perhitungan skor, dan fitur tambahan yang dipilih. Jangan memberikan ringkasan atau penjelasan di luar blok kode.']
},
{
  id:'umpan-balik-siswa', kategori:'administrasi', ikon:'💬', nama:'Umpan Balik & Laporan Perkembangan',
  deskripsi:'Menyusun komentar perkembangan siswa dari catatan dan bukti belajar guru.',
  peran:'Anda adalah pengembang alat bantu guru yang membantu menyusun umpan balik siswa secara personal, spesifik, hangat, dan berbasis bukti yang dimasukkan guru.',
  tugas:'Buatlah satu aplikasi web untuk menyusun umpan balik dan laporan perkembangan siswa. Guru harus dapat memasukkan catatan per siswa, memilih gaya keluaran, mengedit hasil, lalu menyalin atau mencetaknya.',
  konteks:['Aplikasi ini digunakan oleh {penggunaUmpanBalik} untuk menyusun laporan {periodeUmpanBalik} pada {kelasUmpanBalik}.'],
  fields:[
    { i:'penggunaUmpanBalik', l:'Pengguna aplikasi', j:'teks', m:'C', w:true, ph:'mis. wali kelas', c:'wali kelas' },
    { i:'kelasUmpanBalik', l:'Kelas dan mata pelajaran', j:'teks', m:'C', w:true, ph:'mis. VIII B — Matematika', c:'VIII B — Matematika' },
    { i:'periodeUmpanBalik', l:'Periode laporan', j:'teks', m:'C', w:true, ph:'mis. semester 1 tahun ajaran 2026/2027', c:'semester 1 tahun ajaran 2026/2027' },
    { i:'dataUmpanBalik', l:'Catatan dan bukti belajar siswa', j:'area', m:'C', w:true, ph:'Masukkan nama, kekuatan, perkembangan, kebutuhan, dan bukti yang relevan…', c:'Alya — aktif menjelaskan strategi saat diskusi; hasil latihan pecahan meningkat; perlu lebih teliti menulis langkah.\nBima — memahami konsep dasar; masih perlu berlatih membaca soal cerita.' },
    { i:'fokusUmpanBalik', l:'Bagian yang harus disusun', j:'centang', m:'C', w:true, o:['Kekuatan siswa','Perkembangan yang terlihat','Hal yang perlu ditingkatkan','Saran tindak lanjut','Apresiasi'], c:['Kekuatan siswa','Perkembangan yang terlihat','Hal yang perlu ditingkatkan','Saran tindak lanjut'] },
    { i:'gayaUmpanBalik', l:'Gaya bahasa', j:'pilih', m:'C', w:true, o:['Hangat dan memotivasi','Formal dan ringkas','Objektif dan berbasis bukti','Ramah untuk orang tua'], c:'Hangat dan memotivasi' },
    { i:'formatUmpanBalik', l:'Format keluaran', j:'pilih', m:'C', w:true, o:['Satu paragraf per siswa','Poin-poin per siswa','Tabel ringkas','Laporan lengkap per siswa'], c:'Satu paragraf per siswa' },
    { i:'fiturUmpanBalik', l:'Fitur tambahan', j:'centang', m:'D', aturan:true, o:['Edit hasil sebelum disalin','Cari nama siswa','Cetak laporan','Ekspor teks atau CSV','Simpan di perangkat (localStorage)','Tombol hapus semua data'], c:['Edit hasil sebelum disalin','Cari nama siswa','Cetak laporan','Simpan di perangkat (localStorage)'] }
  ],
  aturan:[
    'Gunakan hanya catatan dan bukti yang dimasukkan guru. Jangan menambahkan prestasi, diagnosis, angka, atau kesimpulan yang tidak tersedia.',
    'Pisahkan fakta yang diamati dari saran tindak lanjut. Gunakan bahasa yang menghargai siswa dan berorientasi pada perkembangan.',
    'Buat keluaran untuk setiap siswa yang datanya diberikan dan pertahankan nama siswa dengan benar.',
    'Jika catatan seorang siswa tidak lengkap, tandai bagian yang perlu dilengkapi guru; jangan mengisi kekosongan dengan asumsi tentang siswa.',
    'Sediakan hasil yang dapat diedit sebelum disalin atau dicetak. Jangan mengirim data siswa ke layanan eksternal dan jangan memakai CDN.',
    'Seluruh teks antarmuka dan komentar kode dalam Bahasa Indonesia. Kode harus satu file HTML mandiri, responsif, dan berjalan offline.'
  ],
  format:['Keluarkan satu blok kode HTML lengkap dengan input catatan, hasil per siswa, editor hasil, dan fitur tambahan yang dipilih. Jangan memberikan ringkasan atau penjelasan di luar blok kode.']
},

/* ---------- Kategori 5: Materi Ajar & Soal ---------- */
{
  id:'modul-ajar', kategori:'materi', ikon:'📘', nama:'Modul Ajar / RPP Ringkas',
  deskripsi:'Modul ajar / RPP ringkas berbasis Perencanaan Pembelajaran Mendalam dan CP resmi 2025.',
  peran:'Anda adalah penyusun dokumen perencanaan pembelajaran yang berpengalaman. Gunakan Panduan Mata Pelajaran Matematika Fase A–F dan Fase F Tingkat Lanjut (BSKAP, 2025) serta Keputusan Kepala BSKAP No. 046/H/KR/2025 sebagai acuan. Sesuaikan penerapannya dengan mata pelajaran yang dipilih pengguna.',
  tugas:'Susunlah satu dokumen perencanaan pembelajaran yang ringkas, jelas, fleksibel, dan siap digunakan. Pertahankan empat bagian resmi: Identifikasi → Desain Pembelajaran → Pengalaman Belajar → Asesmen Pembelajaran. Isi bagian yang tidak ditentukan pengguna dengan rancangan yang wajar dan tandai asumsi yang perlu diperiksa guru.',
  fields:[
    { i:'penyusun', l:'Penyusun / satuan pendidikan (opsional)', j:'teks', m:'D', g:'Identitas', ph:'mis. Aan Triono, S.Pd. — SMP Nusantara', c:'Aan Triono, S.Pd. — SMP Nusantara' },
    { i:'jenjang', l:'Jenjang', j:'pilih', m:'C', w:true, g:'Identitas', o:['PAUD','SD','SMP','SMA','SMK'], c:'SMP' },
    { i:'fase', l:'Fase', j:'pilih', m:'C', w:true, g:'Identitas', o:['Fondasi (PAUD)','A (Kelas I–II)','B (Kelas III–IV)','C (Kelas V–VI)','D (Kelas VII–IX SMP)','E (Kelas X)','F (Kelas XI–XII)'], c:'D (Kelas VII–IX SMP)' },
    { i:'kelas', l:'Kelas', j:'teks', m:'C', w:true, g:'Identitas', ph:'mis. VII', c:'VII' },
    { i:'mapel', l:'Mata pelajaran', j:'teks', m:'C', w:true, g:'Identitas', ph:'mis. Matematika', c:'Matematika' },
    { i:'topik', l:'Topik / materi esensial', j:'teks', m:'C', w:true, g:'Identitas', ph:'mis. Perbandingan senilai', c:'Perbandingan senilai' },
    { i:'alokasi', l:'Alokasi waktu (opsional)', j:'teks', m:'D', g:'Identitas', ph:'mis. 2 pertemuan × 2 JP', c:'2 pertemuan × 2 JP' },
    { i:'konteks', l:'Kondisi murid dan konteks materi (opsional)', j:'area', m:'D', g:'A. Identifikasi', ph:'Pengetahuan awal, kebutuhan belajar, relevansi materi, atau konteks lokal…', c:'Murid telah mengenal pecahan; beberapa murid membutuhkan contoh konkret dan waktu latihan tambahan.' },
    { i:'dimensi', l:'Dimensi Profil Lulusan', j:'centang', m:'C', w:true, g:'A. Identifikasi', o:DIMENSI_PROFIL, c:['Penalaran kritis','Komunikasi'] },
    { i:'cp', l:'CP resmi (wajib ditempel)', j:'area', m:'C', w:true, g:'B. Desain Pembelajaran', ph:'Tempel bagian CP yang relevan dari Panduan Mata Pelajaran atau Lampiran Kep. BSKAP No. 046/H/KR/2025…', c:'Murid dapat menggunakan rasio (skala, proporsi, dan laju perubahan) dalam penyelesaian masalah.' },
    { i:'elemen', l:'Elemen / lingkup CP (opsional)', j:'teks', m:'D', g:'B. Desain Pembelajaran', ph:'mis. Bilangan; Aljabar; atau Pemecahan Masalah Matematis', c:'Bilangan' },
    { i:'tp', l:'TP atau arahan penurunannya', j:'area', m:'C', w:true, g:'B. Desain Pembelajaran', ph:'Satu baris satu TP, atau tulis: Turunkan dari CP dan topik…', c:'Turunkan dari CP dan topik menjadi tujuan yang terukur.' },
    { i:'kerangka', l:'Kerangka pembelajaran (opsional)', j:'area', m:'D', g:'B. Desain Pembelajaran', ph:'Model / metode, kemitraan, lingkungan belajar, dan pemanfaatan digital bila ada…', c:'PBL; kerja berpasangan; kelas dengan benda konkret; tanpa teknologi digital.' },
    { i:'kegiatan', l:'Ide kegiatan / pertanyaan pemantik (opsional)', j:'area', m:'C', g:'C. Pengalaman Belajar', ph:'Tempel ide kegiatan atau pertanyaan pemantik. Jika kosong, minta AI merancangnya…', c:'Mengapa harga dua barang dengan rasio yang sama dapat dibandingkan? Gunakan contoh belanja sehari-hari.' },
    { i:'dukungan', l:'Dukungan belajar dan sumber (opsional)', j:'area', m:'D', g:'C. Pengalaman Belajar', ph:'Media, alat, sumber, diferensiasi, atau kebutuhan khusus…', c:'Kartu pecahan, tabel perbandingan, dan pilihan menjawab secara lisan atau tertulis.' },
    { i:'asesmen', l:'Bukti asesmen / instrumen yang diinginkan (opsional)', j:'area', m:'C', g:'D. Asesmen Pembelajaran', ph:'Bukti belajar, teknik, instrumen, atau tindak lanjut yang ingin dipakai…', c:'Awal: 3 pertanyaan prasyarat. Proses: observasi strategi. Akhir: masalah kontekstual dan rubrik singkat.' },
    { i:'lampiran', l:'Lampiran yang diperlukan (opsional)', j:'centang', m:'D', g:'D. Asesmen Pembelajaran', o:['LKPD','Kunci jawaban','Rubrik','Lembar observasi','Remedial dan pengayaan'], c:['Rubrik'] }
  ],
  aturan:[
    'Gunakan istilah resmi "Dimensi Profil Lulusan" dan susun dokumen dengan empat bagian: A. Identifikasi, B. Desain Pembelajaran, C. Pengalaman Belajar, D. Asesmen Pembelajaran.',
    'Jangan menyebut format ini sebagai satu-satunya format resmi. Perencanaan pembelajaran bersifat fleksibel, jelas, dan sederhana.',
    'Sumber acuan resmi: Panduan Mata Pelajaran Matematika Fase A–F dan Fase F Tingkat Lanjut (https://repositori.kemendikdasmen.go.id/33608/) dan Keputusan Kepala BSKAP No. 046/H/KR/2025 beserta lampirannya (https://kurikulum.kemendikdasmen.go.id/file/1753929861_manage_file.pdf).',
    'CP harus diperlakukan sebagai teks sumber. Jangan mengubah, meringkas, atau mengarang rumusan CP. Jika CP tidak lengkap, tandai [CP PERLU DIPERIKSA GURU].',
    'Selaraskan TP dengan CP, fase, elemen, dan topik. Jika TP diturunkan oleh AI, tandai sebagai "Rancangan TP" dan gunakan tujuan yang dapat diamati.',
    'Template ini dioptimalkan untuk Matematika. Hubungkan kegiatan dan asesmen dengan elemen materi yang dipilih serta proses matematis yang relevan seperti penalaran, pemecahan masalah, komunikasi, representasi, atau koneksi. Untuk mata pelajaran lain, gunakan panduan mata pelajaran resminya sebagai sumber CP dan materi.',
    'Pada Pengalaman Belajar, tampilkan prinsip berkesadaran, bermakna, dan menggembirakan melalui tindakan nyata. Susun pengalaman inti dengan urutan Memahami → Mengaplikasi → Merefleksi.',
    'Asesmen wajib memuat bukti yang selaras dengan tujuan pada awal, proses, dan akhir pembelajaran. Gunakan istilah diagnostik, formatif, dan sumatif hanya sebagai keterangan bila membantu.',
    'Jangan menambahkan komponen, lampiran, atau rubrik yang tidak diminta. Bila informasi opsional kosong, buat rancangan secukupnya dan tandai asumsi yang perlu diperiksa guru.'
  ],
  format:['Dokumen Markdown siap salin ke Word. Gunakan urutan: Identitas singkat → A. Identifikasi → B. Desain Pembelajaran → C. Pengalaman Belajar → D. Asesmen Pembelajaran → Lampiran hanya bila dipilih. Gunakan tabel hanya jika membantu keterbacaan. Jangan mengawali dengan analisis atau outline.']
},
{
  id:'lkpd', kategori:'materi', ikon:'📄', nama:'LKPD',
  deskripsi:'Lembar Kerja Peserta Didik yang siap dipakai dan siap cetak.',
  peran:'Anda adalah penyusun LKPD berpengalaman yang menulis lembar kerja yang jelas, bertahap, dan menyenangkan dikerjakan peserta didik.',
  tugas:'Susunlah satu LKPD yang lengkap, siap dicetak, dan siap dikerjakan peserta didik berdasarkan spesifikasi berikut. Keluarkan lembar kerja final secara langsung, bukan penjelasan tentang cara membuat LKPD.',
  fields:[
    { i:'materiLkpd', l:'Materi', j:'teks', m:'C', w:true, ph:'mis. Sistem Pencernaan Manusia', c:'Sistem Pencernaan Manusia' },
    { i:'kelasLkpd', l:'Kelas', j:'teks', m:'C', w:true, ph:'mis. VIII SMP', c:'VIII SMP' },
    { i:'tujuanKegiatan', l:'Tujuan kegiatan', j:'area', m:'C', w:true, ph:'Satu baris satu tujuan…', c:'Mengamati dan mencatat urutan organ pencernaan\nMenjelaskan fungsi tiap organ' },
    { i:'jenisKegiatan', l:'Jenis kegiatan', j:'pilih', m:'C', w:true, o:['Pengamatan','Percobaan','Diskusi','Latihan soal','Proyek mini'], c:'Pengamatan' },
    { i:'jumlahTugas', l:'Jumlah & jenis soal / tugas', j:'teks', m:'C', ph:'mis. 5 tugas pengamatan + 3 soal refleksi', c:'5 tugas pengamatan + 3 soal refleksi' },
    { i:'kunci', l:'Kunci jawaban untuk guru', j:'pilih', m:'D', o:['Sertakan terpisah di akhir','Tidak perlu'], c:'Sertakan terpisah di akhir' },
    { i:'formatCetak', l:'Format cetak', j:'pilih', m:'D', o:['Dokumen biasa siap salin ke Word','Kode LaTeX A4 siap cetak'], c:'Dokumen biasa siap salin ke Word' }
  ],
  aturan:[
    'Tulis instruksi langsung kepada peserta didik dengan kata kerja yang jelas, singkat, dan sesuai usia.',
    'Jumlah tugas harus mengikuti kolom Jumlah & jenis soal / tugas; jangan mengurangi atau menambah tanpa alasan.',
    'Sediakan ruang jawaban yang proporsional setelah setiap pertanyaan atau tugas.',
    'Susun kegiatan secara bertahap dari pengantar, kegiatan inti, pengolahan hasil, sampai kesimpulan atau refleksi.',
    'Jika kegiatan pengamatan atau percobaan dipilih, sertakan tujuan, alat dan bahan, langkah aman, tabel pengamatan, dan pertanyaan analisis.',
    'Jika kunci jawaban dipilih, letakkan kunci dan pedoman penilaian terpisah setelah bagian peserta didik.',
    'Jangan mengarang data hasil pengamatan; sediakan kolom agar peserta didik mengisinya.'
  ],
  format:['Jika Dokumen biasa dipilih, berikan Markdown siap salin ke Word dengan urutan: Identitas, Tujuan, Alat & Bahan, Petunjuk, Kegiatan, Tabel atau Ruang Jawaban, Refleksi, lalu Kunci Jawaban Guru bila dipilih. Jika LaTeX dipilih, berikan satu blok kode LaTeX A4 lengkap.']
},
{
  id:'bank-soal', kategori:'asesmen', ikon:'🗂️', nama:'Bank Soal',
  deskripsi:'Paket soal dari materi sumbermu, lengkap dengan kunci dan pembahasan.',
  peran:'Anda adalah penyusun soal berpengalaman yang menulis soal yang valid, jelas, dan sesuai jenjang kognitif yang diminta.',
  tugas:'Susunlah satu paket soal yang lengkap dan siap digunakan berdasarkan spesifikasi berikut. Soal hanya boleh dibuat dari materi atau ruang lingkup yang diberikan, lalu tampilkan kunci dan pembahasan sesuai pilihan pengguna.',
  fields:[
    { i:'ruangLingkup', l:'Materi & ruang lingkup (materi sumber)', j:'area', m:'C', w:true, ph:'Tempel materi sumber atau jabarkan ruang lingkupnya…', c:'Bilangan bulat: pengertian, garis bilangan, membandingkan, dan operasi hitung campuran.' },
    { i:'jenjangKelas', l:'Jenjang & kelas', j:'teks', m:'C', w:true, ph:'mis. SMP Kelas VII', c:'SMP Kelas VII' },
    { i:'jumlahBentuk', l:'Jumlah & bentuk soal', j:'teks', m:'C', w:true, ph:'mis. 10 pilihan ganda, 3 esai', c:'10 pilihan ganda, 2 esai' },
    { i:'kognitif', l:'Tingkat kesulitan & jenjang kognitif', j:'pilih', m:'C', o:['Campuran C1–C3','Sampai C4 (menganalisis)','Fokus HOTS'], c:'Campuran C1–C3' },
    { i:'kunciBahasan', l:'Kunci & pembahasan', j:'pilih', m:'C', w:true, o:['Kunci saja','Kunci + pembahasan','Kunci + pembahasan + rubrik esai'], c:'Kunci + pembahasan' },
    { i:'kisi', l:'Tabel spesifikasi / kisi-kisi', j:'pilih', m:'D', o:['Sertakan sebelum soal','Tidak perlu'], c:'Sertakan sebelum soal' }
  ],
  aturan:[
    'Buat tepat jumlah dan bentuk soal yang tertulis pada kolom Jumlah & bentuk soal.',
    'Gunakan hanya materi atau ruang lingkup sumber; jangan menambahkan konsep yang tidak ada di dalamnya.',
    'Jika kisi-kisi dipilih, tampilkan tabel kisi-kisi sebelum soal dengan nomor, indikator, materi, bentuk soal, dan jenjang kognitif.',
    'Untuk pilihan ganda, setiap soal memiliki satu jawaban benar, opsi konsisten, dan pengecoh yang berasal dari kesalahan umum.',
    'Untuk soal hitungan, hitung ulang setiap kunci jawaban sebelum ditulis dan tunjukkan langkah perhitungannya pada pembahasan bila diminta.',
    'Hindari soal yang jawabannya ambigu, memerlukan fakta di luar sumber, atau menggunakan konteks yang tidak sesuai jenjang.',
    'Pisahkan soal dari kunci dan pembahasan agar paket soal dapat langsung dibagikan kepada peserta didik.'
  ],
  format:['Dokumen siap pakai dengan urutan: Kisi-kisi bila dipilih, Petunjuk, Soal bernomor, lalu Kunci Jawaban dan Pembahasan sesuai pilihan. Untuk esai, sertakan rubrik bila diminta. Jangan mengawali dengan analisis.']
},
{
  id:'slide-presentasi', kategori:'materi', ikon:'🖥️', nama:'Slide Presentasi',
  deskripsi:'Membuat file presentasi siap unduh dengan alur, sistem desain, dan visual yang konsisten.',
  peran:'Anda adalah desainer presentasi profesional, instructional designer, dan pembuat file PowerPoint. Anda mengubah materi menjadi presentasi yang ringkas, runtut, mudah dipahami, dan memiliki sistem desain visual yang konsisten.',
  tugas:'Buat presentasi final berdasarkan materi dan tujuan berikut dalam Format keluaran yang dipilih. Hasil utama wajib berupa satu file presentasi yang dapat langsung diunduh dan dibuka. Jangan berhenti pada outline, rancangan, atau daftar isi slide.',
  fields:[
    { i:'topikSlide', l:'Topik presentasi', j:'teks', m:'C', w:true, ph:'mis. Pengenalan Bilangan Bulat', c:'Pengenalan Bilangan Bulat' },
    { i:'audiens', l:'Hadirin / audiens', j:'teks', m:'C', w:true, ph:'mis. siswa SMP kelas VII', c:'siswa SMP kelas VII' },
    { i:'jumlahSlide', l:'Jumlah slide', j:'angka', m:'C', w:true, ph:'mis. 10', c:'10' },
    { i:'tujuanPresentasi', l:'Tujuan presentasi', j:'teks', m:'C', w:true, ph:'mis. siswa memahami bilangan negatif lewat contoh suhu dan utang', c:'siswa memahami bilangan negatif lewat contoh sehari-hari' },
    { i:'formatKeluaran', l:'Format keluaran', j:'pilih', m:'C', w:true, o:['PowerPoint (.pptx) — buat dan lampirkan file','PDF (.pdf) — buat dan lampirkan file','HTML slide mandiri (.html) — buat dan lampirkan file'], c:'PowerPoint (.pptx) — buat dan lampirkan file' },
    { i:'gayaSampai', l:'Gaya penyampaian', j:'pilih', m:'D', o:['Mengajar','Seminar','Promosi','Laporan'], c:'Mengajar' },
    { i:'visual', l:'Kebutuhan visual per slide', j:'pilih', m:'C', o:['Gunakan gambar / diagram yang relevan','Teks saja'], c:'Gunakan gambar / diagram yang relevan' },
    { i:'gayaVisual', l:'Gaya visual presentasi', j:'pilih', m:'C', o:['Modern edukatif — biru tua, hijau, dan kuning lembut','Minimal profesional — monokrom dengan satu warna aksen','Cerah ramah — warna hangat dengan kontras tinggi'], c:'Modern edukatif — biru tua, hijau, dan kuning lembut' },
    { i:'arahVisual', l:'Arahan visual khusus (opsional)', j:'area', m:'D', ph:'Jelaskan visual, contoh, atau identitas yang ingin ditampilkan…', c:'Gunakan diagram alur, ikon sederhana, dan mockup antarmuka. Hindari gambar dekoratif yang tidak membantu pemahaman.' }
  ],
  aturan:[
    'Keluarkan tepat sejumlah slide yang diminta pada kolom Jumlah slide.',
    'Hasil utama harus berupa satu file sesuai Format keluaran dan file tersebut harus dilampirkan agar dapat diunduh.',
    'Jika Format keluaran adalah PowerPoint, buat file .pptx dengan teks yang dapat diedit, rasio 16:9, dan satu slide untuk setiap halaman.',
    'Jika tersedia alat pembuat file, gunakan alat tersebut untuk membuat file final. Jangan hanya menampilkan kode, outline, atau instruksi pembuatan file.',
    'Jangan menulis artikel, esai, narasi panjang, atau daftar slide sebagai pengganti file presentasi.',
    'Bagian Isi Slide hanya boleh berisi maksimal 4 bullet point.',
    'Setiap bullet point harus singkat, maksimal 12 kata, dan tidak boleh berupa paragraf.',
    'Letakkan penjelasan, contoh, transisi, dan kalimat yang lebih panjang di bagian Catatan Pembicara.',
    'Catatan Pembicara maksimal 3 kalimat singkat per slide dan tidak boleh mengulang semua bullet secara mentah.',
    'Bangun alur presentasi yang jelas: pembuka, konteks atau masalah, pembahasan utama, contoh atau data, kesimpulan, lalu ajakan atau refleksi bila relevan.',
    'Sebelum merender file, rancang alur dan fokus setiap slide secara internal. Jangan menampilkan outline tersebut sebagai pengganti file.',
    'Jika jumlah slide minimal 8, susun alur dengan pembuka, konteks, peta proses, pembahasan utama, contoh atau data, masalah umum, ringkasan, dan ajakan.',
    'Gunakan satu pesan utama pada setiap slide dan ubah konsep yang berurutan menjadi diagram alur, timeline, proses bernomor, atau perbandingan.',
    'Terapkan sistem desain yang konsisten: latar terang atau gelap yang terkontrol, maksimal 4 warna utama, font sans-serif yang mudah dibaca, judul minimal 28 pt, dan isi minimal 18 pt.',
    'Gunakan ruang kosong yang cukup, margin yang konsisten, kontras tinggi, dan hierarki ukuran yang jelas. Jangan memenuhi slide dengan teks.',
    'Gunakan variasi layout yang terencana: slide pembuka, kartu manfaat, diagram proses, checklist, mockup, perbandingan, dan ringkasan.',
    'Jika topik berupa teknologi atau prosedur, prioritaskan diagram alur, potongan kode pendek, struktur folder, mockup antarmuka, atau anotasi langkah yang relevan.',
    'Jika topik berupa konsep atau pembelajaran, prioritaskan contoh konkret, perbandingan, ilustrasi hubungan sebab-akibat, dan visual yang membantu menjelaskan ide.',
    'Masukkan visual langsung ke dalam slide bila format mendukung. Gunakan ikon sederhana atau bentuk PowerPoint yang dapat diedit bila gambar khusus tidak tersedia.',
    'Hindari clip art generik, gambar dekoratif tanpa fungsi, screenshot buram, teks kecil, tabel padat, dan pengulangan layout yang sama pada semua slide.',
    'Ikuti pilihan Gaya visual presentasi dan Arahan visual khusus bila diisi. Jika dipilih Teks saja, gunakan tata letak bersih tanpa gambar tambahan, tetapi pertahankan hierarki, warna, dan ruang kosong yang baik.',
    'Jika Gaya visual presentasi atau Kebutuhan visual per slide tidak diisi, gunakan gaya Modern edukatif dan visual diagram atau bentuk yang relevan.',
    'Lakukan pemeriksaan akhir: jumlah slide tepat, semua teks terbaca, tidak ada elemen bertumpuk atau keluar batas, warna dan font konsisten, serta visual relevan dengan isi.',
    'Setelah file dibuat, berikan nama file dan tautan unduhan singkat. Jika lingkungan tidak mendukung pembuatan atau lampiran file, buat satu file HTML slide mandiri lengkap sebagai fallback dan jangan kembali ke outline.'
  ],
  format:[
    'Keluaran akhir: satu file presentasi yang dapat langsung diunduh dan dibuka sesuai Format keluaran.',
    'Untuk PowerPoint, hasil akhir harus berupa file .pptx yang berisi seluruh slide, tata letak, teks, visual, dan catatan pembicara bila format file mendukungnya.',
    'Gunakan nama file yang jelas dan aman, misalnya presentasi-[topik].pptx.',
    'Jangan mengawali respons dengan analisis atau outline. Setelah file terlampir, cukup tulis nama file dan keterangan singkat bahwa presentasi siap digunakan.'
  ]
},

/* ---------- Kategori 6: Tulisan & Konten ---------- */
{
  id:'artikel-esai', kategori:'tulisan', ikon:'✍️', nama:'Artikel / Esai / Refleksi',
  deskripsi:'Artikel informatif, opini, esai, sampai renungan / hikmah.',
  peran:'Anda adalah penulis artikel dan esai berpengalaman yang menulis dalam Bahasa Indonesia yang hidup, jujur, dan menyentuh pembacanya.',
  tugas:'Tuliskan satu tulisan yang lengkap dan siap dibaca berdasarkan spesifikasi berikut. Keluarkan langsung naskah final sesuai jenis tulisan yang dipilih, bukan outline atau analisis.',
  fields:[
    { i:'topikTulis', l:'Topik', j:'teks', m:'C', w:true, ph:'mis. Kesabaran dalam Mengajar', c:'Kesabaran dalam Mengajar' },
    { i:'jenisTulisan', l:'Jenis tulisan', j:'pilih', m:'C', w:true, o:['Artikel informatif','Opini','Esai','Refleksi pribadi','Hikmah & renungan'], c:'Refleksi pribadi' },
    { i:'pembacaTulis', l:'Pembaca', j:'teks', m:'C', w:true, ph:'mis. sesama guru dan orang tua', c:'sesama guru' },
    { i:'pesanUtama', l:'Pesan utama', j:'area', m:'C', w:true, ph:'Satu kalimat / paragraf pesan yang harus sampai ke pembaca…', c:'Kesabaran guru adalah fondasi rasa aman siswa untuk berani salah dan belajar.' },
    { i:'panjangTulis', l:'Panjang', j:'pilih', m:'C', o:['Pendek (±500 kata)','Sedang (±1.000 kata)','Panjang (±2.000 kata)'], c:'Sedang (±1.000 kata)' },
    { i:'gayaTulis2', l:'Gaya bahasa', j:'pilih', m:'C', o:['Santai','Formal','Akademis','Hangat & personal','Puitis'], c:'Hangat & personal' },
    { i:'bahan', l:'Bahan / pengalaman / kutipan yang harus masuk', j:'area', m:'D', ph:'Satu baris satu bahan…', c:'Pengalaman menghadapi siswa yang lambat memahami pecahan selama 3 pertemuan.' },
    { i:'penutup', l:'Penutup yang diinginkan', j:'teks', m:'D', ph:'mis. ajakan untuk refleksi diri pembaca', c:'Ajakan refleksi diri untuk pembaca' }
  ],
  aturan:[
    'Keluarkan hanya naskah final; jangan menulis analisis, outline, atau komentar proses di luar tulisan.',
    'Sesuaikan struktur dengan Jenis tulisan: artikel informatif memakai subjudul dan fakta, opini memakai alasan yang runtut, esai memakai tesis dan uraian, refleksi memakai suara pribadi, dan hikmah memakai renungan yang wajar.',
    'Pertahankan pesan utama sebagai benang merah dari pembuka sampai penutup.',
    'Gunakan panjang dan gaya bahasa yang dipilih serta paragraf yang nyaman dibaca oleh pembaca sasaran.',
    'Jangan mengarang kutipan, data, atau pengalaman pribadi; bila memerlukan contoh, gunakan contoh umum tanpa menyamarkannya sebagai fakta.'
  ],
  format:['Markdown siap baca dengan urutan: # Judul, pembuka yang menarik, isi terstruktur dengan ## subjudul bila relevan, lalu penutup yang sesuai jenis tulisan.']
},
{
  id:'cerita', kategori:'tulisan', ikon:'📖', nama:'Cerita / Cerpen',
  deskripsi:'Cerita pendek dengan tokoh, konflik, dan pesan moral yang jelas.',
  peran:'Anda adalah penulis cerita berpengalaman yang pandai membangun tokoh yang hidup dan alur yang mengalir.',
  tugas:'Tuliskan satu cerita yang lengkap berdasarkan spesifikasi berikut. Keluarkan langsung cerita final, bukan sinopsis, analisis tokoh, atau penjelasan proses kreatif.',
  fields:[
    { i:'genre', l:'Genre', j:'pilih', m:'C', w:true, o:['Fabel','Anak','Remaja','Inspiratif','Misteri','Fiksi ilmiah','Lainnya'], c:'Fabel' },
    { i:'tokoh', l:'Tokoh utama', j:'teks', m:'C', w:true, ph:'mis. Kancil yang sombong belajar rendah hati', c:'Kancil yang sombong' },
    { i:'latar', l:'Latar', j:'teks', m:'C', w:true, ph:'mis. hutan di tepi sungai, pagi hari', c:'hutan di tepi sungai' },
    { i:'konflik', l:'Konflik / masalah utama', j:'area', m:'C', w:true, ph:'Masalah apa yang dihadapi tokoh…', c:'Kesombongannya membuat teman-temannya menjauh saat ia benar-benar membutuhkan bantuan.' },
    { i:'moral', l:'Pesan moral', j:'teks', m:'C', w:true, ph:'mis. rendah hati dan menghargai teman', c:'rendah hati dan menghargai teman' },
    { i:'panjangCerita', l:'Panjang cerita', j:'pilih', m:'D', o:['Pendek (±500 kata)','Sedang (±1.000 kata)','Panjang (±2.000 kata)'], c:'Sedang (±1.000 kata)' },
    { i:'sudutCerita', l:'Sudut pandang', j:'pilih', m:'D', o:['Orang ketiga','Orang pertama'], c:'Orang ketiga' }
  ],
  aturan:[
    'Keluarkan hanya cerita final; jangan menambahkan sinopsis, analisis alur, atau komentar setelah cerita.',
    'Bangun alur yang utuh: pengenalan tokoh dan latar, pemicu masalah, usaha menghadapi konflik, titik balik, penyelesaian, dan perubahan tokoh.',
    'Tokoh utama, latar, konflik, dan pesan moral yang diberikan harus muncul nyata dalam cerita.',
    'Pesan moral harus terasa dari tindakan dan akibat dalam alur, bukan ditempel sebagai ceramah di akhir.',
    'Gunakan sudut pandang yang dipilih secara konsisten; dialog diberi paragraf sendiri dan setiap tokoh berbicara dengan suara yang mudah dibedakan.'
  ],
  format:['Cerita utuh dalam Markdown dengan # Judul, narasi dan dialog yang mengalir, lalu penutup cerita. Jangan menambahkan bagian "Analisis" atau "Pesan moral" terpisah kecuali diminta.']
},
{
  id:'konten-sosmed', kategori:'tulisan', ikon:'📱', nama:'Konten Media Sosial & Naskah Video',
  deskripsi:'Takarir, utas, teks siaran, dan naskah video pendek maupun panjang.',
  peran:'Anda adalah pembuat konten media sosial berpengalaman yang menulis dalam Bahasa Indonesia yang segar dan sesuai karakter tiap platform.',
  tugas:'Buatlah konten yang lengkap dan siap tayang berdasarkan spesifikasi berikut. Ikuti bentuk konten dan platform yang dipilih; keluarkan naskah final, bukan saran umum atau kalender konten.',
  fields:[
    { i:'platform', l:'Platform', j:'pilih', m:'C', w:true, o:['Instagram','TikTok','YouTube','Facebook','X (Twitter)','WhatsApp'], c:'Instagram' },
    { i:'topikKonten', l:'Topik / produk', j:'teks', m:'C', w:true, ph:'mis. tips belajar pecahan untuk orang tua', c:'tips belajar pecahan untuk orang tua' },
    { i:'bentuk', l:'Bentuk konten', j:'pilih', m:'C', w:true, o:['Takarir (caption)','Naskah video pendek','Naskah video panjang','Utas (thread)','Teks siaran WhatsApp'], c:'Takarir (caption)' },
    { i:'tujuanKonten', l:'Tujuan konten', j:'pilih', m:'C', w:true, o:['Edukasi','Hiburan','Promosi','Ajakan / pengumuman'], c:'Edukasi' },
    { i:'nada', l:'Gaya & nada', j:'pilih', m:'D', o:['Santai','Hangat','Lucu','Serius','Semangat'], c:'Hangat' },
    { i:'ctaKonten', l:'Ajakan bertindak', j:'teks', m:'D', ph:'mis. simpan unggahan ini, bagikan ke orang tua lain', c:'Simpan unggahan ini dan bagikan ke orang tua lain' },
    { i:'tagar', l:'Tagar (hashtag)', j:'pilih', m:'D', o:['Minta dibuatkan','Tidak perlu'], c:'Minta dibuatkan' }
  ],
  aturan:[
    'Keluarkan hanya konten final yang siap disalin; jangan mengawali dengan analisis strategi atau penjelasan proses.',
    'Sesuaikan panjang, gaya, dan ajakan dengan platform serta tujuan yang dipilih.',
    'Untuk Takarir, gunakan urutan Hook, isi, CTA bila ada, lalu hashtag bila diminta.',
    'Untuk Naskah video, gunakan tabel atau format per adegan yang memuat durasi, visual, dialog atau voice-over, teks layar, dan audio bila relevan.',
    'Untuk Utas, beri nomor pada setiap bagian dan pastikan tiap bagian tersambung dengan alur yang jelas.',
    'Untuk Teks siaran WhatsApp, gunakan pembuka, informasi utama, detail penting, dan CTA tanpa format yang terlalu rumit.',
    'Jangan membuat klaim, harga, tautan, atau fakta yang tidak diberikan pengguna; gunakan placeholder yang jelas bila diperlukan.'
  ],
  format:['Berikan konten siap salin-tempel. Gunakan heading sesuai bentuk: Caption, Naskah Video, Utas, atau Siaran WhatsApp. Sertakan hashtag hanya jika dipilih dan letakkan CTA pada posisi yang wajar.']
},

/* ---------- Kategori 7: Gambar & Desain ---------- */
{
  id:'prompt-gambar', kategori:'media', ikon:'🖼️', nama:'Gambar AI',
  deskripsi:'Gambar AI yang siap digunakan berdasarkan subjek, suasana, gaya, dan komposisi yang dipilih.',
  peran:'Anda adalah pembuat gambar AI yang menerjemahkan spesifikasi pengguna menjadi satu gambar yang jelas, menarik, dan sesuai tujuan.',
  tugas:'Buat satu gambar berdasarkan spesifikasi berikut. Hasil akhir harus berupa satu gambar yang siap digunakan, bukan prompt, brief, konsep, terjemahan, atau penjelasan.',
  fields:[
    { i:'subjek', l:'Subjek utama gambar', j:'teks', m:'C', w:true, ph:'mis. guru muda Indonesia tersenyum di depan kelas', c:'guru muda Indonesia tersenyum di depan kelas' },
    { i:'aksi', l:'Aksi / suasana', j:'teks', m:'C', w:true, ph:'mis. sedang menjelaskan pecahan di papan tulis', c:'sedang menjelaskan pecahan di papan tulis' },
    { i:'latarGambar', l:'Latar tempat', j:'teks', m:'C', w:true, ph:'mis. ruang kelas SMP yang terang', c:'ruang kelas SMP yang terang' },
    { i:'gayaGambar', l:'Gaya gambar', j:'pilih', m:'C', w:true, o:['Fotografi realistis','Ilustrasi datar','Kartun','Lukisan cat air','3D','Piksel','Anime'], c:'Ilustrasi datar' },
    { i:'rasio', l:'Rasio gambar', j:'pilih', m:'C', o:['16:9','1:1','9:16','4:3'], c:'16:9' },
    { i:'bahasaGambar', l:'Bahasa teks dalam gambar', j:'pilih', m:'C', w:true, o:['Indonesia','Inggris'], c:'Indonesia', h:'Pilih bahasa untuk teks yang terlihat di dalam gambar bila ada.' },
    { i:'cahaya', l:'Pencahayaan & suasana warna', j:'teks', m:'D', ph:'mis. cahaya pagi lembut, warna hangat', c:'cahaya pagi lembut, warna hangat' },
    { i:'hindariGambar', l:'Detail yang harus dihindari', j:'teks', m:'D', ph:'mis. teks acak, jari berlebih, buram', c:'teks acak, buram, proporsi wajah aneh' },
    { i:'alatGambar', l:'Target alat gambar', j:'pilih', m:'D', o:['Umum','Midjourney','DALL·E','Stable Diffusion','Ideogram','Leonardo'], c:'Umum' }
  ],
  aturan:[
    'Buat gambar secara langsung dan jangan mengeluarkan prompt, label, penjelasan, terjemahan, parameter, atau instruksi percakapan di luar gambar.',
    'Susun elemen visual berdasarkan subjek, aksi atau ekspresi, latar, komposisi, gaya, pencahayaan, warna, kualitas, dan rasio bila relevan.',
    'Gunakan detail yang diberikan pengguna tanpa menambahkan objek utama yang bertentangan.',
    'Gunakan detail yang harus dihindari sebagai batasan visual tanpa menuliskannya sebagai negative prompt di luar gambar.',
    'Jika gambar memuat teks, gunakan bahasa yang dipilih, ejaan yang benar, dan tata letak teks yang mudah dibaca.',
    'Jangan menampilkan brief, caption, alt text, rekomendasi, atau penjelasan setelah gambar.'
  ],
  format:['Keluaran akhir hanya satu gambar. Jangan memberikan teks atau respons tambahan di luar gambar.']
},
{
  id:'logo', kategori:'gambar', ikon:'🏷️', nama:'Logo',
  deskripsi:'Gambar logo yang siap digunakan berdasarkan identitas, simbol, kesan, dan warna yang dipilih.',
  peran:'Anda adalah desainer logo yang menerjemahkan identitas merek menjadi satu gambar logo yang sederhana, khas, dan mudah dikenali.',
  tugas:'Buat satu gambar logo berdasarkan spesifikasi berikut. Hasil akhir harus berupa gambar logo yang siap digunakan, bukan konsep tertulis, analisis, prompt, atau penjelasan.',
  fields:[
    { i:'merek', l:'Nama merek / usaha', j:'teks', m:'C', w:true, ph:'mis. Les Privat Atiga', c:'Les Privat Atiga' },
    { i:'bidang', l:'Bidang usaha', j:'teks', m:'C', w:true, ph:'mis. bimbingan belajar matematika', c:'bimbingan belajar matematika' },
    { i:'kesan', l:'Kesan yang diinginkan', j:'teks', m:'C', w:true, ph:'mis. terpercaya, modern, ramah', c:'terpercaya, modern, ramah' },
    { i:'jumlahKonsep', l:'Jumlah variasi logo', j:'angka', m:'C', ph:'mis. 1', c:'1' },
    { i:'simbol', l:'Bentuk / simbol idaman', j:'teks', m:'D', ph:'mis. pensil yang membentuk huruf A', c:'pensil membentuk huruf A' },
    { i:'warnaLogo', l:'Warna', j:'teks', m:'D', ph:'mis. indigo dan amber', c:'indigo dan amber' }
  ],
  aturan:[
    'Buat tepat sejumlah variasi logo sesuai kolom Jumlah variasi logo. Jika jumlahnya lebih dari satu, tampilkan semua variasi dalam satu gambar eksplorasi logo yang rapi.',
    'Setiap variasi harus berbeda pendekatan visual dan simbolik, bukan variasi kecil dari satu ide.',
    'Hubungkan bentuk, simbol, tipografi, dan warna dengan bidang usaha serta kesan yang diinginkan.',
    'Gunakan warna yang sesuai dengan bidang usaha dan kesan yang diinginkan.',
    'Pastikan logo tetap terbaca dalam ukuran kecil, versi satu warna, dan latar terang maupun gelap.',
    'Gunakan bentuk sederhana dan bersih tanpa mockup, watermark, teks acak, atau elemen dekoratif yang tidak diperlukan.',
    'Jangan menampilkan konsep, makna, palet warna, tipografi, prompt, caption, atau penjelasan di luar gambar.'
  ],
  format:['Keluaran akhir hanya satu gambar logo. Jangan memberikan teks atau respons tambahan di luar gambar.']
},
{
  id:'infografis', kategori:'media', ikon:'📈', nama:'Infografis',
  deskripsi:'Gambar infografis edukatif yang siap digunakan, dengan isi dan tata letak yang jelas.',
  peran:'Anda adalah pembuat gambar infografis edukatif yang menyajikan informasi dengan akurat, jelas, dan mudah dipahami.',
  tugas:'Buat satu gambar infografis lengkap berdasarkan spesifikasi berikut. Hasil akhir harus berupa satu gambar infografis yang siap digunakan, bukan brief desain, rancangan, naskah, atau penjelasan.',
  fields:[
    { i:'topikInfo', l:'Topik infografis', j:'teks', m:'C', w:true, ph:'mis. Unsur-unsur Lingkaran', c:'Unsur-unsur Lingkaran' },
    { i:'poinInfo', l:'Data / poin utama', j:'area', m:'C', w:true, ph:'Satu baris satu poin…', c:'Titik pusat\nJari-jari dan diameter\nBusur dan tali busur\nJuring dan tembereng' },
    { i:'pembacaInfo', l:'Pembaca', j:'teks', m:'C', w:true, ph:'mis. siswa SMP kelas VIII', c:'siswa SMP kelas VIII' },
    { i:'alurInfo', l:'Alur baca', j:'pilih', m:'D', o:['Atas ke bawah','Kiri ke kanan','Melingkar','Perbandingan dua sisi'], c:'Atas ke bawah' },
    { i:'gayaInfo', l:'Gaya visual', j:'pilih', m:'D', o:['Modern cerah','Minimalis','Kartun edukasi','Formal'], c:'Modern cerah' }
  ],
  aturan:[
    'Gunakan semua data atau poin utama yang diberikan dan jangan mengubah angka, istilah, urutan penting, atau fakta.',
    'Jika data numerik tidak diberikan, jangan menambahkan statistik atau persentase buatan.',
    'Ikuti alur baca yang dipilih melalui tata letak visual gambar.',
    'Masukkan teks yang diperlukan langsung ke dalam gambar secara singkat, jelas, dan menggunakan Bahasa Indonesia.',
    'Pastikan setiap bagian memiliki fungsi visual yang jelas: judul, isi, ikon atau ilustrasi, warna, dan hubungan dengan bagian berikutnya.',
    'Jangan menampilkan atau mengeluarkan brief desain, outline, catatan desain, caption, alt text, prompt gambar, rekomendasi, atau penjelasan di luar gambar.'
  ],
  format:['Keluaran akhir hanya satu gambar infografis. Jangan memberikan teks atau respons tambahan di luar gambar.']
},

/* ---------- Kategori 8: Prompt Bebas ---------- */
{
  id:'prompt-bebas', kategori:'umum', ikon:'🧩', nama:'Prompt Bebas Universal',
  deskripsi:'Kerangka universal Peran → Konteks → Tugas → Aturan → Format Hasil, untuk kebutuhan apa pun.',
  peran:'', /* peran diambil dari kolom pengguna */
  tugas:'', /* tugas diambil dari kolom pengguna */
  fields:[
    { i:'peranBebas', l:'Peran AI', j:'teks', m:'C', w:true, ph:'mis. Anda adalah editor berpengalaman…', c:'Anda adalah guru matematika SMP berpengalaman' },
    { i:'konteksBebas', l:'Konteks / latar belakang', j:'area', m:'C', w:true, ph:'Situasi, siapa kamu, untuk siapa hasilnya…', c:'Saya mengajar kelas VII dengan 32 siswa berkemampuan beragam.' },
    { i:'tugasBebas', l:'Tugas utama', j:'area', m:'C', w:true, ph:'Apa persisnya yang harus dikerjakan AI…', c:'Buatkan 5 soal cerita tentang bilangan bulat dari kehidupan sehari-hari.' },
    { i:'formatBebas', l:'Format hasil', j:'pilih', m:'C', w:true, o:['Paragraf','Poin-poin','Tabel','Langkah bernomor','Dokumen lengkap'], c:'Poin-poin' },
    { i:'langkahBebas', l:'Langkah pengerjaan', j:'area', m:'D', ph:'Urutan langkah yang harus diikuti AI…', c:'Mulai dari yang termudah, lalu naik tingkat kesulitannya.' },
    { i:'aturanBebas', l:'Aturan & batasan', j:'area', m:'D', aturan:true, ph:'Satu baris satu aturan…', c:'Gunakan bilangan antara -20 sampai 20\nSertakan kunci jawaban terpisah' },
    { i:'contohBebas', l:'Contoh hasil yang diinginkan', j:'area', m:'D', ph:'Tempel contoh gaya / bentuk hasil…', c:'Contoh: "Suhu di kota A adalah −4°C…" (gaya soal seperti ini)' },
    { i:'nadaBebas', l:'Nada & gaya jawaban', j:'pilih', m:'D', o:['Netral','Ramah','Formal','Santai','Tegas'], c:'Ramah' }
  ],
  aturan:[
    'Kerjakan tugas utama secara langsung berdasarkan Peran, Konteks, dan Tugas yang diberikan.',
    'Ikuti semua Aturan & batasan pengguna tanpa mengabaikannya atau menambah batasan yang bertentangan.',
    'Gunakan Format hasil yang dipilih sebagai struktur keluaran wajib; jangan mengubahnya menjadi artikel bila bukan itu yang dipilih.',
    'Keluarkan hanya hasil akhir yang dapat digunakan. Tambahkan asumsi singkat hanya jika memang diperlukan untuk menyelesaikan tugas.',
    'Jika contoh hasil diberikan, tiru struktur dan tingkat kedetailannya tanpa menyalin isi yang tidak relevan.'
  ],
  format:['Awali langsung dengan hasil sesuai pilihan Format hasil. Jangan memberikan pembuka, analisis proses, atau penutup tambahan di luar format yang dipilih.']
}
];

/* Metadata prompt: sumber dipertahankan apa adanya; kebutuhan dan preferensi dipisahkan dari fakta. */
const FIELD_METADATA = {
  cp:{ promptRole:'source', preserveWhitespace:true },
  konteks:{ promptRole:'source', preserveWhitespace:true, warnIfEmpty:true },
  materiSumber:{ promptRole:'source', preserveWhitespace:true },
  ruangLingkup:{ promptRole:'source', preserveWhitespace:true },
  data:{ promptRole:'source', preserveWhitespace:true },
  dataSiswaNilai:{ promptRole:'source', preserveWhitespace:true },
  materiLkpd:{ promptRole:'source' },
  topik:{ promptRole:'source' },
  fiturWajib:{ promptRole:'requirement' },
  fiturNilai:{ promptRole:'requirement' },
  fiturAbsensi:{ promptRole:'requirement' },
  fiturRubrik:{ promptRole:'requirement' },
  fiturUmpanBalik:{ promptRole:'requirement' }
};
for (const template of TEMPLATE){
  for (const field of template.fields || []){
    if (FIELD_METADATA[field.i]) Object.assign(field, FIELD_METADATA[field.i]);
  }
}

const OUTPUT_CONTRACTS = {
  'modul-ajar': { requiredSections:['A. Identifikasi','B. Desain Pembelajaran','C. Pengalaman Belajar','D. Asesmen Pembelajaran'] },
  'lkpd': { requiredSections:['Identitas','Tujuan','Petunjuk','Kegiatan','Refleksi'] },
  'bank-soal': { requiredSections:['Petunjuk','Soal','Kunci Jawaban'] },
  'kuis-interaktif': { type:'single-code-block', language:'HTML' },
  'slide-presentasi': { requiredSections:['file presentasi final'] },
  'mpi-lengkap': { type:'single-code-block', language:'HTML' },
  'simulasi-interaktif': { type:'single-code-block', language:'HTML' },
  'game-edukasi': { type:'single-code-block', language:'HTML' },
  'aplikasi-web': { type:'single-code-block', language:'HTML' },
  'website-satu-halaman': { type:'single-code-block', language:'HTML' },
  'prompt-gambar': { requiredSections:['prompt gambar final'] },
  'infografis': { requiredSections:['prompt infografis final'] }
};
for (const template of TEMPLATE){
  if (OUTPUT_CONTRACTS[template.id]) template.outputContract = OUTPUT_CONTRACTS[template.id];
}

/* Katalog utama yang tampil di UI. Template lama tetap berada di data untuk kompatibilitas draf, tetapi tidak memenuhi layar pilihan. */
const ID_TEMPLATE_UTAMA = [
  'modul-ajar', 'lkpd', 'slide-presentasi',
  'bank-soal', 'kuis-interaktif', 'rubrik-penilaian', 'rekap-nilai',
  'absensi-jurnal', 'umpan-balik-siswa',
  'mpi-lengkap', 'simulasi-interaktif', 'game-edukasi',
  'prompt-gambar', 'infografis',
  'aplikasi-web', 'website-satu-halaman', 'prompt-bebas'
];
const TEMPLATE_TERSEDIA = ID_TEMPLATE_UTAMA.map(id => {
  const template = TEMPLATE.find(t => t.id === id);
  if (!template) throw new Error('Template utama tidak ditemukan: ' + id);
  return template;
});

function validasiKatalog(){
  const jenisField = new Set(['teks','area','pilih','centang','angka']);
  const ids = new Set();
  for (const template of TEMPLATE_TERSEDIA){
    if (ids.has(template.id)) throw new Error('ID template duplikat: ' + template.id);
    ids.add(template.id);
    if (!template.nama || !Array.isArray(template.fields) || !Array.isArray(template.format)){
      throw new Error('Struktur template tidak lengkap: ' + template.id);
    }
    const fieldIds = new Set();
    for (const field of template.fields){
      if (!field.i || fieldIds.has(field.i)) throw new Error('ID kolom duplikat atau kosong pada: ' + template.id);
      if (!jenisField.has(field.j) || !['C','D'].includes(field.m)){
        throw new Error('Jenis atau mode kolom tidak valid pada: ' + template.id + '/' + field.i);
      }
      if ((field.j === 'pilih' || field.j === 'centang') && !Array.isArray(field.o)){
        throw new Error('Pilihan kolom tidak valid pada: ' + template.id + '/' + field.i);
      }
      fieldIds.add(field.i);
    }
  }
}
validasiKatalog();

/* Kolom umum untuk semua template (di luar kolom khusus template) */
const KOLOM_UMUM = [
  { i:'__detail', l:'Tingkat detail hasil', j:'pilih', m:'C', o:['Ringkas','Standar','Sangat detail'], c:'Standar' },
  { i:'__sikap', l:'Sikap AI bila ada yang kurang jelas', j:'pilih', m:'D', o:['Langsung kerjakan dengan asumsi terbaik','Tanya dulu sebelum mengerjakan'], c:'Langsung kerjakan dengan asumsi terbaik' }
];

/* ---------------- 2) MESIN PENYUSUN PROMPT ---------------- */

function buatPrompt(t, vals, umum, targetId, mode = 'detail'){
  return globalThis.ATIGA_ENGINE.buatPrompt(t, vals, umum, targetId, mode);
}

/* Ekspos untuk pengujian (tidak berpengaruh di peramban) */
if (typeof globalThis !== 'undefined'){
  globalThis.ATIGA = {
    KATEGORI, TARGET_AI, TEMPLATE: TEMPLATE_TERSEDIA, TEMPLATE_LENGKAP: TEMPLATE, KOLOM_UMUM,
    ...globalThis.ATIGA_ENGINE
  };
}

/* ---------------- 3) UI (hanya di peramban) ---------------- */
if (typeof document !== 'undefined'){

const $ = id => document.getElementById(id);
const KUNCI_TEMA = 'atiga-prompter-tema';
const KUNCI_PUSTAKA = 'atiga-prompter-pustaka';
const KUNCI_DRAF = 'atiga-prompter-draf';
const KUNCI_PILIHAN = 'atiga-prompter-pilihan';
const KUNCI_VERSI_DATA = 'atiga-prompter-versi-data';
const VERSI_ENGINE = '2';
const STORAGE = globalThis.ATIGA_STORAGE;
const { VERSI_DATA, BATAS_UKURAN_IMPOR, bacaJSON, tulisJSON, normalisasiDraf } = STORAGE;

function laporkanGagalSimpan(){
  if (!state.peringatanPenyimpanan){
    state.peringatanPenyimpanan = true;
    toast('Penyimpanan lokal gagal. Ekspor Pustaka agar data dapat dicadangkan.');
  }
}
function normalisasiPustaka(data){
  return STORAGE.normalisasiPustaka(data, TARGET_AI);
}

const state = {
  kategori: 'materi',
  templateId: 'modul-ajar',
  mode: 'cepat',
  target: 'universal',
  nilai: {},          // nilai kolom template aktif: { idKolom: nilai }
  umum: {},           // nilai kolom umum template aktif
  draf: normalisasiDraf(bacaJSON(KUNCI_DRAF, {})),
  pustaka: normalisasiPustaka(bacaJSON(KUNCI_PUSTAKA, [])),
  urutkanPustaka: 'terbaru',
  pratinjauManual: false,
  sudahTersimpan: false,
  peringatanPenyimpanan: false
};

function migrasiDataLokal(){
  const versiLama = Number(bacaJSON(KUNCI_VERSI_DATA, 0));
  if (versiLama >= VERSI_DATA) return;
  state.draf = normalisasiDraf(state.draf);
  state.pustaka = normalisasiPustaka(state.pustaka);
  const drafTersimpan = tulisJSON(KUNCI_DRAF, state.draf);
  const pustakaTersimpan = tulisJSON(KUNCI_PUSTAKA, state.pustaka);
  const versiTersimpan = tulisJSON(KUNCI_VERSI_DATA, VERSI_DATA);
  if (!drafTersimpan || !pustakaTersimpan || !versiTersimpan) laporkanGagalSimpan();
}

const pilihanLama = bacaJSON(KUNCI_PILIHAN, null);
if (pilihanLama){
  if (KATEGORI.some(k => k.id === pilihanLama.kategori)) state.kategori = pilihanLama.kategori;
  const templateLama = TEMPLATE_TERSEDIA.find(t => t.id === pilihanLama.templateId);
  if (templateLama){
    state.templateId = templateLama.id;
    state.kategori = templateLama.kategori;
  }
  if (pilihanLama.mode === 'detail') state.mode = 'detail';
  if (TARGET_AI.some(a => a.id === pilihanLama.target)) state.target = pilihanLama.target;
}
const templateAktif = () => TEMPLATE_TERSEDIA.find(t => t.id === state.templateId) || TEMPLATE_TERSEDIA[0];
const targetAktif = () => TARGET_AI.find(a => a.id === state.target) || TARGET_AI[0];

function simpanPilihan(){
  if (!tulisJSON(KUNCI_PILIHAN, { kategori: state.kategori, templateId: state.templateId, mode: state.mode, target: state.target })) laporkanGagalSimpan();
}
function muatDrafTemplate(){
  const d = state.draf[state.templateId] || {};
  state.nilai = Object.assign({}, d.nilai || {});
  state.umum = Object.assign({ __detail: 'Standar', __sikap: 'Langsung kerjakan dengan asumsi terbaik' }, d.umum || {});
}
let timerSimpanDraf = null;
function tulisDrafSekarang(){
  if (!tulisJSON(KUNCI_DRAF, state.draf)) laporkanGagalSimpan();
}
function simpanDraf(segera = false){
  state.draf[state.templateId] = { nilai: state.nilai, umum: state.umum };
  clearTimeout(timerSimpanDraf);
  if (segera){
    tulisDrafSekarang();
    return;
  }
  timerSimpanDraf = setTimeout(tulisDrafSekarang, 400);
}
window.addEventListener('pagehide', () => simpanDraf(true));

/* ---------- Pemberitahuan ---------- */
let timerToast = null;
function toast(pesan){
  const el = $('pemberitahuan');
  el.textContent = pesan;
  el.classList.add('tampil');
  clearTimeout(timerToast);
  timerToast = setTimeout(() => el.classList.remove('tampil'), 3200);
}
migrasiDataLokal();

/* ---------- Tema ---------- */
function terapkanTema(gelap){
  if (gelap) document.documentElement.setAttribute('data-theme', 'gelap');
  else document.documentElement.removeAttribute('data-theme');
  $('tombolTema').textContent = gelap ? '☀️ Terang' : '🌙 Gelap';
  try {
    localStorage.setItem(KUNCI_TEMA, gelap ? 'gelap' : 'terang');
  } catch (e) {
    laporkanGagalSimpan();
  }
}
(function initTema(){
  let tema = null;
  try { tema = localStorage.getItem(KUNCI_TEMA); } catch (e) {}
  const gelap = tema ? tema === 'gelap'
    : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  terapkanTema(!!gelap);
})();
$('tombolTema').addEventListener('click', () => {
  terapkanTema(document.documentElement.getAttribute('data-theme') !== 'gelap');
});

/* ---------- Kategori & template ---------- */
function renderKategori(){
  const wadah = $('gridKategori');
  wadah.innerHTML = '';
  const kata = $('cariTemplate').value.trim();
  for (const k of KATEGORI){
    const jumlah = TEMPLATE_TERSEDIA.filter(t => t.kategori === k.id).length;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'kartu-kategori' + (!kata && k.id === state.kategori ? ' aktif' : '');
    b.setAttribute('role', 'listitem');
    b.innerHTML = '<span class="ikon">' + k.ikon + '</span><strong>' + k.nama + '</strong><small>' + k.deskripsi + ' · ' + jumlah + ' template</small>';
    b.addEventListener('click', () => {
      state.kategori = k.id;
      const pertama = TEMPLATE_TERSEDIA.find(t => t.kategori === k.id);
      if (pertama) pilihTemplate(pertama.id);
      renderKategori(); renderDaftarTemplate(); simpanPilihan();
    });
    wadah.appendChild(b);
  }
}
function renderDaftarTemplate(){
  const wadah = $('daftarTemplate');
  const kata = $('cariTemplate').value.trim().toLowerCase();
  wadah.innerHTML = '';
  let daftar;
  if (kata){
    daftar = TEMPLATE_TERSEDIA.filter(t => (t.nama + ' ' + t.deskripsi).toLowerCase().includes(kata));
    $('labelTemplate').textContent = '— hasil pencarian "' + $('cariTemplate').value.trim() + '"';
  } else {
    daftar = TEMPLATE_TERSEDIA.filter(t => t.kategori === state.kategori);
    const k = KATEGORI.find(x => x.id === state.kategori);
    $('labelTemplate').textContent = k ? '— ' + k.nama : '';
  }
  if (!daftar.length){
    wadah.innerHTML = '<p class="kosong">Tidak ada template yang cocok. Coba kata kunci lain.</p>';
    return;
  }
  for (const t of daftar){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'kartu-template' + (t.id === state.templateId ? ' aktif' : '');
    b.innerHTML = '<span class="ikon">' + t.ikon + '</span><span><strong>' + t.nama + '</strong><small>' + t.deskripsi + '</small></span>';
    b.addEventListener('click', () => { pilihTemplate(t.id); renderDaftarTemplate(); renderKategori(); });
    wadah.appendChild(b);
  }
}
function pilihTemplate(id){
  const t = TEMPLATE_TERSEDIA.find(x => x.id === id);
  if (!t) return;
  state.templateId = id;
  state.kategori = t.kategori;
  state.pratinjauManual = false;
  state.sudahTersimpan = false;
  muatDrafTemplate();
  renderForm();
  simpanPilihan();
}
$('cariTemplate').addEventListener('input', () => { renderKategori(); renderDaftarTemplate(); });

/* ---------- Mode & target ---------- */
function renderMode(){
  $('modeCepat').classList.toggle('aktif', state.mode === 'cepat');
  $('modeDetail').classList.toggle('aktif', state.mode === 'detail');
  $('modeCepat').setAttribute('aria-pressed', String(state.mode === 'cepat'));
  $('modeDetail').setAttribute('aria-pressed', String(state.mode === 'detail'));
  $('petunjukMode').textContent = state.mode === 'cepat'
    ? 'Mode Cepat: hanya kolom inti. Ganti ke Detail bila ingin hasil yang lebih kaya.'
    : 'Mode Detail: semua kolom tampil, termasuk kolom tambahan bertanda Detail.';
}
$('modeCepat').addEventListener('click', () => { state.mode = 'cepat'; renderMode(); renderForm(); simpanPilihan(); });
$('modeDetail').addEventListener('click', () => { state.mode = 'detail'; renderMode(); renderForm(); simpanPilihan(); });

function renderTarget(){
  const wadah = $('chipTarget');
  wadah.innerHTML = '';
  for (const a of TARGET_AI){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (a.id === state.target ? ' aktif' : '');
    b.setAttribute('aria-pressed', String(a.id === state.target));
    b.textContent = a.nama;
    b.addEventListener('click', () => {
      state.target = a.id;
      state.pratinjauManual = false;
      state.sudahTersimpan = false;
      renderTarget(); perbaruiPreview(); simpanPilihan();
    });
    wadah.appendChild(b);
  }
  $('petunjukTarget').textContent = targetAktif().petunjuk;
}

/* ---------- Formulir ---------- */
function kolomTerlihat(f){
  return f.m === 'C' || state.mode === 'detail';
}
function buatInput(f, nilaiAwal, wadahNilai){
  const bungkus = document.createElement('div');
  bungkus.className = 'kolom';
  bungkus.dataset.kolom = f.i;
  const idEl = 'f-' + f.i;
  const labelAman = escapeHtml(f.l);
  const placeholderAman = escapeHtml(f.ph || '');
  const pembukaLabel = f.j === 'centang' ? '<div class="label-kolom">' : '<label for="' + idEl + '">';
  const penutupLabel = f.j === 'centang' ? '</div>' : '</label>';
  let html = pembukaLabel + labelAman +
    (f.w ? ' <span class="wajib" title="Wajib diisi">*</span>' : '') +
    (f.m === 'D' ? '<span class="mode-lencana">Detail</span>' : '') + penutupLabel;

  if (f.j === 'teks' || f.j === 'angka'){
    html += '<input id="' + idEl + '" type="' + (f.j === 'angka' ? 'number' : 'text') + '" placeholder="' + placeholderAman + '">';
  } else if (f.j === 'area'){
    html += '<textarea id="' + idEl + '" rows="3" placeholder="' + placeholderAman + '"></textarea>';
  } else if (f.j === 'pilih'){
    html += '<select id="' + idEl + '"><option value="">— pilih —</option>' +
      f.o.map(o => '<option value="' + escapeHtml(o) + '">' + escapeHtml(o) + '</option>').join('') + '</select>';
  } else if (f.j === 'centang'){
    html += '<div class="kotak-centang" id="' + idEl + '">' +
      f.o.map((o, idx) => '<label><input type="checkbox" value="' + escapeHtml(o) + '" data-idx="' + idx + '"> ' + escapeHtml(o) + '</label>').join('') + '</div>';
  }
  if (f.h) html += '<p class="contoh">' + escapeHtml(f.h) + '</p>';
  else if (f.c && f.j !== 'centang') html += '<p class="contoh">Contoh: ' + escapeHtml(String(f.c).split('\n')[0]) + '</p>';
  if (f.w) html += '<p class="pesan-error" id="error-' + idEl + '" role="alert" hidden></p>';
  bungkus.innerHTML = html;

  const el = bungkus.querySelector('#' + CSS.escape(idEl));
  if (f.w){
    el.setAttribute('aria-required', 'true');
    el.setAttribute('aria-describedby', 'error-' + idEl);
  }
  if (f.j === 'centang'){
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', f.l);
    const terpilih = Array.isArray(nilaiAwal) ? nilaiAwal : [];
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = terpilih.includes(cb.value);
      cb.addEventListener('change', () => {
        wadahNilai[f.i] = [...el.querySelectorAll('input[type="checkbox"]:checked')].map(x => x.value);
        bungkus.classList.remove('kurang');
        el.removeAttribute('aria-invalid');
        const pesanError = bungkus.querySelector('.pesan-error');
        if (pesanError) pesanError.hidden = true;
        state.pratinjauManual = false;
        state.sudahTersimpan = false;
        simpanDraf(); perbaruiPreview(); perbaruiStatusForm();
      });
    });
  } else {
    el.value = nilaiAwal !== undefined && nilaiAwal !== null ? nilaiAwal : '';
    el.addEventListener('input', () => {
      wadahNilai[f.i] = el.value;
      bungkus.classList.remove('kurang');
      el.removeAttribute('aria-invalid');
      const pesanError = bungkus.querySelector('.pesan-error');
      if (pesanError) pesanError.hidden = true;
      state.pratinjauManual = false;
      state.sudahTersimpan = false;
      simpanDraf(); perbaruiPreview(); perbaruiStatusForm();
    });
  }
  return bungkus;
}

function renderForm(){
  const t = templateAktif();
  $('namaTemplate').textContent = t.ikon + ' ' + t.nama;
  $('deskripsiTemplate').textContent = t.deskripsi;
  const form = $('formTemplate');
  form.innerHTML = '';

  const renderFields = (fields, wadahForm, wadahNilai) => {
    let grupKini = null, fieldsetKini = null;
    for (const f of fields){
    if (!kolomTerlihat(f)) continue;
    if (f.g){
      if (f.g !== grupKini){
        grupKini = f.g;
        fieldsetKini = document.createElement('fieldset');
        fieldsetKini.className = 'grup-kolom';
        fieldsetKini.innerHTML = '<legend>' + f.g + '</legend>';
        wadahForm.appendChild(fieldsetKini);
      }
      fieldsetKini.appendChild(buatInput(f, wadahNilai[f.i], wadahNilai));
    } else {
      wadahForm.appendChild(buatInput(f, wadahNilai[f.i], wadahNilai));
    }
    }
  };

  renderFields(t.fields.filter(f => f.m === 'C'), form, state.nilai);

  const fsUmum = document.createElement('fieldset');
  fsUmum.className = 'grup-kolom';
  fsUmum.innerHTML = '<legend>Pengaturan Hasil</legend>';
  renderFields(KOLOM_UMUM.filter(f => f.m === 'C'), fsUmum, state.umum);
  form.appendChild(fsUmum);

  const fieldsDetail = t.fields.filter(f => f.m === 'D');
  const umumDetail = KOLOM_UMUM.filter(f => f.m === 'D');
  if (state.mode === 'detail' && (fieldsDetail.length || umumDetail.length)){
    const detail = document.createElement('details');
    detail.className = 'detail-lanjutan';
    detail.open = true;
    detail.innerHTML = '<summary>🧩 Pengaturan detail (' + (fieldsDetail.length + umumDetail.length) + ' kolom tambahan)</summary>';
    const isi = document.createElement('div');
    isi.className = 'detail-lanjutan-isi';
    renderFields(fieldsDetail, isi, state.nilai);
    if (umumDetail.length){
      const fsDetail = document.createElement('fieldset');
      fsDetail.className = 'grup-kolom';
      fsDetail.innerHTML = '<legend>Preferensi tambahan</legend>';
      renderFields(umumDetail, fsDetail, state.umum);
      isi.appendChild(fsDetail);
    }
    detail.appendChild(isi);
    form.appendChild(detail);
  }

  perbaruiPreview();
  perbaruiStatusForm();
}

function nilaiTerisi(f, wadahNilai){
  const nilai = wadahNilai[f.i];
  return f.j === 'centang'
    ? Array.isArray(nilai) && nilai.length > 0
    : String(nilai || '').trim().length > 0;
}

function perbaruiStatusForm(){
  const t = templateAktif();
  const wajib = [...t.fields, ...KOLOM_UMUM].filter(f => f.w && kolomTerlihat(f));
  const terisi = wajib.filter(f => nilaiTerisi(f, t.fields.includes(f) ? state.nilai : state.umum)).length;
  const lengkap = terisi === wajib.length;
  $('statusForm').textContent = lengkap
    ? '✓ Semua kolom wajib terisi'
    : terisi + ' dari ' + wajib.length + ' kolom wajib';
  $('statusForm').classList.toggle('lengkap', lengkap);
  perbaruiProgres(lengkap);
}

function perbaruiProgres(formLengkap){
  const tahapAktif = state.sudahTersimpan && formLengkap ? 4 : formLengkap ? 3 : 2;
  document.querySelectorAll('.progres-item').forEach(item => {
    const nomor = Number(item.dataset.langkah);
    item.classList.toggle('aktif', nomor === tahapAktif);
    item.classList.toggle('selesai', nomor < tahapAktif);
    if (nomor === tahapAktif) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  document.querySelectorAll('.progres-garis').forEach((garis, idx) => {
    garis.classList.toggle('selesai', idx + 1 < tahapAktif);
  });
}

/* ---------- Preview ---------- */
function perbaruiPreview(){
  if (state.pratinjauManual) { perbaruiHitungan(); perbaruiStruktur(); perbaruiKualitas(); return; }
  const teks = buatPrompt(templateAktif(), state.nilai, state.umum, state.target, state.mode);
  $('areaPreview').value = teks;
  perbaruiHitungan();
  perbaruiStruktur();
  perbaruiKualitas();
  $('statusSalin').textContent = '';
}
function perbaruiHitungan(){
  $('jumlahKarakter').textContent = $('areaPreview').value.length.toLocaleString('id-ID') + ' karakter';
  $('targetPreview').textContent = targetAktif().nama;
  $('statusPreview').textContent = state.pratinjauManual ? 'Diedit manual' : 'Otomatis';
  $('tombolPulihkan').hidden = !state.pratinjauManual;
}
function perbaruiStruktur(){
  const wadah = $('panelStruktur');
  wadah.innerHTML = '';

  if (state.pratinjauManual){
    const bagian = document.createElement('section');
    bagian.className = 'struktur-blok';
    const h3 = document.createElement('h3');
    h3.textContent = 'Pratinjau manual';
    const p = document.createElement('p');
    p.textContent = $('areaPreview').value;
    bagian.append(h3, p);
    wadah.appendChild(bagian);
    return;
  }

  const blok = globalThis.ATIGA_ENGINE.susunBlok(templateAktif(), state.nilai, state.umum, state.mode);
  const daftar = [
    ['Peran', blok.peran], ['Konteks', blok.konteks], ['Tugas', blok.tugas],
    ['Sumber data', blok.sumber.join('\n')], ['Kebutuhan wajib', blok.kebutuhan.join('\n')],
    ['Preferensi', blok.preferensi.join('\n')],
    ['Spesifikasi', blok.spesifikasi.join('\n')], ['Aturan wajib', blok.aturan.join('\n')],
    ['Format hasil', blok.format.join('\n')]
  ];
  daftar.filter(([, isi]) => isi).forEach(([judul, isi]) => {
    const bagian = document.createElement('section');
    bagian.className = 'struktur-blok';
    const h3 = document.createElement('h3');
    h3.textContent = judul;
    const p = document.createElement('p');
    p.textContent = isi;
    bagian.append(h3, p);
    wadah.appendChild(bagian);
  });
}
function hasilLintPrompt(){
  return globalThis.ATIGA_LINT.lintPrompt({
    template: templateAktif(),
    values: state.nilai,
    common: Object.assign({}, state.umum, { __fields: KOLOM_UMUM }),
    mode: state.mode,
    targetId: state.target,
    text: $('areaPreview').value,
    targets: TARGET_AI
  });
}
function perbaruiKualitas(){
  const hasil = hasilLintPrompt();
  const el = $('statusKualitas');
  const pesan = [...hasil.errors.map(item => '❌ ' + item), ...hasil.warnings.map(item => '⚠️ ' + item)];
  el.hidden = pesan.length === 0;
  el.textContent = pesan.join(' ');
  el.classList.toggle('ada-error', hasil.errors.length > 0);
  el.classList.toggle('ada-peringatan', hasil.errors.length === 0 && hasil.warnings.length > 0);
  return hasil;
}
function pilihTabPreview(tab){
  const promptAktif = tab === 'prompt';
  $('tabPrompt').classList.toggle('aktif', promptAktif);
  $('tabStruktur').classList.toggle('aktif', !promptAktif);
  $('tabPrompt').setAttribute('aria-selected', String(promptAktif));
  $('tabStruktur').setAttribute('aria-selected', String(!promptAktif));
  $('panelPrompt').hidden = !promptAktif;
  $('panelStruktur').hidden = promptAktif;
}
$('tabPrompt').addEventListener('click', () => pilihTabPreview('prompt'));
$('tabStruktur').addEventListener('click', () => pilihTabPreview('struktur'));
$('tombolPulihkan').addEventListener('click', () => {
  state.pratinjauManual = false;
  perbaruiPreview();
  toast('Pratinjau otomatis dipulihkan.');
});
$('areaPreview').addEventListener('input', () => {
  state.pratinjauManual = true;
  state.sudahTersimpan = false;
  perbaruiHitungan();
  perbaruiStruktur();
  perbaruiKualitas();
  perbaruiStatusForm();
});

/* ---------- Validasi ---------- */
function validasi(){
  const t = templateAktif();
  const kurang = [];
  document.querySelectorAll('.kolom').forEach(kolom => {
    kolom.classList.remove('kurang');
    const kontrol = kolom.querySelector('input, select, textarea');
    if (kontrol) kontrol.removeAttribute('aria-invalid');
    const pesanError = kolom.querySelector('.pesan-error');
    if (pesanError) pesanError.hidden = true;
  });
  const periksa = (f, wadahNilai) => {
    if (!f.w || !kolomTerlihat(f)) return;
    const v = wadahNilai[f.i];
    const kosong = f.j === 'centang' ? !(Array.isArray(v) && v.length) : !String(v || '').trim();
    if (kosong){
      kurang.push(f.l);
      const el = document.querySelector('[data-kolom="' + f.i + '"]');
      if (el){
        el.classList.add('kurang');
        const kontrol = el.querySelector('input, select, textarea');
        if (kontrol) kontrol.setAttribute('aria-invalid', 'true');
        const pesanError = el.querySelector('.pesan-error');
        if (pesanError){
          pesanError.textContent = 'Kolom ini wajib diisi.';
          pesanError.hidden = false;
        }
      }
    }
  };
  t.fields.forEach(f => periksa(f, state.nilai));
  KOLOM_UMUM.forEach(f => periksa(f, state.umum));
  if (kurang.length){
    toast('Masih ada kolom wajib yang kosong: ' + kurang[0] + (kurang.length > 1 ? ' dan ' + (kurang.length - 1) + ' lainnya.' : '.'));
    const el = document.querySelector('.kolom.kurang');
    if (el){
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const kontrol = el.querySelector('input, select, textarea');
      if (kontrol) kontrol.focus({ preventScroll: true });
    }
    return false;
  }
  const kualitas = perbaruiKualitas();
  if (kualitas.errors.length){
    toast(kualitas.errors[0]);
    return false;
  }
  return true;
}

/* ---------- Salin & kirim ---------- */
async function salinTeks(teks){
  try { await navigator.clipboard.writeText(teks); return true; }
  catch (e) {
    const ta = $('areaPreview');
    ta.focus(); ta.select();
    try { return document.execCommand('copy'); } catch (e2) { return false; }
  }
}
async function salinPromptUtama(){
  if (!validasi()) return;
  const ok = await salinTeks($('areaPreview').value);
  $('statusSalin').textContent = ok ? '✅ Prompt tersalin — tempel (Ctrl+V) di AI tujuanmu.' : '';
  toast(ok ? 'Prompt berhasil disalin.' : 'Gagal menyalin otomatis — blok teks pratinjau lalu salin manual (Ctrl+C).');
}
$('tombolSalin').addEventListener('click', salinPromptUtama);
$('tombolSalinMobile').addEventListener('click', salinPromptUtama);
$('tombolPreviewMobile').addEventListener('click', () => {
  $('kartuPreview').scrollIntoView({ behavior: 'smooth', block: 'start' });
  pilihTabPreview('prompt');
  setTimeout(() => $('areaPreview').focus({ preventScroll: true }), 250);
});

function renderPilihKirimAI(){
  const pilih = $('pilihKirimAI');
  pilih.innerHTML = '<option value="">🚀 Kirim ke AI ▾</option>';
  for (const a of TARGET_AI){
    if (!a.url) continue;
    const option = document.createElement('option');
    option.value = a.id;
    option.textContent = '🚀 ' + a.nama;
    pilih.appendChild(option);
  }
}
async function kirimKeAI(a){
  if (!validasi()) return;
  const teks = $('areaPreview').value;
  const tersalin = await salinTeks(teks);
  if (tersalin) {
    toast('Prompt tersalin — tempel (Ctrl+V) di tab ' + a.nama + ' yang terbuka.');
  } else {
    toast('Situs ' + a.nama + ' akan dibuka. Clipboard gagal; salin prompt dari pratinjau secara manual.');
  }
  const tab = window.open(a.url, '_blank', 'noopener,noreferrer');
  if (!tab) toast('Popup diblokir peramban. Izinkan popup untuk membuka ' + a.nama + '.');
}
$('pilihKirimAI').addEventListener('change', e => {
  const a = TARGET_AI.find(target => target.id === e.target.value);
  if (!a) return;
  kirimKeAI(a);
  e.target.value = '';
});

/* ---------- Isi contoh & reset ---------- */
$('tombolContoh').addEventListener('click', () => {
  const t = templateAktif();
  t.fields.forEach(f => { if (f.c !== undefined) state.nilai[f.i] = f.c; });
  KOLOM_UMUM.forEach(f => { if (f.c !== undefined) state.umum[f.i] = f.c; });
  state.pratinjauManual = false;
  state.sudahTersimpan = false;
  simpanDraf(true); renderForm();
  toast('Formulir terisi contoh untuk template ' + t.nama + '. Silakan ubah seperlunya.');
});
$('tombolReset').addEventListener('click', () => {
  state.nilai = {};
  state.umum = { __detail: 'Standar', __sikap: 'Langsung kerjakan dengan asumsi terbaik' };
  state.pratinjauManual = false;
  state.sudahTersimpan = false;
  simpanDraf(true); renderForm();
  toast('Formulir dikosongkan.');
});

/* ---------- Unduh berkas ---------- */
function unduh(namaBerkas, isi, tipe){
  const blob = new Blob([isi], { type: tipe + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = namaBerkas;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
const namaBerkasAman = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'prompt';
$('tombolEksporTxt').addEventListener('click', () => {
  if (!validasi()) return;
  unduh('atiga-' + namaBerkasAman(templateAktif().nama) + '.txt', $('areaPreview').value, 'text/plain');
});
$('tombolEksporMd').addEventListener('click', () => {
  if (!validasi()) return;
  unduh('atiga-' + namaBerkasAman(templateAktif().nama) + '.md', $('areaPreview').value, 'text/markdown');
});

/* ---------- Pustaka ---------- */
function simpanPustaka(){
  state.pustaka = normalisasiPustaka(state.pustaka);
  const berhasil = tulisJSON(KUNCI_PUSTAKA, state.pustaka);
  if (!berhasil) laporkanGagalSimpan();
  renderPustaka();
  return berhasil;
}
$('tombolSimpan').addEventListener('click', () => {
  if (!validasi()) return;
  const t = templateAktif();
  const bawaan = t.nama + ' — ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const nama = window.prompt('Nama untuk prompt ini di Pustaka:', bawaan);
  if (nama === null) return;
  state.pustaka.unshift({
    id: 'p' + Date.now().toString(36),
    nama: (nama || bawaan).trim() || bawaan,
    templateId: t.id, templateNama: t.nama,
    target: state.target,
    teks: $('areaPreview').value,
    nilai: Object.assign({}, state.nilai),
    umum: Object.assign({}, state.umum),
    mode: state.mode,
    templateVersi: t.versi || 1,
    engineVersi: VERSI_ENGINE,
    favorit: false,
    waktu: Date.now()
  });
  state.sudahTersimpan = true;
  perbaruiProgres(true);
  if (simpanPustaka()) toast('Tersimpan di Pustaka Saya.');
  document.getElementById('pustaka').scrollIntoView({ behavior: 'smooth' });
});
function renderPustaka(){
  const wadah = $('daftarPustaka');
  const kata = $('cariPustaka').value.trim().toLowerCase();
  const daftar = state.pustaka.filter(p => !kata || (p.nama + ' ' + p.templateNama + ' ' + p.teks).toLowerCase().includes(kata));
  daftar.sort((a, b) => {
    if (state.urutkanPustaka === 'favorit') return (b.favorit - a.favorit) || (b.waktu - a.waktu);
    if (state.urutkanPustaka === 'terlama') return a.waktu - b.waktu;
    return b.waktu - a.waktu;
  });
  $('jumlahPustaka').textContent = state.pustaka.length + ' prompt';
  wadah.innerHTML = '';
  if (!daftar.length){
    wadah.innerHTML = state.pustaka.length
      ? '<p class="kosong">Tidak ada prompt yang cocok dengan pencarian.</p>'
      : '<div class="kosong empty-pustaka"><span class="ikon" aria-hidden="true">📚</span><strong>Belum ada prompt tersimpan</strong><p>Simpan prompt pertamamu untuk menemukannya lagi dengan cepat.</p></div>';
    return;
  }
  for (const p of daftar){
    const el = document.createElement('div');
    el.className = 'item-pustaka';
    const targetNama = (TARGET_AI.find(a => a.id === p.target) || {}).nama || p.target;
    el.innerHTML =
      '<div class="atas"><strong>' + (p.favorit ? '<span class="bintang">★</span> ' : '') + escapeHtml(p.nama) + '</strong></div>' +
      '<div class="meta">' + escapeHtml(p.templateNama) + ' · target ' + escapeHtml(targetNama) + ' · ' +
        new Date(p.waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + '</div>' +
      '<p class="cuplikan">' + escapeHtml(p.teks.slice(0, 220)) + '</p>' +
      '<div class="aksi">' +
        '<button class="tombol tombol-sekunder kecil" data-aksi="pakai">Pakai</button>' +
        '<button class="tombol tombol-hantu kecil" data-aksi="salin">Salin</button>' +
        '<button class="tombol tombol-hantu kecil" data-aksi="favorit">' + (p.favorit ? '★ Favorit' : '☆ Favorit') + '</button>' +
        '<button class="tombol tombol-hantu kecil" data-aksi="duplikat">Duplikat</button>' +
        '<button class="tombol tombol-hantu kecil" data-aksi="hapus">Hapus</button>' +
      '</div>';
    el.querySelectorAll('button[data-aksi]').forEach(b => {
      b.addEventListener('click', () => aksiPustaka(p, b.dataset.aksi));
    });
    wadah.appendChild(el);
  }
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
async function aksiPustaka(p, aksi){
  if (aksi === 'pakai'){
    const tAda = TARGET_AI.some(a => a.id === p.target);
    const templateAda = TEMPLATE_TERSEDIA.find(t => t.id === p.templateId);
    const punyaSnapshot = templateAda && p.nilai && Object.keys(p.nilai).length;
    if (punyaSnapshot){
      state.templateId = templateAda.id;
      state.kategori = templateAda.kategori;
      state.mode = p.mode === 'detail' ? 'detail' : 'cepat';
      state.target = tAda ? p.target : 'universal';
      state.nilai = Object.assign({}, p.nilai);
      state.umum = Object.assign({ __detail:'Standar', __sikap:'Langsung kerjakan dengan asumsi terbaik' }, p.umum || {});
      state.pratinjauManual = false;
      state.sudahTersimpan = false;
      renderKategori(); renderDaftarTemplate(); renderMode(); renderTarget(); renderForm();
      simpanPilihan();
    } else {
      state.pratinjauManual = true;
      $('areaPreview').value = p.teks;
      if (tAda){ state.target = p.target; renderTarget(); }
      perbaruiHitungan();
      perbaruiStruktur();
      perbaruiKualitas();
    }
    $('statusSalin').textContent = '📚 Memakai prompt dari Pustaka: "' + p.nama + '".';
    window.scrollTo({ top: $('areaPreview').getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  }
  if (aksi === 'salin'){
    const ok = await salinTeks(p.teks);
    toast(ok ? 'Prompt "' + p.nama + '" tersalin.' : 'Gagal menyalin otomatis.');
  }
  if (aksi === 'favorit'){ p.favorit = !p.favorit; simpanPustaka(); }
  if (aksi === 'duplikat'){
    state.pustaka.unshift(Object.assign({}, p, { id: 'p' + Date.now().toString(36), nama: p.nama + ' (salinan)', waktu: Date.now() }));
    if (simpanPustaka()) toast('Prompt diduplikat.');
  }
  if (aksi === 'hapus'){
    if (!window.confirm('Hapus prompt "' + p.nama + '" dari Pustaka?')) return;
    state.pustaka = state.pustaka.filter(x => x.id !== p.id);
    if (simpanPustaka()) toast('Prompt dihapus dari Pustaka.');
  }
}
$('cariPustaka').addEventListener('input', renderPustaka);
$('urutkanPustaka').addEventListener('change', e => {
  state.urutkanPustaka = e.target.value;
  renderPustaka();
});
$('tombolEksporJson').addEventListener('click', () => {
  if (!state.pustaka.length){ toast('Pustaka masih kosong.'); return; }
  const paket = {
    aplikasi: 'atiga-prompter',
    versi: VERSI_DATA,
    dibuatPada: new Date().toISOString(),
    pustaka: state.pustaka
  };
  unduh('atiga-prompter-pustaka.json', JSON.stringify(paket, null, 2), 'application/json');
});
$('berkasImpor').addEventListener('change', e => {
  const berkas = e.target.files[0];
  if (!berkas) return;
  if (berkas.size > BATAS_UKURAN_IMPOR){
    toast('Berkas terlalu besar. Ukuran maksimum impor adalah 2 MB.');
    e.target.value = '';
    return;
  }
  const pembaca = new FileReader();
  pembaca.onload = () => {
    try {
      const paket = JSON.parse(pembaca.result);
      const data = Array.isArray(paket) ? paket
        : paket && paket.aplikasi === 'atiga-prompter' && [1, VERSI_DATA].includes(paket.versi) && Array.isArray(paket.pustaka)
          ? paket.pustaka : null;
      if (!data) throw new Error('format tidak dikenal');
      const impor = normalisasiPustaka(data).map((item, idx) => Object.assign({}, item, {
        id: 'p' + Date.now().toString(36) + idx
      }));
      state.pustaka = normalisasiPustaka(impor.concat(state.pustaka));
      const ditambah = impor.length;
      if (!simpanPustaka()) return;
      toast(ditambah ? ditambah + ' prompt berhasil diimpor ke Pustaka.' : 'Tidak ada prompt valid di berkas itu.');
    } catch (err) {
      toast('Berkas tidak bisa dibaca. Pastikan berkas .json hasil ekspor Atiga Prompter.');
    }
    e.target.value = '';
  };
  pembaca.readAsText(berkas);
});

/* ---------- Mulai ---------- */
muatDrafTemplate();
renderKategori();
renderDaftarTemplate();
renderMode();
renderTarget();
renderPilihKirimAI();
renderForm();
renderPustaka();
simpanPilihan();

} /* akhir blok UI */
