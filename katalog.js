/* ============================================================
   ATIGA PROMPTER — katalog.js
   Data katalog: KATEGORI, TARGET_AI, TEMPLATE (17 template), KOLOM_UMUM.
   Urutan TEMPLATE = urutan tampil di layar pilihan.

   Cara menambah template: tambahkan satu objek ke TEMPLATE dengan
   kategori yang sudah ada di KATEGORI.
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

(function(){
  const KATEGORI = [
    { id:'materi',       ikon:'📚', nama:'Perencanaan & Materi', deskripsi:'Modul ajar, LKPD, dan slide presentasi' },
    { id:'asesmen',      ikon:'🧾', nama:'Asesmen & Penilaian',   deskripsi:'Bank soal, kuis, rubrik, dan rekap nilai' },
    { id:'administrasi', ikon:'🗂️', nama:'Administrasi Guru',    deskripsi:'Absensi, jurnal, dan laporan perkembangan siswa' },
    { id:'mpi',          ikon:'🎓', nama:'Media Pembelajaran',    deskripsi:'MPI, simulasi, dan game edukasi untuk kelas' },
    { id:'media',        ikon:'🎨', nama:'Gambar & Infografis',   deskripsi:'Visual edukasi untuk materi dan kelas' },
    { id:'umum',         ikon:'🧩', nama:'Lainnya',               deskripsi:'Aplikasi web bebas dan prompt universal' }
  ];

  const TARGET_AI = [
    { id:'universal', nama:'Universal', ikon:'icons/ai/universal.svg',   url:null,                              batasToken:12000, petunjuk:'Format Markdown polos — aman ditempel ke AI apa pun.' },
    { id:'chatgpt',   nama:'ChatGPT',   ikon:'icons/ai/chatgpt.svg',     url:'https://chatgpt.com/',            batasToken:12000, petunjuk:'Markdown dengan aturan bernomor. Prompt disalin ke clipboard sebelum situs dibuka.' },
    { id:'claude',    nama:'Claude',    ikon:'icons/ai/claude.svg',      url:'https://claude.ai/new',           batasToken:16000, petunjuk:'Dibungkus tag XML — paling rapi untuk konteks panjang dan Mode Detail.' },
    { id:'gemini',    nama:'Gemini',    ikon:'icons/ai/gemini.svg',      url:'https://gemini.google.com/app',   batasToken:16000, petunjuk:'Judul tebal; spesifikasi yang panjang ditampilkan sebagai tabel.' },
    { id:'deepseek',  nama:'DeepSeek',  ikon:'icons/ai/deepseek.svg',    url:'https://chat.deepseek.com/',      batasToken:12000, petunjuk:'Instruksi langsung dan teknis, dengan pemeriksaan keluaran internal.' },
    { id:'qwen',      nama:'Qwen',      ikon:'icons/ai/qwen.svg',        url:'https://chat.qwen.ai/',           batasToken:12000, petunjuk:'Markdown rapi; aman untuk konteks panjang.' },
    { id:'copilot',   nama:'Copilot',   ikon:'icons/ai/copilot.svg',     url:'https://copilot.microsoft.com/',  batasToken:8000,  petunjuk:'Ringkas dan padat — paling cocok dipadukan dengan Mode Cepat.' },
    { id:'grok',      nama:'Grok',      ikon:'icons/ai/grok.svg',        url:'https://grok.com/',               batasToken:12000, petunjuk:'Gaya langsung dengan kontrak keluaran tetap berlaku.' },
    { id:'meta',      nama:'Meta AI',   ikon:'icons/ai/meta.svg',        url:'https://www.meta.ai/',            batasToken:8000,  petunjuk:'Format percakapan terstruktur dengan daftar bernomor.' },
    { id:'muse',      nama:'Muse',      ikon:'icons/ai/muse.svg',        url:'https://muse.ai/',                batasToken:12000, petunjuk:'Agen AI Meta — Markdown dengan aturan bernomor dan larangan tindakan di luar percakapan.' }
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

  const mapelModul = v => String(v.mapel || '').trim() || 'yang dipilih pengguna';

  /* Acuan resmi yang sama untuk semua mata pelajaran pada template Perencanaan & Materi serta Asesmen. */
  const acuanResmi = v => '1) Panduan Mata Pelajaran ' + mapelModul(v) + ' resmi Kemendikdasmen (https://kurikulum.kemendikdasmen.go.id/panduan-mapel); ' +
    '2) Panduan Pembelajaran dan Asesmen Edisi Revisi 2025 (BSKAP Kemendikdasmen; https://kurikulum.kemendikdasmen.go.id/rujukan/panduan-panduan-kurikulum); ' +
    '3) Keputusan Kepala BSKAP No. 046/H/KR/2025 beserta lampiran CP (https://kurikulum.kemendikdasmen.go.id/file/1753929861_manage_file.pdf).';
  const aturanAcuan = fokus => v => 'Sumber acuan resmi untuk semua mata pelajaran: ' + acuanResmi(v) + ' ' + (typeof fokus === 'function' ? fokus(v) : fokus) +
    ' Jika isi dokumen tersebut tidak tersedia bagi Anda, jangan mengutip atau mengarang rumusannya; tandai bagian yang bergantung padanya dengan [PERLU DIPERIKSA GURU].';

  const TEMPLATE = [

  /* ---------- Perencanaan & Materi ---------- */
  {
    id:'modul-ajar', kategori:'materi', ikon:'📘', nama:'Modul Ajar / RPP Ringkas',
    deskripsi:'Modul ajar / RPP ringkas berbasis Perencanaan Pembelajaran Mendalam dan CP resmi 2025.',
    peran: v => 'Anda adalah penyusun dokumen perencanaan pembelajaran yang berpengalaman. Gunakan Panduan Mata Pelajaran ' + mapelModul(v) + ', Panduan Pembelajaran dan Asesmen Edisi Revisi 2025, serta Keputusan Kepala BSKAP No. 046/H/KR/2025 sebagai acuan.',
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
      { i:'cp', l:'CP resmi (wajib ditempel)', j:'area', m:'C', w:true, g:'B. Desain Pembelajaran', ph:'Tempel bagian CP yang relevan dari Panduan Mata Pelajaran (kurikulum.kemendikdasmen.go.id/panduan-mapel) atau Lampiran Kep. BSKAP No. 046/H/KR/2025…', c:'Murid dapat menggunakan rasio (skala, proporsi, dan laju perubahan) dalam penyelesaian masalah.' },
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
      aturanAcuan(v => 'Gunakan Panduan Mata Pelajaran ' + mapelModul(v) + ' untuk elemen dan karakteristik mata pelajaran, Panduan Pembelajaran dan Asesmen untuk prinsip perencanaan, pengalaman belajar, dan asesmen, serta Kep. BSKAP No. 046/H/KR/2025 untuk CP. Jangan memakai panduan mata pelajaran lain.'),
      'CP harus diperlakukan sebagai teks sumber. Jangan mengubah, meringkas, atau mengarang rumusan CP. Jika CP tidak lengkap, tandai [CP PERLU DIPERIKSA GURU].',
      'Selaraskan TP dengan CP, fase, elemen, dan topik. Jika TP diturunkan oleh AI, tandai sebagai "Rancangan TP" dan gunakan tujuan yang dapat diamati.',
      v => 'Hubungkan kegiatan dan asesmen dengan elemen CP yang dipilih serta keterampilan khas mata pelajaran ' + mapelModul(v) + ' sesuai Panduan Mata Pelajarannya.',
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
      { i:'kelasLkpd', l:'Kelas', j:'teks', m:'C', w:true, ph:'mis. VIII SMP', c:'VIII SMP' },
      { i:'mapel', l:'Mata pelajaran', j:'teks', m:'C', w:true, ph:'mis. Matematika', c:'IPA' },
      { i:'materiLkpd', l:'Materi', j:'teks', m:'C', w:true, ph:'mis. Sistem Pencernaan Manusia', c:'Sistem Pencernaan Manusia' },
      { i:'tujuanKegiatan', l:'Tujuan kegiatan', j:'area', m:'C', w:true, ph:'Satu baris satu tujuan…', c:'Mengamati dan mencatat urutan organ pencernaan\nMenjelaskan fungsi tiap organ' },
      { i:'jenisKegiatan', l:'Jenis kegiatan', j:'pilih', m:'C', w:true, o:['Pengamatan','Percobaan','Diskusi','Latihan soal','Proyek mini'], c:'Pengamatan' },
      { i:'jumlahTugas', l:'Jumlah & jenis soal / tugas', j:'teks', m:'C', ph:'mis. 5 tugas pengamatan + 3 soal refleksi', c:'5 tugas pengamatan + 3 soal refleksi' },
      { i:'kunci', l:'Kunci jawaban untuk guru', j:'pilih', m:'D', o:['Sertakan terpisah di akhir','Tidak perlu'], c:'Sertakan terpisah di akhir' },
      { i:'formatCetak', l:'Format cetak', j:'pilih', m:'D', o:['Dokumen biasa siap salin ke Word','Kode LaTeX A4 siap cetak'], c:'Dokumen biasa siap salin ke Word' }
    ],
    aturan:[
      aturanAcuan('Selaraskan tujuan, tingkat kesulitan, dan istilah dengan CP serta fase yang relevan; isi materi tetap berasal dari data yang diberikan pengguna.'),
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
    id:'slide-presentasi', kategori:'materi', ikon:'🖥️', nama:'Slide Presentasi',
    deskripsi:'Membuat file presentasi siap unduh dengan alur, sistem desain, dan visual yang konsisten.',
    peran:'Anda adalah desainer presentasi profesional, instructional designer, dan pembuat file PowerPoint. Anda mengubah materi menjadi presentasi yang ringkas, runtut, mudah dipahami, dan memiliki sistem desain visual yang konsisten.',
    tugas:'Buat presentasi final berdasarkan materi dan tujuan berikut dalam Format keluaran yang dipilih. Hasil utama wajib berupa satu file presentasi yang dapat langsung diunduh dan dibuka. Jangan berhenti pada outline, rancangan, atau daftar isi slide.',
    fields:[
      { i:'audiens', l:'Hadirin / audiens', j:'teks', m:'C', w:true, ph:'mis. siswa SMP kelas VII', c:'siswa SMP kelas VII' },
      { i:'mapel', l:'Mata pelajaran', j:'teks', m:'C', w:true, ph:'mis. Matematika', c:'Matematika' },
      { i:'topikSlide', l:'Topik presentasi', j:'teks', m:'C', w:true, ph:'mis. Pengenalan Bilangan Bulat', c:'Pengenalan Bilangan Bulat' },
      { i:'tujuanPresentasi', l:'Tujuan presentasi', j:'teks', m:'C', w:true, ph:'mis. siswa memahami bilangan negatif lewat contoh suhu dan utang', c:'siswa memahami bilangan negatif lewat contoh sehari-hari' },
      { i:'gayaSampai', l:'Gaya penyampaian', j:'pilih', m:'D', o:['Mengajar','Seminar','Promosi','Laporan'], c:'Mengajar' },
      { i:'jumlahSlide', l:'Jumlah slide', j:'angka', m:'C', w:true, ph:'mis. 10', c:'10' },
      { i:'formatKeluaran', l:'Format keluaran', j:'pilih', m:'C', w:true, o:['PowerPoint (.pptx) — buat dan lampirkan file','PDF (.pdf) — buat dan lampirkan file','HTML slide mandiri (.html) — buat dan lampirkan file'], c:'PowerPoint (.pptx) — buat dan lampirkan file' },
      { i:'visual', l:'Kebutuhan visual per slide', j:'pilih', m:'C', o:['Gunakan gambar / diagram yang relevan','Teks saja'], c:'Gunakan gambar / diagram yang relevan' },
      { i:'gayaVisual', l:'Gaya visual presentasi', j:'pilih', m:'C', o:['Modern edukatif — biru tua, hijau, dan kuning lembut','Minimal profesional — monokrom dengan satu warna aksen','Cerah ramah — warna hangat dengan kontras tinggi'], c:'Modern edukatif — biru tua, hijau, dan kuning lembut' },
      { i:'arahVisual', l:'Arahan visual khusus (opsional)', j:'area', m:'D', ph:'Jelaskan visual, contoh, atau identitas yang ingin ditampilkan…', c:'Gunakan diagram alur, ikon sederhana, dan mockup antarmuka. Hindari gambar dekoratif yang tidak membantu pemahaman.' }
    ],
    aturan:[
      aturanAcuan('Selaraskan tujuan, tingkat kesulitan, dan istilah dengan CP serta fase yang relevan; isi materi tetap berasal dari data yang diberikan pengguna.'),
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

  /* ---------- Asesmen & Penilaian ---------- */
  {
    id:'bank-soal', kategori:'asesmen', ikon:'🗂️', nama:'Bank Soal',
    deskripsi:'Paket soal dari materi sumbermu, lengkap dengan kunci dan pembahasan.',
    peran:'Anda adalah penyusun soal berpengalaman yang menulis soal yang valid, jelas, dan sesuai jenjang kognitif yang diminta.',
    tugas:'Susunlah satu paket soal yang lengkap dan siap digunakan berdasarkan spesifikasi berikut. Soal hanya boleh dibuat dari materi atau ruang lingkup yang diberikan, lalu tampilkan kunci dan pembahasan sesuai pilihan pengguna.',
    fields:[
      { i:'jenjangKelas', l:'Jenjang & kelas', j:'teks', m:'C', w:true, ph:'mis. SMP Kelas VII', c:'SMP Kelas VII' },
      { i:'mapel', l:'Mata pelajaran', j:'teks', m:'C', w:true, ph:'mis. Matematika', c:'Matematika' },
      { i:'ruangLingkup', l:'Materi & ruang lingkup (materi sumber)', j:'area', m:'C', w:true, ph:'Tempel materi sumber atau jabarkan ruang lingkupnya…', c:'Bilangan bulat: pengertian, garis bilangan, membandingkan, dan operasi hitung campuran.' },
      { i:'jumlahBentuk', l:'Jumlah & bentuk soal', j:'teks', m:'C', w:true, ph:'mis. 10 pilihan ganda, 3 esai', c:'10 pilihan ganda, 2 esai' },
      { i:'kognitif', l:'Tingkat kesulitan & jenjang kognitif', j:'pilih', m:'C', o:['Campuran C1–C3','Sampai C4 (menganalisis)','Fokus HOTS'], c:'Campuran C1–C3' },
      { i:'kunciBahasan', l:'Kunci & pembahasan', j:'pilih', m:'C', w:true, o:['Kunci saja','Kunci + pembahasan','Kunci + pembahasan + rubrik esai'], c:'Kunci + pembahasan' },
      { i:'kisi', l:'Tabel spesifikasi / kisi-kisi', j:'pilih', m:'D', o:['Sertakan sebelum soal','Tidak perlu'], c:'Sertakan sebelum soal' }
    ],
    aturan:[
      aturanAcuan('Terapkan prinsip asesmen dari Panduan Pembelajaran dan Asesmen dan selaraskan dengan CP serta fase yang relevan; isi soal tetap hanya berasal dari materi sumber yang diberikan.'),
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
    id:'kuis-interaktif', kategori:'asesmen', ikon:'❓', nama:'Kuis Interaktif',
    deskripsi:'Kuis dengan soal dari materimu, lengkap dengan pembahasan dan skor.',
    peran:'Anda adalah pengembang kuis interaktif dan penyusun soal berpengalaman yang membuat kuis satu file HTML.',
    tugas:'Buatlah satu kuis interaktif yang lengkap dan siap dipakai berdasarkan spesifikasi berikut. Hasil akhir harus berupa kuis yang dapat langsung dimainkan dan seluruh soalnya harus disusun hanya dari materi sumber yang diberikan.',
    fields:[
      { i:'jenjangKelas', l:'Jenjang & kelas', j:'teks', m:'C', w:true, ph:'mis. SMP Kelas VII', c:'SMP Kelas VII' },
      { i:'mapel', l:'Mata pelajaran', j:'teks', m:'C', w:true, ph:'mis. Matematika', c:'Matematika' },
      { i:'topik', l:'Topik kuis', j:'teks', m:'C', w:true, ph:'mis. Bilangan Bulat', c:'Bilangan Bulat' },
      { i:'materiSumber', l:'Materi sumber soal', j:'area', m:'C', w:true, ph:'Tempel materi di sini agar soal tidak mengarang…', c:'Bilangan bulat terdiri dari bilangan positif, nol, dan negatif. Operasi hitung campuran dikerjakan dengan urutan: kurung, kali/bagi, lalu tambah/kurang.' },
      { i:'jenisSoal', l:'Jenis soal', j:'centang', m:'C', w:true, o:['Pilihan ganda','Benar–salah','Isian singkat','Menjodohkan'], c:['Pilihan ganda'] },
      { i:'jumlahSoal', l:'Jumlah soal', j:'angka', m:'C', w:true, ph:'mis. 10', c:'10' },
      { i:'kesulitan', l:'Tingkat kesulitan', j:'pilih', m:'C', w:true, o:['Mudah','Sedang','Sulit','Campuran bertingkat'], c:'Campuran bertingkat' },
      { i:'timer', l:'Timer per soal', j:'pilih', m:'D', o:['Tanpa timer','15 detik','30 detik','60 detik'], c:'30 detik' },
      { i:'pembahasan', l:'Pembahasan tiap soal', j:'pilih', m:'D', o:['Tampilkan pembahasan','Tanpa pembahasan'], c:'Tampilkan pembahasan' },
      { i:'hasil', l:'Hasil akhir', j:'centang', m:'D', o:['Skor akhir','Predikat / nilai huruf','Tombol ulangi kuis','Daftar jawaban salah'], c:['Skor akhir','Tombol ulangi kuis','Daftar jawaban salah'] }
    ],
    aturan:[
      aturanAcuan('Terapkan prinsip asesmen dari Panduan Pembelajaran dan Asesmen dan selaraskan dengan CP serta fase yang relevan; isi soal tetap hanya berasal dari materi sumber yang diberikan.'),
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
  {
    id:'rubrik-penilaian', kategori:'asesmen', ikon:'📐', nama:'Rubrik & Penilaian',
    deskripsi:'Membuat rubrik, menilai karya siswa, dan menghasilkan skor serta umpan balik.',
    peran:'Anda adalah pengembang alat asesmen yang membantu guru membuat rubrik yang jelas, konsisten, dan mudah digunakan saat menilai pekerjaan siswa.',
    tugas:'Buatlah satu aplikasi web rubrik dan penilaian yang lengkap dan siap dipakai. Guru harus dapat menentukan kriteria, memilih level pencapaian, menilai beberapa siswa, lalu memperoleh skor dan umpan balik yang dapat diperiksa.',
    konteks:['Rubrik ini digunakan untuk {tugasRubrik} pada {kelasRubrik}.'],
    fields:[
      { i:'kelasRubrik', l:'Jenjang dan kelas', j:'teks', m:'C', w:true, ph:'mis. SMP kelas VIII', c:'SMP kelas VIII' },
      { i:'mapel', l:'Mata pelajaran', j:'teks', m:'C', w:true, ph:'mis. Matematika', c:'IPA' },
      { i:'tugasRubrik', l:'Tugas / karya yang dinilai', j:'teks', m:'C', w:true, ph:'mis. presentasi proyek pencemaran lingkungan', c:'presentasi proyek pencemaran lingkungan' },
      { i:'tujuanRubrik', l:'Tujuan atau kompetensi yang dinilai', j:'area', m:'C', w:true, ph:'Satu baris satu tujuan…', c:'Menjelaskan hubungan sebab-akibat\nMenggunakan bukti yang relevan\nMenyampaikan gagasan dengan jelas' },
      { i:'kriteriaRubrik', l:'Kriteria penilaian', j:'area', m:'C', w:true, ph:'Satu baris satu kriteria…', c:'Ketepatan isi\nPenggunaan bukti\nKejelasan komunikasi' },
      { i:'levelRubrik', l:'Level pencapaian', j:'teks', m:'C', w:true, ph:'mis. 4 level: Sangat baik, Baik, Cukup, Perlu bimbingan', c:'4 level: Sangat baik, Baik, Cukup, Perlu bimbingan' },
      { i:'bobotRubrik', l:'Bobot kriteria (opsional)', j:'area', m:'D', ph:'Satu baris satu bobot…', c:'Ketepatan isi 40%\nPenggunaan bukti 30%\nKejelasan komunikasi 30%' },
      { i:'dataSiswaRubrik', l:'Nama siswa / hasil penilaian awal', j:'area', m:'D', ph:'Satu nama per baris atau tempel data…', c:'Alya\nBima\nCitra' },
      { i:'fiturRubrik', l:'Fitur tambahan', j:'centang', m:'D', aturan:true, o:['Skor otomatis','Umpan balik per kriteria','Penilaian beberapa siswa','Edit rubrik','Cetak rubrik kosong','Ekspor hasil','Simpan di perangkat (localStorage)'], c:['Skor otomatis','Umpan balik per kriteria','Penilaian beberapa siswa','Cetak rubrik kosong','Simpan di perangkat (localStorage)'] }
    ],
    aturan:[
      aturanAcuan('Terapkan prinsip asesmen dan pengolahan hasil asesmen dari Panduan Pembelajaran dan Asesmen pada istilah, alur, dan laporan aplikasi; semua nilai dan hasil tetap berasal dari data yang dimasukkan guru.'),
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
    id:'rekap-nilai', kategori:'asesmen', ikon:'🧾', nama:'Rekap Nilai & Analisis Hasil Belajar',
    deskripsi:'Mengolah nilai siswa menjadi rekap, ringkasan, dan analisis yang mudah dibaca.',
    peran:'Anda adalah pengembang aplikasi penilaian kelas yang teliti, memahami alur kerja guru, dan menyajikan data hasil belajar secara jujur serta mudah diperiksa.',
    tugas:'Buatlah satu aplikasi web rekap nilai dan analisis hasil belajar yang lengkap dan siap dipakai berdasarkan spesifikasi berikut. Hasil akhir harus benar-benar dapat menerima data, menghitung nilai, dan menampilkan rekap, bukan sekadar mockup atau tabel contoh.',
    konteks:['Aplikasi ini digunakan oleh {penggunaNilai} untuk mengelola hasil belajar {kelasNilai}.'],
    fields:[
      { i:'penggunaNilai', l:'Pengguna aplikasi', j:'teks', m:'C', w:true, ph:'mis. guru SMP', c:'guru SMP' },
      { i:'kelasNilai', l:'Jenjang dan kelas', j:'teks', m:'C', w:true, ph:'mis. SMP kelas VII', c:'SMP kelas VII' },
      { i:'mapel', l:'Mata pelajaran', j:'teks', m:'C', w:true, ph:'mis. Matematika', c:'Matematika' },
      { i:'komponenNilai', l:'Komponen penilaian', j:'area', m:'C', w:true, ph:'Satu baris satu komponen…', c:'Tugas harian\nKuis\nProyek\nPenilaian akhir' },
      { i:'bobotNilai', l:'Bobot setiap komponen', j:'area', m:'C', w:true, ph:'Satu baris satu bobot…', c:'Tugas harian 20%\nKuis 20%\nProyek 30%\nPenilaian akhir 30%' },
      { i:'sumberNilai', l:'Cara memasukkan data', j:'pilih', m:'C', w:true, o:['Diketik langsung di aplikasi','Ditempel sebagai tabel','Diimpor dari CSV'], c:'Ditempel sebagai tabel' },
      { i:'dataSiswaNilai', l:'Data siswa / nilai awal', j:'area', m:'C', w:true, ph:'Tempel nama siswa dan nilai, atau jelaskan kolom datanya…', c:'Nama,Nama Tugas harian,Kuis,Proyek,Penilaian akhir\nAlya,80,75,88,90\nBima,65,70,72,68' },
      { i:'hasilNilai', l:'Keluaran yang diperlukan', j:'area', m:'C', w:true, ph:'Satu baris satu keluaran…', c:'Nilai akhir tiap siswa\nRata-rata kelas\nNilai tertinggi dan terendah\nRingkasan per komponen' },
      { i:'fiturNilai', l:'Fitur tambahan', j:'centang', m:'D', aturan:true, o:['Edit dan hapus data','Saring per siswa atau rentang nilai','Urutkan nilai','Ekspor CSV','Cetak rekap','Simpan di perangkat (localStorage)'], c:['Edit dan hapus data','Saring per siswa atau rentang nilai','Urutkan nilai','Cetak rekap','Simpan di perangkat (localStorage)'] }
    ],
    aturan:[
      aturanAcuan('Terapkan prinsip asesmen dan pengolahan hasil asesmen dari Panduan Pembelajaran dan Asesmen pada istilah, alur, dan laporan aplikasi; semua nilai dan hasil tetap berasal dari data yang dimasukkan guru.'),
      'Gunakan bobot persis seperti yang diberikan dan tampilkan rincian perhitungan agar guru dapat memeriksa hasilnya.',
      'Jangan mengubah nama siswa, nilai, bobot, atau satuan. Jika data belum lengkap, sediakan data contoh yang diberi label dan mudah diganti.',
      'Validasi nilai kosong, bukan angka, dan nilai di luar rentang yang ditentukan; tampilkan pesan yang ramah tanpa membuat halaman error.',
      'Tampilkan rekap individu dan ringkasan kelas sesuai keluaran yang diminta. Semua ringkasan harus dihitung dari data, bukan ditulis sebagai angka tetap.',
      'Jangan menetapkan batas ketuntasan, predikat, atau kebijakan penilaian yang tidak diberikan pengguna. Jika dibutuhkan tetapi belum ada, sediakan pengaturan yang dapat diubah guru.',
      'Seluruh teks antarmuka dan komentar kode dalam Bahasa Indonesia. Kode harus satu file HTML mandiri, responsif, berjalan offline, dan tidak memakai CDN.'
    ],
    format:['Keluarkan satu blok kode HTML lengkap. Sertakan data contoh berlabel bila diperlukan, rumus yang terlihat, validasi, dan seluruh fitur tambahan yang dipilih. Jangan memberikan ringkasan atau penjelasan di luar blok kode.']
  },

  /* ---------- Administrasi Guru ---------- */
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

  /* ---------- Media Pembelajaran (khusus SMP, semua mata pelajaran) ---------- */
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
      { i:'karakteristik', l:'Karakteristik peserta didik', j:'area', m:'D', ph:'Kemampuan awal, minat, kebutuhan khusus…', c:'Kemampuan membaca beragam, menyukai tantangan berlevel.' },
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
      'Komentar kode dan label navigasi antarmuka dalam Bahasa Indonesia; isi materi untuk peserta didik mengikuti aturan bahasa keluaran di FORMAT HASIL.'
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

  /* ---------- Gambar & Infografis ---------- */
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

  /* ---------- Lainnya ---------- */
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
    cp:{ promptRole:'source', preserveWhitespace:true, minKata:10 },
    konteks:{ promptRole:'source', preserveWhitespace:true, warnIfEmpty:true },
    materiSumber:{ promptRole:'source', preserveWhitespace:true },
    ruangLingkup:{ promptRole:'source', preserveWhitespace:true },
    dataSiswaNilai:{ promptRole:'source', preserveWhitespace:true },
    materiLkpd:{ promptRole:'source', penandaMapel:true },
    topik:{ promptRole:'source', penandaMapel:true },
    mapel:{ penandaMapel:true },
    materi:{ penandaMapel:true },
    jenjangKelas:{ penandaMapel:true, cekJenjang:true },
    kelasLkpd:{ penandaMapel:true, cekJenjang:true },
    kelasRubrik:{ cekJenjang:true },
    kelasNilai:{ cekJenjang:true },
    kelasAbsensi:{ cekJenjang:true },
    kelasUmpanBalik:{ cekJenjang:true },
    // Data khusus milik contoh (nama, data siswa, konteks kelas) yang hampir pasti keliru bila tidak diganti.
    penyusun:{ contohSpesifik:true },
    namaGuru:{ contohSpesifik:true },
    nama:{ contohSpesifik:true },
    kegiatan:{ contohSpesifik:true },
    asesmen:{ contohSpesifik:true },
    dataSiswaRubrik:{ contohSpesifik:true },
    daftarSiswaAbsensi:{ contohSpesifik:true },
    dataUmpanBalik:{ contohSpesifik:true },
    teksUtama:{ contohSpesifik:true },
    konteksBebas:{ contohSpesifik:true },
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

  /* Isian yang diulang di DAFTAR PERIKSA akhir prompt. true = "Label: nilai"; string = kalimat dengan {nilai}. */
  const DAFTAR_PERIKSA = {
    'modul-ajar': { jenjang:true, fase:true, kelas:true, mapel:true, topik:true, alokasi:true, dimensi:'Dimensi Profil Lulusan yang diwujudkan: {nilai}.', lampiran:'Lampiran hanya: {nilai}.' },
    'lkpd': { mapel:true, kelasLkpd:true, jenisKegiatan:true, jumlahTugas:'Jumlah & jenis tugas tepat: {nilai}.', kunci:true, formatCetak:true },
    'slide-presentasi': { mapel:true, jumlahSlide:'Tepat {nilai} slide.', formatKeluaran:true, audiens:true, visual:true },
    'bank-soal': { mapel:true, jenjangKelas:true, jumlahBentuk:'Jumlah & bentuk soal tepat: {nilai}.', kognitif:true, kunciBahasan:true, kisi:true },
    'kuis-interaktif': { jenjangKelas:true, mapel:true, jumlahSoal:'Tepat {nilai} soal.', jenisSoal:'Jenis soal hanya: {nilai}.', kesulitan:true, timer:true, pembahasan:true, hasil:true },
    'rubrik-penilaian': { mapel:true, kriteriaRubrik:true, levelRubrik:true, bobotRubrik:true, fiturRubrik:true },
    'rekap-nilai': { mapel:true, komponenNilai:true, bobotNilai:true, sumberNilai:true, hasilNilai:true, fiturNilai:true },
    'absensi-jurnal': { statusAbsensi:'Status kehadiran hanya: {nilai}.', isiJurnal:true, fiturAbsensi:true },
    'umpan-balik-siswa': { fokusUmpanBalik:true, gayaUmpanBalik:true, formatUmpanBalik:true, fiturUmpanBalik:true },
    'mpi-lengkap': { kelas:true, mapel:true, materi:true, jenis:true, jumlahBagian:'Tepat {nilai} bagian / level.', fiturWajib:true },
    'simulasi-interaktif': { kelas:true, mapel:true, konsep:true, variabel:true, fitur:true },
    'game-edukasi': { materi:true, pemain:true, jenis:true, level:true, fitur:true },
    'prompt-gambar': { subjek:true, gayaGambar:true, rasio:true, bahasaGambar:true, hindariGambar:'Tidak memuat: {nilai}.' },
    'infografis': { topikInfo:true, pembacaInfo:true, alurInfo:true },
    'aplikasi-web': { fiturUtama:true, penyimpanan:true, strukturFile:true, batasan:true },
    'website-satu-halaman': { nama:true, bagian:'Bagian halaman hanya: {nilai}.', fitur:'Fitur interaktif hanya: {nilai}.' },
    'prompt-bebas': { formatBebas:true, aturanBebas:true }
  };
  for (const template of TEMPLATE){
    const peta = DAFTAR_PERIKSA[template.id] || {};
    for (const field of template.fields || []){
      if (peta[field.i]) field.cek = peta[field.i];
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
    'aplikasi-web': { type:'single-code-block', language:'HTML', kecualiJika:{ strukturFile:'Beberapa file terpisah' } },
    'website-satu-halaman': { type:'single-code-block', language:'HTML' },
    'prompt-gambar': { requiredSections:['prompt gambar final'] },
    'infografis': { requiredSections:['prompt infografis final'] }
  };
  for (const template of TEMPLATE){
    if (OUTPUT_CONTRACTS[template.id]) template.outputContract = OUTPUT_CONTRACTS[template.id];
  }

  function validasiKatalog(){
    const jenisField = new Set(['teks','area','pilih','centang','angka']);
    const ids = new Set();
    for (const template of TEMPLATE){
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
      for (const id of Object.keys(DAFTAR_PERIKSA[template.id] || {})){
        if (!fieldIds.has(id)) throw new Error('Kolom daftar periksa tidak ditemukan: ' + template.id + '/' + id);
      }
    }
  }
  validasiKatalog();

  /* Kolom umum untuk semua template (di luar kolom khusus template) */
  const KOLOM_UMUM = [
    { i:'__detail', l:'Tingkat detail hasil', j:'pilih', m:'C', o:['Ringkas','Standar','Sangat detail'], c:'Standar' },
    { i:'__sikap', l:'Sikap AI bila ada yang kurang jelas', j:'pilih', m:'D', o:['Langsung kerjakan dengan asumsi terbaik','Tanya dulu sebelum mengerjakan'], c:'Langsung kerjakan dengan asumsi terbaik' }
  ];

  globalThis.ATIGA_KATALOG = { KATEGORI, TARGET_AI, TEMPLATE, KOLOM_UMUM };
})();
