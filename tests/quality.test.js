const test = require('node:test');
const assert = require('node:assert/strict');

const penyimpanan = new Map();
global.localStorage = {
  getItem(kunci){ return penyimpanan.has(kunci) ? penyimpanan.get(kunci) : null; },
  setItem(kunci, nilai){ penyimpanan.set(kunci, String(nilai)); }
};

require('../prompt-engine.js');
require('../storage.js');

const engine = global.ATIGA_ENGINE;
const storage = global.ATIGA_STORAGE;

test('mesin prompt menyusun blok universal dari template dan isian', () => {
  const template = {
    id: 'uji',
    peran: 'Anda adalah penguji.',
    tugas: 'Periksa data berikut.',
    fields: [
      { i: 'topik', l: 'Topik', j: 'teks' },
      { i: 'aturan', l: 'Aturan', j: 'area', aturan: true }
    ],
    format: ['Jawaban ringkas.']
  };
  const hasil = engine.buatPrompt(
    template,
    { topik: 'Aksesibilitas', aturan: 'Gunakan Bahasa Indonesia.' },
    { __detail: 'Standar', __sikap: 'Langsung kerjakan dengan asumsi terbaik' },
    'universal'
  );

  assert.match(hasil, /## PERAN/);
  assert.match(hasil, /Topik: Aksesibilitas/);
  assert.match(hasil, /Gunakan Bahasa Indonesia\./);
  assert.match(hasil, /## FORMAT HASIL/);
});

test('mesin prompt memakai aturan bernomor untuk ChatGPT', () => {
  const hasil = engine.bungkus('chatgpt', {
    peran: 'Peran', konteks: '', tugas: 'Tugas', spesifikasi: [],
    aturan: ['Aturan pertama'], format: ['Format']
  });
  assert.match(hasil, /## ATURAN WAJIB\n1\. Aturan pertama/);
});

test('penyimpanan menolak item pustaka yang tidak valid dan membatasi target', () => {
  const hasil = storage.normalisasiPustaka([
    { nama: 'Valid', teks: 'Isi', target: 'unknown' },
    { nama: '', teks: 'Tidak valid' },
    { nama: 'Tanpa isi', teks: '   ' }
  ], [{ id: 'universal' }]);

  assert.equal(hasil.length, 1);
  assert.equal(hasil[0].target, 'universal');
});

test('penyimpanan JSON membaca dan menulis nilai lokal', () => {
  assert.equal(storage.tulisJSON('uji', { aktif: true }), true);
  assert.deepEqual(storage.bacaJSON('uji', {}), { aktif: true });
});

require('../script.js');
const katalog = global.ATIGA;

function isiContoh(template, tambahan = {}){
  const nilai = {};
  for (const field of template.fields) if (field.c !== undefined) nilai[field.i] = field.c;
  return Object.assign(nilai, tambahan);
}
function templateDenganId(id){
  return katalog.TEMPLATE.find(template => template.id === id);
}

test('setiap target AI menampilkan daftar periksa berisi isian penting', () => {
  for (const template of katalog.TEMPLATE){
    const nilai = isiContoh(template);
    const kolomCek = template.fields.filter(field => field.cek && field.j !== 'area' && nilai[field.i] !== undefined);
    for (const target of katalog.TARGET_AI){
      const hasil = engine.buatPrompt(template, nilai, { __detail: 'Standar' }, target.id, 'detail');
      assert.match(hasil, /DAFTAR PERIKSA|daftar_periksa|Daftar periksa/, template.id + '/' + target.id);
      const periksa = hasil.slice(hasil.search(/DAFTAR PERIKSA|daftar_periksa|Daftar periksa/));
      for (const field of kolomCek){
        const isi = Array.isArray(nilai[field.i]) ? nilai[field.i].join(', ') : String(nilai[field.i]).trim();
        assert.ok(periksa.includes(isi), template.id + '/' + target.id + ': ' + field.i);
      }
    }
  }
});

test('mode cepat tidak memasukkan kolom detail ke daftar periksa', () => {
  const template = templateDenganId('kuis-interaktif');
  const blok = engine.susunBlok(template, isiContoh(template), {}, 'cepat');
  assert.ok(blok.periksa.some(item => item.startsWith('Tepat 10 soal')));
  assert.ok(!blok.periksa.some(item => item.startsWith('Timer per soal')));
});

test('mata pelajaran bahasa asing tidak dipaksa berbahasa Indonesia', () => {
  const template = templateDenganId('bank-soal');
  const hasil = engine.buatPrompt(template, isiContoh(template, { jenjangKelas: 'SMP Kelas VII Bahasa Inggris' }), {}, 'universal');
  assert.doesNotMatch(hasil, /Seluruh jawaban dalam Bahasa Indonesia/);
  assert.match(hasil, /peserta didik ditulis dalam Bahasa Inggris/);
});

test('modul ajar non-Matematika tidak memakai acuan Matematika', () => {
  const template = templateDenganId('modul-ajar');
  const hasil = engine.buatPrompt(template, isiContoh(template, { mapel: 'IPA' }), {}, 'universal');
  assert.doesNotMatch(hasil, /Panduan Mata Pelajaran Matematika|proses matematis/);
  assert.match(hasil, /panduan mata pelajaran IPA/);
  const mtk = engine.buatPrompt(template, isiContoh(template), {}, 'universal');
  assert.match(mtk, /Panduan Mata Pelajaran Matematika/);
});

test('aturan pemeriksaan tidak melarang pembahasan yang diminta', () => {
  const template = templateDenganId('bank-soal');
  const hasil = engine.buatPrompt(template, isiContoh(template), {}, 'universal');
  assert.doesNotMatch(hasil, /tanpa uraian proses penalaran/);
  assert.match(hasil, /pembahasan, langkah penyelesaian, atau penjelasan yang memang diminta tetap ditulis/);
});

test('aplikasi beberapa file tidak dipaksa menjadi satu blok kode', () => {
  const template = templateDenganId('aplikasi-web');
  const hasil = engine.buatPrompt(template, isiContoh(template, { strukturFile: 'Beberapa file terpisah' }), {}, 'universal');
  assert.doesNotMatch(hasil, /Kontrak keluaran: keluarkan tepat satu blok kode/);
});

