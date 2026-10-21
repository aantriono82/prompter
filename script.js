/* ============================================================
   ATIGA PROMPTER — script.js
   Generator prompt untuk AI: pilih template → isi variabel →
   pratinjau → salin / kirim ke AI.
   Vanilla JS, tanpa pustaka luar. Seluruh data & logika lokal.

   Struktur berkas:
   1) DATA  : KATEGORI, TARGET_AI, TEMPLATE (21 template)
   2) MESIN : susunBlok() + bungkus() — penyusun prompt per target AI
   3) UI    : render & interaksi halaman (hanya berjalan di peramban)

   Cara menambah template: tambahkan satu objek ke TEMPLATE.
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
  { id:'blog',     ikon:'🌐', nama:'Blog / Website',    deskripsi:'Artikel blog, halaman penjualan, website satu halaman' },
  { id:'mpi',      ikon:'🎓', nama:'MPI',               deskripsi:'Media Pembelajaran Interaktif — khusus SMP, semua mata pelajaran' },
  { id:'game',     ikon:'🎮', nama:'Game',              deskripsi:'Game edukasi dan kuis interaktif' },
  { id:'aplikasi', ikon:'🛠️', nama:'Aplikasi / Tools',  deskripsi:'Aplikasi web, kalkulator, dan dasbor data' },
  { id:'materi',   ikon:'📚', nama:'Materi Ajar & Soal',deskripsi:'Modul ajar / RPP, LKPD, bank soal, slide presentasi' },
  { id:'tulisan',  ikon:'✍️', nama:'Tulisan & Konten',  deskripsi:'Artikel, esai, cerita, dan konten media sosial' },
  { id:'gambar',   ikon:'🎨', nama:'Gambar & Desain',   deskripsi:'Prompt gambar AI, logo, dan infografis' },
  { id:'bebas',    ikon:'🧩', nama:'Prompt Bebas',      deskripsi:'Kerangka universal untuk kebutuhan apa pun' }
];

const TARGET_AI = [
  { id:'universal', nama:'Universal', url:null,                              petunjuk:'Format Markdown polos — aman ditempel ke AI apa pun.' },
  { id:'chatgpt',   nama:'ChatGPT',   url:'https://chatgpt.com/',            petunjuk:'Markdown dengan aturan bernomor. Tombol Kirim mencoba mengisi prompt otomatis bila tidak terlalu panjang.' },
  { id:'claude',    nama:'Claude',    url:'https://claude.ai/new',           petunjuk:'Dibungkus tag XML — paling rapi untuk konteks panjang dan Mode Detail.' },
  { id:'gemini',    nama:'Gemini',    url:'https://gemini.google.com/app',   petunjuk:'Judul tebal; spesifikasi yang panjang ditampilkan sebagai tabel.' },
  { id:'deepseek',  nama:'DeepSeek',  url:'https://chat.deepseek.com/',      petunjuk:'Instruksi langsung dan teknis, dengan penalaran langkah demi langkah.' },
  { id:'qwen',      nama:'Qwen',      url:'https://chat.qwen.ai/',           petunjuk:'Markdown rapi; aman untuk konteks panjang.' },
  { id:'copilot',   nama:'Copilot',   url:'https://copilot.microsoft.com/',  petunjuk:'Ringkas dan padat — paling cocok dipadukan dengan Mode Cepat.' },
  { id:'grok',      nama:'Grok',      url:'https://grok.com/',               petunjuk:'Gaya langsung; AI diberi ruang mengusulkan variasi yang lebih baik.' },
  { id:'meta',      nama:'Meta AI',   url:'https://www.meta.ai/',            petunjuk:'Format percakapan terstruktur dengan daftar bernomor.' }
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
  tugas:'Tuliskan satu artikel blog yang lengkap dan siap terbit berdasarkan spesifikasi berikut.',
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
  aturan:['Tulis artikel utuh, bukan kerangka saja.','Sisipkan kata kunci utama secara alami di judul, paragraf pertama, dan minimal satu subjudul.'],
  format:['Artikel lengkap dengan judul, isi bersubjudul, dan penutup.']
},
{
  id:'landing-page', kategori:'blog', ikon:'🛒', nama:'Halaman Penjualan (Landing Page)',
  deskripsi:'Halaman satu layar yang meyakinkan pengunjung untuk bertindak.',
  peran:'Anda adalah copywriter halaman penjualan (landing page) berpengalaman yang menulis dalam Bahasa Indonesia yang meyakinkan tanpa berlebihan.',
  tugas:'Buatlah naskah lengkap satu halaman penjualan (landing page) berdasarkan spesifikasi berikut, termasuk usulan susunan bagiannya.',
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
  aturan:['Jangan membuat klaim yang tidak didukung keunggulan atau testimoni yang diberikan.','Setiap bagian diakhiri jembatan halus menuju CTA.'],
  format:['Naskah per bagian: judul utama (headline), subjudul, isi, tombol CTA — lengkap dengan teks tombolnya.']
},
{
  id:'website-satu-halaman', kategori:'blog', ikon:'🌐', nama:'Website Satu Halaman',
  deskripsi:'Prompt untuk membuat website satu halaman utuh (profil, portofolio, usaha, acara).',
  peran:'Anda adalah pengembang web front-end berpengalaman yang membuat website satu halaman yang modern, responsif, dan siap pakai dalam satu file HTML (CSS & JS di dalam file yang sama bila tidak diminta lain).',
  tugas:'Buatlah website satu halaman yang lengkap dan siap jalan berdasarkan spesifikasi berikut.',
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
  aturan:['Kode harus lengkap dan langsung bisa dibuka di peramban, bukan potongan.','Responsif di HP (±360px), tablet, laptop, dan layar besar.','Komentar kode dalam Bahasa Indonesia.'],
  format:['Berikan kode lengkap satu file HTML. Awali dengan ringkasan maksimal 5 baris tentang isi halaman.']
},

/* ---------- Kategori 2: MPI (khusus SMP, semua mata pelajaran) ---------- */
{
  id:'mpi-lengkap', kategori:'mpi', ikon:'🎓', nama:'MPI Lengkap',
  deskripsi:'Media Pembelajaran Interaktif lengkap untuk SMP (Kelas VII–IX, Fase D), semua mata pelajaran.',
  peran:'Anda adalah pengembang media pembelajaran interaktif (MPI) berpengalaman yang menguasai Kurikulum Merdeka, Panduan Mata Pelajaran Kemendikdasmen, dan pembuatan media satu file HTML.',
  tugas:'Buatlah satu media pembelajaran interaktif yang lengkap dan siap dipakai di kelas berdasarkan spesifikasi berikut.',
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
  aturan:['Tujuan pembelajaran harus menjadi acuan isi media; jangan menyimpang dari CP/ATP mata pelajaran terkait.','Bila Dimensi Profil Lulusan dipilih, wujudkan secara nyata di dalam aktivitas media, bukan hanya disebut.','Komentar kode dan seluruh teks antarmuka dalam Bahasa Indonesia.'],
  format:['Berikan kode lengkap satu file HTML yang siap jalan, bukan potongan. Awali dengan ringkasan maksimal 5 baris, lalu kode lengkapnya.']
},
{
  id:'simulasi-interaktif', kategori:'mpi', ikon:'🔬', nama:'Simulasi Interaktif',
  deskripsi:'Simulasi pembelajaran SMP yang bisa digeser, diubah, dan dieksplorasi murid.',
  peran:'Anda adalah pengembang simulasi pembelajaran interaktif berpengalaman untuk jenjang SMP yang membuat simulasi satu file HTML.',
  tugas:'Buatlah satu simulasi interaktif yang lengkap dan siap dipakai berdasarkan spesifikasi berikut.',
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
  aturan:['Setiap perubahan variabel harus langsung terlihat akibatnya di simulasi.','Sertakan umpan balik bila jawaban / kesimpulan murid menunjukkan miskonsepsi yang disebutkan.'],
  format:['Berikan kode lengkap satu file HTML yang siap jalan. Awali dengan ringkasan maksimal 5 baris.']
},

/* ---------- Kategori 3: Game ---------- */
{
  id:'game-edukasi', kategori:'game', ikon:'🎮', nama:'Game Edukasi',
  deskripsi:'Game yang melatih materi atau keterampilan tertentu sambil bermain.',
  peran:'Anda adalah pengembang game edukasi berpengalaman yang membuat game satu file HTML yang seru, adil, dan benar-benar melatih materi.',
  tugas:'Buatlah satu game edukasi yang lengkap dan siap dimainkan berdasarkan spesifikasi berikut.',
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
  aturan:['Soal / tantangan harus sesuai materi dan tingkat pemain sasaran.','Berikan umpan balik langsung pada setiap aksi pemain.'],
  format:['Berikan kode lengkap satu file HTML yang siap dimainkan. Awali dengan cara bermain singkat (maksimal 5 baris), lalu kode lengkapnya.']
},
{
  id:'kuis-interaktif', kategori:'game', ikon:'❓', nama:'Kuis Interaktif',
  deskripsi:'Kuis dengan soal dari materimu, lengkap dengan pembahasan dan skor.',
  peran:'Anda adalah pengembang kuis interaktif dan penyusun soal berpengalaman yang membuat kuis satu file HTML.',
  tugas:'Buatlah satu kuis interaktif yang lengkap dan siap dipakai berdasarkan spesifikasi berikut. Soal harus disusun hanya dari materi sumber yang diberikan.',
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
  aturan:['Dilarang membuat soal di luar materi sumber yang diberikan.','Untuk soal hitungan, periksa kembali kunci jawaban dengan menghitung ulang sebelum ditampilkan.'],
  format:['Berikan kode lengkap satu file HTML yang siap jalan, berisi seluruh soal, kunci, dan pembahasan di dalamnya.']
},

/* ---------- Kategori 4: Aplikasi / Tools ---------- */
{
  id:'aplikasi-web', kategori:'aplikasi', ikon:'🛠️', nama:'Aplikasi Web',
  deskripsi:'Aplikasi web apa pun: pencatat, pengelola, alat bantu kerja, dan lainnya.',
  peran:'Anda adalah pengembang aplikasi web berpengalaman yang membuat aplikasi yang sederhana, cepat, dan benar-benar menyelesaikan masalah penggunanya.',
  tugas:'Buatlah satu aplikasi web yang lengkap dan siap dipakai berdasarkan spesifikasi berikut.',
  fields:[
    { i:'namaApp', l:'Nama aplikasi', j:'teks', m:'C', w:true, ph:'mis. Catatan Belanja Bulanan', c:'Pencatat Tugas Kelas' },
    { i:'masalah', l:'Masalah yang diselesaikan', j:'area', m:'C', w:true, ph:'Masalah apa yang dialami pengguna sekarang…', c:'Guru kesulitan melacak tugas yang sudah dikumpulkan tiap kelas.' },
    { i:'pengguna', l:'Pengguna aplikasi', j:'teks', m:'C', w:true, ph:'mis. guru SMP', c:'guru SMP' },
    { i:'fiturUtama', l:'Fitur utama', j:'area', m:'C', w:true, ph:'Satu baris satu fitur…', c:'Tambah tugas per kelas\nTandai tugas terkumpul\nRekap per siswa' },
    { i:'penyimpanan', l:'Data disimpan di mana', j:'pilih', m:'C', o:['Tidak disimpan (hilang saat ditutup)','Di perangkat (localStorage)','Diunduh sebagai berkas'], c:'Di perangkat (localStorage)' },
    { i:'tampilanApp', l:'Tampilan (halaman / bagian)', j:'area', m:'C', w:true, ph:'Satu baris satu halaman atau bagian…', c:'Beranda: daftar kelas\nHalaman kelas: daftar tugas & status' },
    { i:'batasan', l:'Batasan teknis', j:'centang', m:'D', aturan:true, o:['Satu file HTML','Beberapa file terpisah','Berjalan tanpa internet','Tanpa daftar akun / login'], c:['Satu file HTML','Tanpa daftar akun / login'] },
    { i:'gayaVisual', l:'Gaya visual', j:'teks', m:'D', ph:'mis. bersih, biru muda, banyak ruang kosong', c:'bersih dan sederhana' }
  ],
  aturan:['Utamakan kemudahan pemakaian untuk pengguna yang disebutkan.','Seluruh teks antarmuka dan komentar kode dalam Bahasa Indonesia.'],
  format:['Berikan kode lengkap yang siap jalan. Awali dengan ringkasan fitur (maksimal 5 baris), lalu kode lengkapnya.']
},
{
  id:'kalkulator', kategori:'aplikasi', ikon:'🧮', nama:'Kalkulator / Alat Hitung',
  deskripsi:'Alat hitung khusus: konversi, simulasi biaya, penghitung nilai, dan sejenisnya.',
  peran:'Anda adalah pengembang alat hitung (kalkulator) web berpengalaman yang teliti terhadap rumus dan satuan.',
  tugas:'Buatlah satu kalkulator / alat hitung yang lengkap dan siap dipakai berdasarkan spesifikasi berikut.',
  fields:[
    { i:'dihitung', l:'Yang dihitung', j:'teks', m:'C', w:true, ph:'mis. nilai akhir siswa dari tugas, UH, dan UAS', c:'nilai akhir siswa' },
    { i:'masukan', l:'Masukan (input)', j:'area', m:'C', w:true, ph:'Satu baris satu masukan beserta satuannya…', c:'Nilai tugas (0–100)\nNilai ulangan harian (0–100)\nNilai ujian (0–100)' },
    { i:'rumus', l:'Rumus / aturan hitung', j:'area', m:'C', w:true, ph:'Tulis rumusnya dengan jelas…', c:'Nilai akhir = 30% tugas + 30% ulangan harian + 40% ujian' },
    { i:'keluaran', l:'Keluaran (output)', j:'area', m:'C', w:true, ph:'Satu baris satu keluaran…', c:'Nilai akhir (angka)\nPredikat huruf A–E' },
    { i:'kasusUji', l:'Contoh kasus uji', j:'area', m:'D', ph:'Masukan → hasil yang benar…', c:'Tugas 80, UH 70, Ujian 90 → nilai akhir 81, predikat A' },
    { i:'salahInput', l:'Penanganan masukan salah', j:'teks', m:'D', ph:'mis. tampilkan pesan ramah, jangan sampai halaman error', c:'Tampilkan pesan ramah berwarna merah di bawah kolom' }
  ],
  aturan:['Hasil hitungan harus persis mengikuti rumus yang diberikan; verifikasi dengan kasus uji bila diberikan.','Tampilkan satuan di samping angka hasil.'],
  format:['Berikan kode lengkap satu file HTML yang siap jalan, dengan contoh terisi dari kasus uji.']
},
{
  id:'dasbor-data', kategori:'aplikasi', ikon:'📊', nama:'Dasbor Data',
  deskripsi:'Dasbor ringkasan data: kartu angka, grafik, dan tabel yang bisa disaring.',
  peran:'Anda adalah pengembang dasbor data berpengalaman yang menyajikan data secara jujur dan mudah dibaca.',
  tugas:'Buatlah satu dasbor data yang lengkap dan siap dipakai berdasarkan spesifikasi berikut.',
  fields:[
    { i:'data', l:'Data yang ditampilkan', j:'area', m:'C', w:true, ph:'Satu baris satu jenis data…', c:'Nilai ulangan per kelas\nKehadiran siswa\nTugas terkumpul' },
    { i:'sumberData', l:'Sumber data', j:'pilih', m:'C', w:true, o:['Diketik manual di aplikasi','Ditempel sebagai tabel','Diimpor dari berkas CSV'], c:'Ditempel sebagai tabel' },
    { i:'kartu', l:'Ringkasan / kartu angka utama', j:'area', m:'C', w:true, ph:'Satu baris satu kartu…', c:'Rata-rata nilai\nNilai tertinggi\nPersentase ketuntasan' },
    { i:'grafik', l:'Jenis grafik', j:'centang', m:'D', o:['Batang','Garis','Lingkaran','Tabel saja'], c:['Batang'] },
    { i:'saring', l:'Saring / urutkan', j:'teks', m:'D', ph:'mis. saring per kelas, urutkan nilai tertinggi', c:'saring per kelas' }
  ],
  aturan:['Jangan mengubah angka data yang diberikan pengguna.','Beri judul dan satuan yang jelas pada setiap grafik dan kartu.'],
  format:['Berikan kode lengkap satu file HTML yang siap jalan, lengkap dengan data contoh agar tampilannya bisa dinilai.']
},

/* ---------- Kategori 5: Materi Ajar & Soal ---------- */
{
  id:'modul-ajar', kategori:'materi', ikon:'📘', nama:'Modul Ajar / RPP',
  deskripsi:'Modul ajar / RPP Pembelajaran Mendalam sesuai Panduan Mata Pelajaran Final Fase A–F Kemendikdasmen (2025).',
  peran:'Anda adalah penyusun modul ajar / RPP berpengalaman yang mengikuti persis Panduan Mata Pelajaran Final Fase A–F terbitan BSKAP Kemendikdasmen (2025) dan Capaian Pembelajaran menurut Keputusan Kepala BSKAP No. 046/H/KR/2025.',
  tugas:'Susunlah satu modul ajar / RPP Pembelajaran Mendalam yang lengkap berdasarkan spesifikasi berikut, dengan struktur dokumen persis: Identitas → A. Identifikasi → B. Desain Pembelajaran → C. Pengalaman Belajar → D. Asesmen Pembelajaran.',
  fields:[
    { i:'penyusun', l:'Nama penyusun & satuan pendidikan', j:'teks', m:'D', g:'Identitas', ph:'mis. Aan Triono, S.Pd. — SMP Nusantara', c:'Aan Triono, S.Pd. — SMP Nusantara' },
    { i:'jenjang', l:'Jenjang', j:'pilih', m:'C', w:true, g:'Identitas', o:['PAUD','SD','SMP','SMA','SMK'], c:'SMP' },
    { i:'fase', l:'Fase', j:'pilih', m:'C', w:true, g:'Identitas', o:['Fondasi (PAUD)','A (Kelas I–II)','B (Kelas III–IV)','C (Kelas V–VI)','D (Kelas VII–IX SMP)','E (Kelas X)','F (Kelas XI–XII)'], c:'D (Kelas VII–IX SMP)' },
    { i:'kelas', l:'Kelas', j:'teks', m:'C', w:true, g:'Identitas', ph:'mis. VII', c:'VII' },
    { i:'mapel', l:'Mata pelajaran', j:'teks', m:'C', w:true, g:'Identitas', ph:'mis. IPA', c:'IPA' },
    { i:'topik', l:'Materi / topik pembelajaran', j:'teks', m:'C', w:true, g:'Identitas', ph:'mis. Sistem Pencernaan Manusia', c:'Sistem Pencernaan Manusia' },
    { i:'alokasi', l:'Alokasi waktu', j:'teks', m:'C', w:true, g:'Identitas', ph:'mis. 2 pertemuan × 2 JP', c:'2 pertemuan × 2 JP' },
    { i:'kesiapan', l:'Kesiapan peserta didik', j:'area', m:'C', w:true, g:'A. Identifikasi', ph:'Pengetahuan awal, minat, latar belakang, kebutuhan belajar…', c:'Peserta didik telah mengenal organ tubuh dari SD; minat tinggi pada percobaan sederhana; sebagian masih kesulitan membaca teks panjang.' },
    { i:'karakteristikMateri', l:'Karakteristik materi pelajaran', j:'area', m:'D', g:'A. Identifikasi', ph:'Jenis pengetahuan (faktual/konseptual/prosedural/metakognitif), relevansi dengan kehidupan nyata, tingkat kesulitan, struktur materi…', c:'Konseptual dan prosedural; sangat relevan dengan kesehatan sehari-hari; kesulitan sedang; materi berjenjang dari organ ke proses lalu gangguan.' },
    { i:'dimensi', l:'Dimensi Profil Lulusan yang dituju', j:'centang', m:'C', w:true, g:'A. Identifikasi', o:DIMENSI_PROFIL, c:['Penalaran kritis','Kolaborasi','Kesehatan'] },
    { i:'wujudDimensi', l:'Cara mewujudkan dimensi tersebut', j:'area', m:'D', g:'A. Identifikasi', ph:'Bagaimana dimensi terlihat nyata dalam kegiatan…', c:'Penalaran kritis lewat analisis kasus gangguan pencernaan; kolaborasi lewat kerja kelompok; kesehatan lewat kampanye pola makan.' },
    { i:'cp', l:'Capaian Pembelajaran (CP) — tempel dari Panduan Mata Pelajaran / Kep. BSKAP 046/H/KR/2025', j:'area', m:'C', w:true, g:'B. Desain Pembelajaran', ph:'Tempel rumusan CP fase di sini. Bila dikosongkan, AI mengambil dari panduan resmi & menandainya untuk diperiksa…', c:'Peserta didik memahami proses pencernaan makanan pada manusia dan keterkaitannya dengan kesehatan tubuh.' },
    { i:'elemen', l:'Elemen CP', j:'teks', m:'D', g:'B. Desain Pembelajaran', ph:'Elemen mapel tempat CP berada, sesuai panduan mapelnya', c:'Pemahaman IPA' },
    { i:'lintas', l:'Lintas disiplin ilmu', j:'teks', m:'D', g:'B. Desain Pembelajaran', ph:'Mapel / disiplin lain yang relevan dengan topik', c:'PJOK (kesehatan) dan Bahasa Indonesia (teks laporan hasil observasi)' },
    { i:'tp', l:'Tujuan Pembelajaran (TP, diturunkan dari CP)', j:'area', m:'C', w:true, g:'B. Desain Pembelajaran', ph:'Satu baris satu TP…', c:'Mengidentifikasi organ-organ pencernaan manusia\nMenjelaskan proses pencernaan makanan\nMenganalisis gangguan pada sistem pencernaan' },
    { i:'praktik', l:'Praktik pedagogis (model / metode)', j:'pilih', m:'C', w:true, g:'B. Desain Pembelajaran', o:['Penemuan (discovery learning)','Berbasis masalah (PBL)','Berbasis proyek (PjBL)','Kooperatif','Pembelajaran langsung','Berdiferensiasi','Lainnya'], c:'Penemuan (discovery learning)' },
    { i:'kemitraan', l:'Kemitraan pembelajaran', j:'teks', m:'D', g:'B. Desain Pembelajaran', ph:'Kolaborasi guru–murid, antarmurid, orang tua, komunitas, narasumber', c:'Kerja kelompok antarmurid; narasumber petugas UKS untuk sesi gangguan pencernaan' },
    { i:'lingkungan', l:'Lingkungan pembelajaran', j:'teks', m:'D', g:'B. Desain Pembelajaran', ph:'Ruang fisik / virtual dan budaya belajar yang dibangun', c:'Kelas dengan meja kelompok; budaya berani bertanya dan menghargai pendapat' },
    { i:'digital', l:'Pemanfaatan digital', j:'centang', m:'D', g:'B. Desain Pembelajaran', o:['Video pembelajaran','Simulasi','LMS','Kuis digital','Tanpa teknologi digital'], c:['Video pembelajaran','Kuis digital'] },
    { i:'rancangan', l:'Rancangan kegiatan', j:'pilih', m:'C', w:true, g:'C. Pengalaman Belajar', o:['Minta AI menyusun lengkap (Awal → Memahami → Mengaplikasi → Merefleksi → Penutup)','Sudah ada — ditempel di kolom pertanyaan pemantik / catatan'], c:'Minta AI menyusun lengkap (Awal → Memahami → Mengaplikasi → Merefleksi → Penutup)' },
    { i:'pemantik', l:'Pertanyaan pemantik / catatan kegiatan', j:'area', m:'D', g:'C. Pengalaman Belajar', ph:'Pertanyaan pemantik, atau tempel rancangan kegiatanmu…', c:'Ke mana perginya makanan setelah ditelan, dan mengapa kita bisa kenyang?' },
    { i:'diferensiasi', l:'Diferensiasi & kebutuhan khusus', j:'area', m:'D', g:'C. Pengalaman Belajar', ph:'Diferensiasi konten / proses / produk, dukungan untuk kebutuhan khusus…', c:'Teks bacaan dua tingkat kesulitan; pilihan produk: poster atau presentasi lisan.' },
    { i:'media', l:'Media, alat & sumber belajar', j:'area', m:'D', g:'C. Pengalaman Belajar', ph:'Satu baris satu media / alat / sumber…', c:'Torso organ pencernaan\nVideo proses pencernaan\nLKPD' },
    { i:'asesmenAwal', l:'Asesmen pada awal pembelajaran (diagnostik)', j:'teks', m:'C', w:true, g:'D. Asesmen Pembelajaran', ph:'mis. perlu — kuis 5 soal tentang organ tubuh / tidak', c:'Perlu — kuis singkat 5 soal' },
    { i:'asesmenProses', l:'Asesmen pada proses pembelajaran (formatif)', j:'teks', m:'C', w:true, g:'D. Asesmen Pembelajaran', ph:'mis. perlu — observasi diskusi & kinerja kelompok / tidak', c:'Perlu — lembar observasi diskusi kelompok' },
    { i:'asesmenAkhir', l:'Asesmen pada akhir pembelajaran (sumatif)', j:'teks', m:'C', w:true, g:'D. Asesmen Pembelajaran', ph:'mis. perlu — tes tertulis 10 soal & presentasi / tidak', c:'Perlu — tes tertulis 10 soal' },
    { i:'instrumen', l:'Instrumen & rubrik yang disertakan', j:'centang', m:'D', g:'D. Asesmen Pembelajaran', o:['Kunci jawaban','Rubrik penilaian','Lembar observasi'], c:['Kunci jawaban','Rubrik penilaian'] },
    { i:'tindakLanjut', l:'Tindak lanjut (remedial & pengayaan)', j:'pilih', m:'D', g:'D. Asesmen Pembelajaran', o:['Sertakan','Tidak perlu'], c:'Sertakan' }
  ],
  aturan:[
    'Gunakan istilah resmi panduan: "Dimensi Profil Lulusan" (bukan Profil Pelajar Pancasila) dan judul "Asesmen pada awal / proses / akhir pembelajaran" (istilah diagnostik, formatif, sumatif hanya sebagai penjelasan dalam kurung).',
    'Tujuan Pembelajaran harus konsisten dan diturunkan dari Capaian Pembelajaran yang diberikan. Bila kolom CP kosong atau bertanda ambil dari panduan, tuliskan CP menurut Panduan Mata Pelajaran resmi fase dan mapel terkait dan beri tanda [PERLU DIPERIKSA GURU] di sampingnya — jangan mengarang rumusan CP tanpa tanda.',
    'Pada Pengalaman Belajar, prinsip berkesadaran, bermakna, dan menggembirakan harus tampak nyata dalam kegiatan, bukan hanya disebut.',
    'Kegiatan inti wajib mengikuti alur Memahami → Mengaplikasi → Merefleksi.'
  ],
  format:['Dokumen modul ajar / RPP utuh dengan urutan: Identitas → A. Identifikasi → B. Desain Pembelajaran → C. Pengalaman Belajar → D. Asesmen Pembelajaran. Sertakan instrumen / rubrik yang diminta di bagian asesmen.']
},
{
  id:'lkpd', kategori:'materi', ikon:'📄', nama:'LKPD',
  deskripsi:'Lembar Kerja Peserta Didik yang siap dipakai dan siap cetak.',
  peran:'Anda adalah penyusun LKPD berpengalaman yang menulis lembar kerja yang jelas, bertahap, dan menyenangkan dikerjakan peserta didik.',
  tugas:'Susunlah satu LKPD yang lengkap dan siap dipakai berdasarkan spesifikasi berikut.',
  fields:[
    { i:'materiLkpd', l:'Materi', j:'teks', m:'C', w:true, ph:'mis. Sistem Pencernaan Manusia', c:'Sistem Pencernaan Manusia' },
    { i:'kelasLkpd', l:'Kelas', j:'teks', m:'C', w:true, ph:'mis. VIII SMP', c:'VIII SMP' },
    { i:'tujuanKegiatan', l:'Tujuan kegiatan', j:'area', m:'C', w:true, ph:'Satu baris satu tujuan…', c:'Mengamati dan mencatat urutan organ pencernaan\nMenjelaskan fungsi tiap organ' },
    { i:'jenisKegiatan', l:'Jenis kegiatan', j:'pilih', m:'C', w:true, o:['Pengamatan','Percobaan','Diskusi','Latihan soal','Proyek mini'], c:'Pengamatan' },
    { i:'jumlahTugas', l:'Jumlah & jenis soal / tugas', j:'teks', m:'C', ph:'mis. 5 tugas pengamatan + 3 soal refleksi', c:'5 tugas pengamatan + 3 soal refleksi' },
    { i:'kunci', l:'Kunci jawaban untuk guru', j:'pilih', m:'D', o:['Sertakan terpisah di akhir','Tidak perlu'], c:'Sertakan terpisah di akhir' },
    { i:'formatCetak', l:'Format cetak', j:'pilih', m:'D', o:['Dokumen biasa siap salin ke Word','Kode LaTeX A4 siap cetak'], c:'Dokumen biasa siap salin ke Word' }
  ],
  aturan:['Bahasa petunjuk harus singkat, jelas, dan sesuai usia peserta didik.','Sediakan ruang yang cukup untuk menulis jawaban.'],
  format:['LKPD utuh: identitas, tujuan, alat & bahan (bila relevan), langkah kegiatan, ruang jawaban, dan kesimpulan / refleksi.']
},
{
  id:'bank-soal', kategori:'materi', ikon:'🗂️', nama:'Bank Soal',
  deskripsi:'Paket soal dari materi sumbermu, lengkap dengan kunci dan pembahasan.',
  peran:'Anda adalah penyusun soal berpengalaman yang menulis soal yang valid, jelas, dan sesuai jenjang kognitif yang diminta.',
  tugas:'Susunlah satu paket soal yang lengkap berdasarkan spesifikasi berikut. Soal hanya boleh dibuat dari materi / ruang lingkup yang diberikan.',
  fields:[
    { i:'ruangLingkup', l:'Materi & ruang lingkup (materi sumber)', j:'area', m:'C', w:true, ph:'Tempel materi sumber atau jabarkan ruang lingkupnya…', c:'Bilangan bulat: pengertian, garis bilangan, membandingkan, dan operasi hitung campuran.' },
    { i:'jenjangKelas', l:'Jenjang & kelas', j:'teks', m:'C', w:true, ph:'mis. SMP Kelas VII', c:'SMP Kelas VII' },
    { i:'jumlahBentuk', l:'Jumlah & bentuk soal', j:'teks', m:'C', w:true, ph:'mis. 10 pilihan ganda, 3 esai', c:'10 pilihan ganda, 2 esai' },
    { i:'kognitif', l:'Tingkat kesulitan & jenjang kognitif', j:'pilih', m:'C', o:['Campuran C1–C3','Sampai C4 (menganalisis)','Fokus HOTS'], c:'Campuran C1–C3' },
    { i:'kunciBahasan', l:'Kunci & pembahasan', j:'pilih', m:'C', w:true, o:['Kunci saja','Kunci + pembahasan','Kunci + pembahasan + rubrik esai'], c:'Kunci + pembahasan' },
    { i:'kisi', l:'Tabel spesifikasi / kisi-kisi', j:'pilih', m:'D', o:['Sertakan sebelum soal','Tidak perlu'], c:'Sertakan sebelum soal' }
  ],
  aturan:['Untuk soal hitungan, hitung ulang setiap kunci jawaban sebelum ditulis.','Pengecoh (distraktor) pilihan ganda harus masuk akal dan berasal dari kesalahan yang umum dilakukan siswa.','Hindari soal yang jawabannya ambigu.'],
  format:['Paket soal utuh siap pakai; kunci dan pembahasan diletakkan terpisah setelah soal.']
},
{
  id:'slide-presentasi', kategori:'materi', ikon:'🖥️', nama:'Slide Presentasi',
  deskripsi:'Naskah slide per halaman: judul, poin isi, dan saran visual.',
  peran:'Anda adalah perancang presentasi berpengalaman yang menyusun slide yang ringkas, runtut, dan mudah disampaikan.',
  tugas:'Susunlah naskah presentasi lengkap per slide berdasarkan spesifikasi berikut.',
  fields:[
    { i:'topikSlide', l:'Topik presentasi', j:'teks', m:'C', w:true, ph:'mis. Pengenalan Bilangan Bulat', c:'Pengenalan Bilangan Bulat' },
    { i:'audiens', l:'Hadirin / audiens', j:'teks', m:'C', w:true, ph:'mis. siswa SMP kelas VII', c:'siswa SMP kelas VII' },
    { i:'jumlahSlide', l:'Jumlah slide', j:'angka', m:'C', w:true, ph:'mis. 10', c:'10' },
    { i:'tujuanPresentasi', l:'Tujuan presentasi', j:'teks', m:'C', w:true, ph:'mis. siswa memahami bilangan negatif lewat contoh suhu dan utang', c:'siswa memahami bilangan negatif lewat contoh sehari-hari' },
    { i:'gayaSampai', l:'Gaya penyampaian', j:'pilih', m:'D', o:['Mengajar','Seminar','Promosi','Laporan'], c:'Mengajar' },
    { i:'visual', l:'Kebutuhan visual per slide', j:'pilih', m:'D', o:['Sebutkan saran gambar / diagram tiap slide','Teks saja'], c:'Sebutkan saran gambar / diagram tiap slide' }
  ],
  aturan:['Satu slide maksimal 5 poin singkat; kalimat panjang diletakkan di catatan pembicara.'],
  format:['Untuk setiap slide: nomor, judul slide, poin isi, saran visual (bila diminta), dan catatan pembicara singkat.']
},

/* ---------- Kategori 6: Tulisan & Konten ---------- */
{
  id:'artikel-esai', kategori:'tulisan', ikon:'✍️', nama:'Artikel / Esai / Refleksi',
  deskripsi:'Artikel informatif, opini, esai, sampai renungan / hikmah.',
  peran:'Anda adalah penulis artikel dan esai berpengalaman yang menulis dalam Bahasa Indonesia yang hidup, jujur, dan menyentuh pembacanya.',
  tugas:'Tuliskan satu tulisan yang lengkap dan siap dibaca berdasarkan spesifikasi berikut.',
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
  aturan:['Jangan mengarang kutipan atau data; bila memerlukan contoh, gunakan contoh umum yang wajar.'],
  format:['Tulisan utuh dengan judul, paragraf pembuka, isi, dan penutup.']
},
{
  id:'cerita', kategori:'tulisan', ikon:'📖', nama:'Cerita / Cerpen',
  deskripsi:'Cerita pendek dengan tokoh, konflik, dan pesan moral yang jelas.',
  peran:'Anda adalah penulis cerita berpengalaman yang pandai membangun tokoh yang hidup dan alur yang mengalir.',
  tugas:'Tuliskan satu cerita yang lengkap berdasarkan spesifikasi berikut.',
  fields:[
    { i:'genre', l:'Genre', j:'pilih', m:'C', w:true, o:['Fabel','Anak','Remaja','Inspiratif','Misteri','Fiksi ilmiah','Lainnya'], c:'Fabel' },
    { i:'tokoh', l:'Tokoh utama', j:'teks', m:'C', w:true, ph:'mis. Kancil yang sombong belajar rendah hati', c:'Kancil yang sombong' },
    { i:'latar', l:'Latar', j:'teks', m:'C', w:true, ph:'mis. hutan di tepi sungai, pagi hari', c:'hutan di tepi sungai' },
    { i:'konflik', l:'Konflik / masalah utama', j:'area', m:'C', w:true, ph:'Masalah apa yang dihadapi tokoh…', c:'Kesombongannya membuat teman-temannya menjauh saat ia benar-benar membutuhkan bantuan.' },
    { i:'moral', l:'Pesan moral', j:'teks', m:'C', w:true, ph:'mis. rendah hati dan menghargai teman', c:'rendah hati dan menghargai teman' },
    { i:'panjangCerita', l:'Panjang cerita', j:'pilih', m:'D', o:['Pendek (±500 kata)','Sedang (±1.000 kata)','Panjang (±2.000 kata)'], c:'Sedang (±1.000 kata)' },
    { i:'sudutCerita', l:'Sudut pandang', j:'pilih', m:'D', o:['Orang ketiga','Orang pertama'], c:'Orang ketiga' }
  ],
  aturan:['Pesan moral harus terasa dari alur cerita, bukan ditempel sebagai ceramah di akhir.'],
  format:['Cerita utuh dengan judul; dialog diberi paragraf sendiri.']
},
{
  id:'konten-sosmed', kategori:'tulisan', ikon:'📱', nama:'Konten Media Sosial & Naskah Video',
  deskripsi:'Takarir, utas, teks siaran, dan naskah video pendek maupun panjang.',
  peran:'Anda adalah pembuat konten media sosial berpengalaman yang menulis dalam Bahasa Indonesia yang segar dan sesuai karakter tiap platform.',
  tugas:'Buatlah konten yang lengkap dan siap tayang berdasarkan spesifikasi berikut.',
  fields:[
    { i:'platform', l:'Platform', j:'pilih', m:'C', w:true, o:['Instagram','TikTok','YouTube','Facebook','X (Twitter)','WhatsApp'], c:'Instagram' },
    { i:'topikKonten', l:'Topik / produk', j:'teks', m:'C', w:true, ph:'mis. tips belajar pecahan untuk orang tua', c:'tips belajar pecahan untuk orang tua' },
    { i:'bentuk', l:'Bentuk konten', j:'pilih', m:'C', w:true, o:['Takarir (caption)','Naskah video pendek','Naskah video panjang','Utas (thread)','Teks siaran WhatsApp'], c:'Takarir (caption)' },
    { i:'tujuanKonten', l:'Tujuan konten', j:'pilih', m:'C', w:true, o:['Edukasi','Hiburan','Promosi','Ajakan / pengumuman'], c:'Edukasi' },
    { i:'nada', l:'Gaya & nada', j:'pilih', m:'D', o:['Santai','Hangat','Lucu','Serius','Semangat'], c:'Hangat' },
    { i:'ctaKonten', l:'Ajakan bertindak', j:'teks', m:'D', ph:'mis. simpan unggahan ini, bagikan ke orang tua lain', c:'Simpan unggahan ini dan bagikan ke orang tua lain' },
    { i:'tagar', l:'Tagar (hashtag)', j:'pilih', m:'D', o:['Minta dibuatkan','Tidak perlu'], c:'Minta dibuatkan' }
  ],
  aturan:['Sesuaikan panjang dan gaya dengan platform yang dipilih.','Untuk naskah video, sertakan penanda adegan / detik bila relevan.'],
  format:['Konten siap salin-tempel; untuk utas, beri nomor urut tiap bagian.']
},

/* ---------- Kategori 7: Gambar & Desain ---------- */
{
  id:'prompt-gambar', kategori:'gambar', ikon:'🖼️', nama:'Prompt Gambar AI',
  deskripsi:'Prompt siap tempel untuk alat gambar AI (Midjourney, DALL·E, dsb.). Bahasa hasil bisa dipilih — bawaannya Inggris.',
  peran:'Anda adalah ahli penulisan prompt gambar (image prompt engineer) berpengalaman untuk berbagai alat gambar AI.',
  tugas:'Susunlah prompt gambar yang siap ditempel ke alat gambar AI berdasarkan spesifikasi berikut, lengkap dengan negative prompt bila relevan.',
  fields:[
    { i:'subjek', l:'Subjek utama gambar', j:'teks', m:'C', w:true, ph:'mis. guru muda Indonesia tersenyum di depan kelas', c:'guru muda Indonesia tersenyum di depan kelas' },
    { i:'aksi', l:'Aksi / suasana', j:'teks', m:'C', w:true, ph:'mis. sedang menjelaskan pecahan di papan tulis', c:'sedang menjelaskan pecahan di papan tulis' },
    { i:'latarGambar', l:'Latar tempat', j:'teks', m:'C', w:true, ph:'mis. ruang kelas SMP yang terang', c:'ruang kelas SMP yang terang' },
    { i:'gayaGambar', l:'Gaya gambar', j:'pilih', m:'C', w:true, o:['Fotografi realistis','Ilustrasi datar','Kartun','Lukisan cat air','3D','Piksel','Anime'], c:'Ilustrasi datar' },
    { i:'rasio', l:'Rasio gambar', j:'pilih', m:'C', o:['16:9','1:1','9:16','4:3'], c:'16:9' },
    { i:'bahasaGambar', l:'Bahasa prompt gambar', j:'pilih', m:'C', w:true, o:['Inggris','Indonesia'], c:'Inggris', h:'Bawaan: Inggris — alat gambar umumnya paling paham istilah gaya berbahasa Inggris. Bila Inggris dipilih, sertakan juga terjemahan Indonesianya di bawah prompt utama.' },
    { i:'cahaya', l:'Pencahayaan & suasana warna', j:'teks', m:'D', ph:'mis. cahaya pagi lembut, warna hangat', c:'cahaya pagi lembut, warna hangat' },
    { i:'hindariGambar', l:'Detail yang harus dihindari (negative prompt)', j:'teks', m:'D', ph:'mis. teks acak, jari berlebih, buram', c:'teks acak, buram, proporsi wajah aneh' },
    { i:'alatGambar', l:'Target alat gambar', j:'pilih', m:'D', o:['Umum','Midjourney','DALL·E','Stable Diffusion','Ideogram','Leonardo'], c:'Umum' }
  ],
  aturan:['Tulis prompt gambar dalam satu blok yang ringkas dan padat berisi subjek, aksi, latar, gaya, pencahayaan, dan detail teknis (rasio / parameter alat bila alatnya mendukung).'],
  format:['Satu blok prompt gambar siap tempel, lalu negative prompt terpisah (bila ada), lalu penjelasan singkat tiap unsur dalam Bahasa Indonesia.']
},
{
  id:'logo', kategori:'gambar', ikon:'🏷️', nama:'Logo & Identitas Visual',
  deskripsi:'Konsep logo lengkap: makna, bentuk, warna, dan prompt gambarnya.',
  peran:'Anda adalah desainer logo dan identitas visual berpengalaman.',
  tugas:'Rancanglah konsep logo berdasarkan spesifikasi berikut.',
  fields:[
    { i:'merek', l:'Nama merek / usaha', j:'teks', m:'C', w:true, ph:'mis. Les Privat Atiga', c:'Les Privat Atiga' },
    { i:'bidang', l:'Bidang usaha', j:'teks', m:'C', w:true, ph:'mis. bimbingan belajar matematika', c:'bimbingan belajar matematika' },
    { i:'kesan', l:'Kesan yang diinginkan', j:'teks', m:'C', w:true, ph:'mis. terpercaya, modern, ramah', c:'terpercaya, modern, ramah' },
    { i:'jumlahKonsep', l:'Jumlah konsep yang diminta', j:'angka', m:'C', ph:'mis. 3', c:'3' },
    { i:'simbol', l:'Bentuk / simbol idaman', j:'teks', m:'D', ph:'mis. pensil yang membentuk huruf A', c:'pensil membentuk huruf A' },
    { i:'warnaLogo', l:'Warna', j:'teks', m:'D', ph:'mis. indigo dan amber', c:'indigo dan amber' }
  ],
  aturan:['Setiap konsep harus berbeda pendekatan, bukan variasi kecil dari satu ide.'],
  format:['Untuk tiap konsep: nama konsep, deskripsi bentuk, makna, palet warna (dengan kode hex), dan prompt gambar siap tempel untuk membuatnya di alat gambar AI.']
},
{
  id:'infografis', kategori:'gambar', ikon:'📈', nama:'Infografis',
  deskripsi:'Rancangan infografis: susunan isi, alur baca, dan naskah tiap bagiannya.',
  peran:'Anda adalah perancang infografis berpengalaman yang menyajikan data dengan jujur dan mudah dipahami.',
  tugas:'Rancanglah satu infografis lengkap berdasarkan spesifikasi berikut.',
  fields:[
    { i:'topikInfo', l:'Topik infografis', j:'teks', m:'C', w:true, ph:'mis. Unsur-unsur Lingkaran', c:'Unsur-unsur Lingkaran' },
    { i:'poinInfo', l:'Data / poin utama', j:'area', m:'C', w:true, ph:'Satu baris satu poin…', c:'Titik pusat\nJari-jari dan diameter\nBusur dan tali busur\nJuring dan tembereng' },
    { i:'pembacaInfo', l:'Pembaca', j:'teks', m:'C', w:true, ph:'mis. siswa SMP kelas VIII', c:'siswa SMP kelas VIII' },
    { i:'alurInfo', l:'Alur baca', j:'pilih', m:'D', o:['Atas ke bawah','Kiri ke kanan','Melingkar','Perbandingan dua sisi'], c:'Atas ke bawah' },
    { i:'gayaInfo', l:'Gaya visual', j:'pilih', m:'D', o:['Modern cerah','Minimalis','Kartun edukasi','Formal'], c:'Modern cerah' }
  ],
  aturan:['Jangan mengubah angka atau fakta dari poin yang diberikan.'],
  format:['Rancangan per bagian: judul bagian, isi teks persisnya, saran ikon / ilustrasi, dan saran warna — ditutup prompt gambar untuk membuat latar / ikonnya bila relevan.']
},

/* ---------- Kategori 8: Prompt Bebas ---------- */
{
  id:'prompt-bebas', kategori:'bebas', ikon:'🧩', nama:'Prompt Bebas Universal',
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
  aturan:[],
  format:[]
}
];

/* Kolom umum untuk semua template (di luar kolom khusus template) */
const KOLOM_UMUM = [
  { i:'__detail', l:'Tingkat detail hasil', j:'pilih', m:'C', o:['Ringkas','Standar','Sangat detail'], c:'Standar' },
  { i:'__sikap', l:'Sikap AI bila ada yang kurang jelas', j:'pilih', m:'D', o:['Langsung kerjakan dengan asumsi terbaik','Tanya dulu sebelum mengerjakan'], c:'Langsung kerjakan dengan asumsi terbaik' }
];

/* ---------------- 2) MESIN PENYUSUN PROMPT ---------------- */

function teksKolom(f, v){
  if (v === undefined || v === null) return '';
  if (f.j === 'centang') return Array.isArray(v) ? v.join(', ') : '';
  return String(v).trim();
}
function barisSpesifikasi(f, v){
  if (f.j === 'area'){
    const baris = String(v).split('\n').map(s => s.trim()).filter(Boolean);
    if (!baris.length) return '';
    if (baris.length === 1) return f.l + ': ' + baris[0];
    return f.l + ':\n' + baris.map((b, idx) => '  ' + (idx + 1) + '. ' + b).join('\n');
  }
  const t = teksKolom(f, v);
  return t ? f.l + ': ' + t : '';
}
function substitusiKonteks(kalimat, vals){
  const ids = [...kalimat.matchAll(/\{(\w+)\}/g)].map(m => m[1]);
  for (const id of ids){
    if (!vals[id] || !String(vals[id]).trim()) return '';
  }
  return kalimat.replace(/\{(\w+)\}/g, (_, id) => String(vals[id]).trim());
}

/* Susun 6 blok prompt dari template + isian pengguna + pengaturan umum. */
function susunBlok(t, vals, umum){
  const blok = { peran:'', konteks:'', tugas:'', spesifikasi:[], aturan:[], format:[] };

  blok.peran = t.peran || teksKolom({ j:'teks' }, vals.peranBebas);
  blok.tugas = t.tugas || teksKolom({ j:'area' }, vals.tugasBebas);
  if (t.konteks){
    blok.konteks = t.konteks.map(k => substitusiKonteks(k, vals)).filter(Boolean).join(' ');
  }
  if (t.id === 'prompt-bebas' && vals.konteksBebas) blok.konteks = String(vals.konteksBebas).trim();

  for (const f of t.fields){
    const v = vals[f.i];
    if (f.j === 'centang'){
      const dipilih = Array.isArray(v) ? v.filter(Boolean) : [];
      if (!dipilih.length) continue;
      if (f.aturan) dipilih.forEach(item => blok.aturan.push(item));
      else blok.spesifikasi.push(f.l + ': ' + dipilih.join(', '));
    } else {
      const baris = barisSpesifikasi(f, v);
      if (!baris) continue;
      if (f.aturan) blok.aturan.push(baris.replace(/^[^:]+:\s*/, ''));
      else blok.spesifikasi.push(baris);
    }
  }

  (t.aturan || []).forEach(a => blok.aturan.push(a));

  if (t.id === 'prompt-gambar'){
    if (vals.bahasaGambar === 'Indonesia'){
      blok.aturan.push('Tulis prompt gambar dalam Bahasa Indonesia.');
    } else {
      blok.aturan.push('Tulis prompt gambar dalam Bahasa Inggris sebagai hasil utama, lalu sertakan terjemahan Bahasa Indonesianya di bawahnya.');
    }
  }
  if (t.id === 'prompt-bebas' && vals.langkahBebas){
    blok.aturan.push('Langkah pengerjaan: ' + String(vals.langkahBebas).trim().replace(/\n/g, '; '));
  }

  (t.format || []).forEach(x => blok.format.push(x));
  if (t.id === 'prompt-bebas'){
    if (vals.formatBebas) blok.format.push('Bentuk hasil: ' + vals.formatBebas + '.');
    if (vals.contohBebas) blok.format.push('Contoh hasil yang diinginkan: ' + String(vals.contohBebas).trim());
    if (vals.nadaBebas) blok.format.push('Nada & gaya jawaban: ' + vals.nadaBebas + '.');
  }
  const detail = umum.__detail || 'Standar';
  blok.format.push('Tingkat detail hasil: ' + detail + '.');
  if (t.id !== 'prompt-gambar') blok.format.push('Seluruh jawaban dalam Bahasa Indonesia.');

  const sikap = umum.__sikap || 'Langsung kerjakan dengan asumsi terbaik';
  blok.aturan.push(sikap === 'Tanya dulu sebelum mengerjakan'
    ? 'Bila ada hal yang kurang jelas atau ambigu, tanyakan dulu kepadaku sebelum mengerjakan.'
    : 'Bila ada hal yang kurang jelas, kerjakan dengan asumsi terbaik dan sebutkan asumsimu secara singkat.');

  return blok;
}

/* Bungkus blok menjadi teks akhir sesuai gaya target AI. */
function bungkus(targetId, blok){
  const B = blok;
  const md = (judul, isi) => isi ? '## ' + judul + '\n' + isi : '';
  const gabungMd = bagian => bagian.filter(Boolean).join('\n\n');

  switch (targetId){
    case 'claude': {
      const tag = (nama, isi) => isi ? '<' + nama + '>\n' + isi + '\n</' + nama + '>' : '';
      return [
        tag('peran', B.peran + (B.peran ? ' Berpikirlah secara mendalam dan terencana sebelum mulai mengerjakan.' : '')),
        tag('konteks', B.konteks),
        tag('tugas', B.tugas),
        tag('spesifikasi', B.spesifikasi.map(s => '- ' + s.replace(/\n/g, '\n  ')).join('\n')),
        tag('aturan', B.aturan.map(a => '- ' + a).join('\n')),
        tag('format_hasil', B.format.map(f => '- ' + f).join('\n'))
      ].filter(Boolean).join('\n\n');
    }
    case 'chatgpt': {
      return gabungMd([
        md('PERAN', B.peran),
        md('KONTEKS', B.konteks),
        md('TUGAS', B.tugas),
        md('SPESIFIKASI', B.spesifikasi.map(s => '- ' + s.replace(/\n/g, '\n  ')).join('\n')),
        md('ATURAN WAJIB', B.aturan.map((a, i) => (i + 1) + '. ' + a).join('\n')),
        md('FORMAT HASIL', B.format.map(f => '- ' + f).join('\n')),
        'Kerjakan langkah demi langkah mengikuti urutan di atas.'
      ]);
    }
    case 'gemini': {
      const tebal = (judul, isi) => isi ? '**' + judul + '**\n' + isi : '';
      let spek;
      const satu = B.spesifikasi.filter(s => !s.includes('\n'));
      if (B.spesifikasi.length > 6 && satu.length === B.spesifikasi.length){
        spek = '| Butir | Isi |\n|---|---|\n' + satu.map(s => {
          const p = s.indexOf(':');
          return '| ' + s.slice(0, p).trim() + ' | ' + s.slice(p + 1).trim() + ' |';
        }).join('\n');
      } else {
        spek = B.spesifikasi.map(s => '- ' + s.replace(/\n/g, '\n  ')).join('\n');
      }
      return [
        tebal('PERAN', B.peran), tebal('KONTEKS', B.konteks), tebal('TUGAS', B.tugas),
        tebal('SPESIFIKASI', spek),
        tebal('ATURAN WAJIB', B.aturan.map(a => '- ' + a).join('\n')),
        tebal('FORMAT HASIL', B.format.map(f => '- ' + f).join('\n'))
      ].filter(Boolean).join('\n\n');
    }
    case 'deepseek': {
      const blokTeks = (judul, isi) => isi ? judul + ':\n' + isi : '';
      return [
        'Kerjakan tugas berikut secara langsung dan teknis. Uraikan penalaranmu langkah demi langkah sebelum memberikan hasil akhir.',
        blokTeks('PERAN', B.peran), blokTeks('KONTEKS', B.konteks), blokTeks('TUGAS', B.tugas),
        blokTeks('SPESIFIKASI', B.spesifikasi.map((s, i) => (i + 1) + '. ' + s.replace(/\n/g, ' ')).join('\n')),
        blokTeks('ATURAN', B.aturan.map((a, i) => (i + 1) + '. ' + a).join('\n')),
        blokTeks('FORMAT HASIL', B.format.join(' '))
      ].filter(Boolean).join('\n\n');
    }
    case 'copilot': {
      const ringkas = (label, isi) => isi ? '**' + label + ':** ' + isi : '';
      return [
        ringkas('Peran', B.peran),
        ringkas('Konteks', B.konteks),
        ringkas('Tugas', B.tugas),
        ringkas('Spesifikasi', B.spesifikasi.map(s => s.replace(/\n/g, '; ')).join('; ')),
        ringkas('Aturan', B.aturan.join(' ')),
        ringkas('Format hasil', B.format.join(' '))
      ].filter(Boolean).join('\n\n');
    }
    case 'grok': {
      return gabungMd([
        md('PERAN', B.peran), md('KONTEKS', B.konteks), md('TUGAS', B.tugas),
        md('SPESIFIKASI', B.spesifikasi.map(s => '- ' + s.replace(/\n/g, '\n  ')).join('\n')),
        md('ATURAN WAJIB', B.aturan.map(a => '- ' + a).join('\n')),
        md('FORMAT HASIL', B.format.map(f => '- ' + f).join('\n')),
        'Bila kamu punya ide yang lebih baik dari spesifikasiku, usulkan sebagai variasi tambahan di akhir jawaban.'
      ]);
    }
    case 'meta': {
      const polos = (judul, isi) => isi ? judul + '\n' + isi : '';
      return [
        polos('PERAN', B.peran), polos('KONTEKS', B.konteks), polos('TUGAS', B.tugas),
        polos('SPESIFIKASI', B.spesifikasi.map((s, i) => (i + 1) + '. ' + s.replace(/\n/g, ' ')).join('\n')),
        polos('ATURAN', B.aturan.map((a, i) => (i + 1) + '. ' + a).join('\n')),
        polos('FORMAT HASIL', B.format.map((f, i) => (i + 1) + '. ' + f).join('\n'))
      ].filter(Boolean).join('\n\n');
    }
    case 'qwen':
    case 'universal':
    default: {
      return gabungMd([
        md('PERAN', B.peran), md('KONTEKS', B.konteks), md('TUGAS', B.tugas),
        md('SPESIFIKASI', B.spesifikasi.map(s => '- ' + s.replace(/\n/g, '\n  ')).join('\n')),
        md('ATURAN WAJIB', B.aturan.map(a => '- ' + a).join('\n')),
        md('FORMAT HASIL', B.format.map(f => '- ' + f).join('\n'))
      ]);
    }
  }
}

function buatPrompt(t, vals, umum, targetId){
  return bungkus(targetId, susunBlok(t, vals, umum));
}

/* Ekspos untuk pengujian (tidak berpengaruh di peramban) */
if (typeof globalThis !== 'undefined'){
  globalThis.ATIGA = { KATEGORI, TARGET_AI, TEMPLATE, KOLOM_UMUM, susunBlok, bungkus, buatPrompt };
}

/* ---------------- 3) UI (hanya di peramban) ---------------- */
if (typeof document !== 'undefined'){

const $ = id => document.getElementById(id);
const KUNCI_TEMA = 'atiga-prompter-tema';
const KUNCI_PUSTAKA = 'atiga-prompter-pustaka';
const KUNCI_DRAF = 'atiga-prompter-draf';
const KUNCI_PILIHAN = 'atiga-prompter-pilihan';

function bacaJSON(kunci, bawaan){
  try { const v = localStorage.getItem(kunci); return v ? JSON.parse(v) : bawaan; }
  catch (e) { return bawaan; }
}
function tulisJSON(kunci, nilai){
  try { localStorage.setItem(kunci, JSON.stringify(nilai)); } catch (e) { /* abaikan */ }
}

const state = {
  kategori: 'blog',
  templateId: 'artikel-blog',
  mode: 'cepat',
  target: 'universal',
  nilai: {},          // nilai kolom template aktif: { idKolom: nilai }
  umum: {},           // nilai kolom umum template aktif
  draf: bacaJSON(KUNCI_DRAF, {}),
  pustaka: bacaJSON(KUNCI_PUSTAKA, []),
  pratinjauManual: false
};

const pilihanLama = bacaJSON(KUNCI_PILIHAN, null);
if (pilihanLama){
  if (KATEGORI.some(k => k.id === pilihanLama.kategori)) state.kategori = pilihanLama.kategori;
  if (TEMPLATE.some(t => t.id === pilihanLama.templateId)) state.templateId = pilihanLama.templateId;
  if (pilihanLama.mode === 'detail') state.mode = 'detail';
  if (TARGET_AI.some(a => a.id === pilihanLama.target)) state.target = pilihanLama.target;
}
const templateAktif = () => TEMPLATE.find(t => t.id === state.templateId) || TEMPLATE[0];
const targetAktif = () => TARGET_AI.find(a => a.id === state.target) || TARGET_AI[0];

function simpanPilihan(){
  tulisJSON(KUNCI_PILIHAN, { kategori: state.kategori, templateId: state.templateId, mode: state.mode, target: state.target });
}
function muatDrafTemplate(){
  const d = state.draf[state.templateId] || {};
  state.nilai = Object.assign({}, d.nilai || {});
  state.umum = Object.assign({ __detail: 'Standar', __sikap: 'Langsung kerjakan dengan asumsi terbaik' }, d.umum || {});
}
function simpanDraf(){
  state.draf[state.templateId] = { nilai: state.nilai, umum: state.umum };
  tulisJSON(KUNCI_DRAF, state.draf);
}

/* ---------- Pemberitahuan ---------- */
let timerToast = null;
function toast(pesan){
  const el = $('pemberitahuan');
  el.textContent = pesan;
  el.classList.add('tampil');
  clearTimeout(timerToast);
  timerToast = setTimeout(() => el.classList.remove('tampil'), 3200);
}

/* ---------- Tema ---------- */
function terapkanTema(gelap){
  if (gelap) document.documentElement.setAttribute('data-theme', 'gelap');
  else document.documentElement.removeAttribute('data-theme');
  $('tombolTema').textContent = gelap ? '☀️ Terang' : '🌙 Gelap';
  try { localStorage.setItem(KUNCI_TEMA, gelap ? 'gelap' : 'terang'); } catch (e) {}
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
    const jumlah = TEMPLATE.filter(t => t.kategori === k.id).length;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'kartu-kategori' + (!kata && k.id === state.kategori ? ' aktif' : '');
    b.setAttribute('role', 'listitem');
    b.innerHTML = '<span class="ikon">' + k.ikon + '</span><strong>' + k.nama + '</strong><small>' + k.deskripsi + ' · ' + jumlah + ' template</small>';
    b.addEventListener('click', () => {
      state.kategori = k.id;
      const pertama = TEMPLATE.find(t => t.kategori === k.id);
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
    daftar = TEMPLATE.filter(t => (t.nama + ' ' + t.deskripsi).toLowerCase().includes(kata));
    $('labelTemplate').textContent = '— hasil pencarian "' + $('cariTemplate').value.trim() + '"';
  } else {
    daftar = TEMPLATE.filter(t => t.kategori === state.kategori);
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
  const t = TEMPLATE.find(x => x.id === id);
  if (!t) return;
  state.templateId = id;
  state.kategori = t.kategori;
  state.pratinjauManual = false;
  muatDrafTemplate();
  renderForm();
  simpanPilihan();
}
$('cariTemplate').addEventListener('input', () => { renderKategori(); renderDaftarTemplate(); });

/* ---------- Mode & target ---------- */
function renderMode(){
  $('modeCepat').classList.toggle('aktif', state.mode === 'cepat');
  $('modeDetail').classList.toggle('aktif', state.mode === 'detail');
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
    b.textContent = a.nama;
    b.addEventListener('click', () => {
      state.target = a.id;
      state.pratinjauManual = false;
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
  let html = '<label for="' + idEl + '">' + f.l +
    (f.w ? ' <span class="wajib" title="Wajib diisi">*</span>' : '') +
    (f.m === 'D' ? '<span class="mode-lencana">Detail</span>' : '') + '</label>';

  if (f.j === 'teks' || f.j === 'angka'){
    html += '<input id="' + idEl + '" type="' + (f.j === 'angka' ? 'number' : 'text') + '" placeholder="' + (f.ph || '') + '">';
  } else if (f.j === 'area'){
    html += '<textarea id="' + idEl + '" rows="3" placeholder="' + (f.ph || '') + '"></textarea>';
  } else if (f.j === 'pilih'){
    html += '<select id="' + idEl + '"><option value="">— pilih —</option>' +
      f.o.map(o => '<option value="' + o + '">' + o + '</option>').join('') + '</select>';
  } else if (f.j === 'centang'){
    html += '<div class="kotak-centang" id="' + idEl + '">' +
      f.o.map((o, idx) => '<label><input type="checkbox" value="' + o + '" data-idx="' + idx + '"> ' + o + '</label>').join('') + '</div>';
  }
  if (f.h) html += '<p class="contoh">' + f.h + '</p>';
  else if (f.c && f.j !== 'centang') html += '<p class="contoh">Contoh: ' + String(f.c).split('\n')[0] + '</p>';
  bungkus.innerHTML = html;

  const el = bungkus.querySelector('#' + CSS.escape(idEl));
  if (f.j === 'centang'){
    const terpilih = Array.isArray(nilaiAwal) ? nilaiAwal : [];
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = terpilih.includes(cb.value);
      cb.addEventListener('change', () => {
        wadahNilai[f.i] = [...el.querySelectorAll('input[type="checkbox"]:checked')].map(x => x.value);
        bungkus.classList.remove('kurang');
        state.pratinjauManual = false;
        simpanDraf(); perbaruiPreview();
      });
    });
  } else {
    el.value = nilaiAwal !== undefined && nilaiAwal !== null ? nilaiAwal : '';
    el.addEventListener('input', () => {
      wadahNilai[f.i] = el.value;
      bungkus.classList.remove('kurang');
      state.pratinjauManual = false;
      simpanDraf(); perbaruiPreview();
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

  let grupKini = null, fieldsetKini = null;
  const tambahKolom = (f, wadahNilai) => {
    if (!kolomTerlihat(f)) return;
    if (f.g){
      if (f.g !== grupKini){
        grupKini = f.g;
        fieldsetKini = document.createElement('fieldset');
        fieldsetKini.className = 'grup-kolom';
        fieldsetKini.innerHTML = '<legend>' + f.g + '</legend>';
        form.appendChild(fieldsetKini);
      }
      fieldsetKini.appendChild(buatInput(f, wadahNilai[f.i], wadahNilai));
    } else {
      form.appendChild(buatInput(f, wadahNilai[f.i], wadahNilai));
    }
  };
  t.fields.forEach(f => tambahKolom(f, state.nilai));

  const fsUmum = document.createElement('fieldset');
  fsUmum.className = 'grup-kolom';
  fsUmum.innerHTML = '<legend>Pengaturan Hasil</legend>';
  KOLOM_UMUM.forEach(f => {
    if (kolomTerlihat(f)) fsUmum.appendChild(buatInput(f, state.umum[f.i], state.umum));
  });
  form.appendChild(fsUmum);
  perbaruiPreview();
}

/* ---------- Preview ---------- */
function perbaruiPreview(){
  if (state.pratinjauManual) { perbaruiHitungan(); return; }
  const teks = buatPrompt(templateAktif(), state.nilai, state.umum, state.target);
  $('areaPreview').value = teks;
  perbaruiHitungan();
  $('statusSalin').textContent = '';
}
function perbaruiHitungan(){
  $('jumlahKarakter').textContent = $('areaPreview').value.length.toLocaleString('id-ID') + ' karakter';
}
$('areaPreview').addEventListener('input', () => { state.pratinjauManual = true; perbaruiHitungan(); });

/* ---------- Validasi ---------- */
function validasi(){
  const t = templateAktif();
  const kurang = [];
  const periksa = (f, wadahNilai) => {
    if (!f.w || !kolomTerlihat(f)) return;
    const v = wadahNilai[f.i];
    const kosong = f.j === 'centang' ? !(Array.isArray(v) && v.length) : !String(v || '').trim();
    if (kosong){
      kurang.push(f.l);
      const el = document.querySelector('[data-kolom="' + f.i + '"]');
      if (el) el.classList.add('kurang');
    }
  };
  t.fields.forEach(f => periksa(f, state.nilai));
  KOLOM_UMUM.forEach(f => periksa(f, state.umum));
  if (kurang.length){
    toast('Masih ada kolom wajib yang kosong: ' + kurang[0] + (kurang.length > 1 ? ' dan ' + (kurang.length - 1) + ' lainnya.' : '.'));
    const el = document.querySelector('.kolom.kurang');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
$('tombolSalin').addEventListener('click', async () => {
  if (!validasi()) return;
  const ok = await salinTeks($('areaPreview').value);
  $('statusSalin').textContent = ok ? '✅ Prompt tersalin — tempel (Ctrl+V) di AI tujuanmu.' : '';
  toast(ok ? 'Prompt berhasil disalin.' : 'Gagal menyalin otomatis — blok teks pratinjau lalu salin manual (Ctrl+C).');
});

function renderMenuKirim(){
  const menu = $('menuKirim');
  menu.innerHTML = '';
  for (const a of TARGET_AI){
    if (!a.url) continue;
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = '🚀 ' + a.nama;
    b.addEventListener('click', () => { menu.hidden = true; kirimKeAI(a); });
    menu.appendChild(b);
  }
}
async function kirimKeAI(a){
  if (!validasi()) return;
  const teks = $('areaPreview').value;
  await salinTeks(teks);
  let alamat = a.url;
  if (a.id === 'chatgpt' && teks.length <= 3000){
    alamat = 'https://chatgpt.com/?q=' + encodeURIComponent(teks);
    toast('Prompt terisi otomatis di ChatGPT (tab baru).');
  } else {
    toast('Prompt tersalin — tempel (Ctrl+V) di tab ' + a.nama + ' yang terbuka.');
  }
  window.open(alamat, '_blank', 'noopener');
}
$('tombolKirim').addEventListener('click', () => {
  const menu = $('menuKirim');
  menu.hidden = !menu.hidden;
});
document.addEventListener('click', e => {
  if (!e.target.closest('.menu-kirim')) $('menuKirim').hidden = true;
});

/* ---------- Isi contoh & reset ---------- */
$('tombolContoh').addEventListener('click', () => {
  const t = templateAktif();
  t.fields.forEach(f => { if (f.c !== undefined) state.nilai[f.i] = f.c; });
  KOLOM_UMUM.forEach(f => { if (f.c !== undefined) state.umum[f.i] = f.c; });
  state.pratinjauManual = false;
  simpanDraf(); renderForm();
  toast('Formulir terisi contoh untuk template ' + t.nama + '. Silakan ubah seperlunya.');
});
$('tombolReset').addEventListener('click', () => {
  state.nilai = {};
  state.umum = { __detail: 'Standar', __sikap: 'Langsung kerjakan dengan asumsi terbaik' };
  state.pratinjauManual = false;
  simpanDraf(); renderForm();
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
  tulisJSON(KUNCI_PUSTAKA, state.pustaka);
  renderPustaka();
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
    favorit: false,
    waktu: Date.now()
  });
  simpanPustaka();
  toast('Tersimpan di Pustaka Saya.');
  document.getElementById('pustaka').scrollIntoView({ behavior: 'smooth' });
});
function renderPustaka(){
  const wadah = $('daftarPustaka');
  const kata = $('cariPustaka').value.trim().toLowerCase();
  const daftar = state.pustaka
    .filter(p => !kata || (p.nama + ' ' + p.templateNama + ' ' + p.teks).toLowerCase().includes(kata))
    .sort((a, b) => (b.favorit - a.favorit) || (b.waktu - a.waktu));
  $('jumlahPustaka').textContent = state.pustaka.length + ' prompt';
  wadah.innerHTML = '';
  if (!daftar.length){
    wadah.innerHTML = '<p class="kosong">' + (state.pustaka.length ? 'Tidak ada yang cocok dengan pencarian.' : 'Belum ada prompt tersimpan. Buat prompt lalu tekan "Simpan ke Pustaka".') + '</p>';
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
    state.pratinjauManual = true;
    $('areaPreview').value = p.teks;
    const tAda = TARGET_AI.some(a => a.id === p.target);
    if (tAda){ state.target = p.target; renderTarget(); }
    state.pratinjauManual = true;
    perbaruiHitungan();
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
    simpanPustaka(); toast('Prompt diduplikat.');
  }
  if (aksi === 'hapus'){
    if (!window.confirm('Hapus prompt "' + p.nama + '" dari Pustaka?')) return;
    state.pustaka = state.pustaka.filter(x => x.id !== p.id);
    simpanPustaka(); toast('Prompt dihapus dari Pustaka.');
  }
}
$('cariPustaka').addEventListener('input', renderPustaka);
$('tombolEksporJson').addEventListener('click', () => {
  if (!state.pustaka.length){ toast('Pustaka masih kosong.'); return; }
  unduh('atiga-prompter-pustaka.json', JSON.stringify(state.pustaka, null, 2), 'application/json');
});
$('berkasImpor').addEventListener('change', e => {
  const berkas = e.target.files[0];
  if (!berkas) return;
  const pembaca = new FileReader();
  pembaca.onload = () => {
    try {
      const data = JSON.parse(pembaca.result);
      if (!Array.isArray(data)) throw new Error('bukan array');
      let ditambah = 0;
      for (const item of data){
        if (item && typeof item.teks === 'string' && typeof item.nama === 'string'){
          state.pustaka.unshift({
            id: 'p' + Date.now().toString(36) + ditambah,
            nama: item.nama, templateId: item.templateId || '', templateNama: item.templateNama || 'Impor',
            target: item.target || 'universal', teks: item.teks, favorit: !!item.favorit, waktu: item.waktu || Date.now()
          });
          ditambah++;
        }
      }
      simpanPustaka();
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
renderMenuKirim();
renderForm();
renderPustaka();
simpanPilihan();

} /* akhir blok UI */
