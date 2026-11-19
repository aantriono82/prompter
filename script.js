/* ============================================================
   ATIGA PROMPTER — script.js
   Generator prompt untuk AI: pilih template → isi variabel →
   pratinjau → salin / kirim ke AI.
   Vanilla JS, tanpa pustaka luar. Seluruh data & logika lokal.

   Berkas terkait (dimuat lebih dulu):
   - katalog.js       : KATEGORI, TARGET_AI, TEMPLATE, KOLOM_UMUM
   - prompt-engine.js : susunBlok() + bungkus() — penyusun prompt per target AI
   - prompt-lint.js   : pemeriksaan kualitas prompt
   - storage.js       : localStorage berversi
   Berkas ini berisi UI: render & interaksi halaman (hanya di peramban).
   ============================================================ */
'use strict';

const { KATEGORI, TARGET_AI, TEMPLATE, KOLOM_UMUM } = globalThis.ATIGA_KATALOG;

function buatPrompt(t, vals, umum, targetId, mode = 'detail'){
  return globalThis.ATIGA_ENGINE.buatPrompt(t, vals, umum, targetId, mode);
}

/* Ekspos untuk pengujian (tidak berpengaruh di peramban) */
if (typeof globalThis !== 'undefined'){
  globalThis.ATIGA = {
    KATEGORI, TARGET_AI, TEMPLATE, KOLOM_UMUM,
    ...globalThis.ATIGA_ENGINE
  };
}

/* ---------------- UI (hanya di peramban) ---------------- */
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
  const templateLama = TEMPLATE.find(t => t.id === pilihanLama.templateId);
  if (templateLama){
    state.templateId = templateLama.id;
    state.kategori = templateLama.kategori;
  }
  if (pilihanLama.mode === 'detail') state.mode = 'detail';
  if (TARGET_AI.some(a => a.id === pilihanLama.target)) state.target = pilihanLama.target;
}
const templateAktif = () => TEMPLATE.find(t => t.id === state.templateId) || TEMPLATE[0];
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
// Di HP, tab sering dibuang tanpa pagehide; simpan juga saat aplikasi dipindah ke latar belakang.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') simpanDraf(true);
});

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
  $('ikonTema').textContent = gelap ? '☀️' : '🌙';
  $('labelTema').textContent = gelap ? 'Terang' : 'Gelap';
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

function ikonAI(a){
  const img = document.createElement('img');
  img.className = 'ikon-ai';
  img.src = a.ikon;
  img.alt = '';
  img.width = 18; img.height = 18;
  return img;
}
function renderTarget(){
  const wadah = $('chipTarget');
  wadah.innerHTML = '';
  for (const a of TARGET_AI){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (a.id === state.target ? ' aktif' : '');
    b.setAttribute('aria-pressed', String(a.id === state.target));
    b.append(ikonAI(a), a.nama);
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
  // Panel tersembunyi tidak perlu disusun ulang pada setiap ketikan; disusun saat tab Struktur dibuka.
  if (wadah.hidden) return;
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
    ['Format hasil', blok.format.join('\n')], ['Daftar periksa', blok.periksa.join('\n')]
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
  if (!promptAktif) perbaruiStruktur();
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
  const isi = $('isiKirimAI');
  isi.innerHTML = '';
  for (const a of TARGET_AI){
    if (!a.url) continue;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'menu-kirim-item';
    b.setAttribute('role', 'menuitem');
    b.append(ikonAI(a), a.nama);
    b.addEventListener('click', () => {
      $('menuKirimAI').open = false;
      kirimKeAI(a);
    });
    isi.appendChild(b);
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
  // Tanpa fitur 'noopener': dengan fitur itu window.open selalu mengembalikan null sehingga popup yang
  // berhasil pun terbaca "diblokir". Opener diputus manual setelah tab terbuka.
  const tab = window.open(a.url, '_blank');
  if (tab) tab.opener = null;
  else toast('Popup diblokir peramban. Izinkan popup untuk membuka ' + a.nama + '.');
}
/* Menu tarik-turun (Kirim ke AI & Ekspor): tutup saat klik di luar atau tekan Escape. */
const menuTarik = document.querySelectorAll('details.menu-kirim, details.menu-ekspor');
document.addEventListener('click', e => {
  menuTarik.forEach(menu => { if (menu.open && !menu.contains(e.target)) menu.open = false; });
});
menuTarik.forEach(menu => {
  menu.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !menu.open) return;
    menu.open = false;
    menu.querySelector('summary').focus();
  });
  menu.addEventListener('toggle', () => {
    if (menu.open) menuTarik.forEach(lain => { if (lain !== menu) lain.open = false; });
  });
});
document.querySelectorAll('.menu-ekspor-isi button').forEach(b => {
  b.addEventListener('click', () => { b.closest('details').open = false; });
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
    const templateAda = TEMPLATE.find(t => t.id === p.templateId);
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
      simpanDraf(true);
      // Prompt yang dulu diedit manual tidak sama dengan hasil susun ulang; pertahankan teks tersimpannya.
      if ($('areaPreview').value !== p.teks){
        state.pratinjauManual = true;
        $('areaPreview').value = p.teks;
        perbaruiHitungan();
        perbaruiStruktur();
        perbaruiKualitas();
      }
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
$('labelImpor').addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  $('berkasImpor').click();
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
