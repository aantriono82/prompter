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
  const hasil = engine.buatPrompt(template, isiContoh(template, { mapel: 'Bahasa Inggris' }), {}, 'universal');
  assert.doesNotMatch(hasil, /Seluruh jawaban dalam Bahasa Indonesia/);
  assert.match(hasil, /peserta didik ditulis dalam Bahasa Inggris/);
});

test('modul ajar memakai acuan resmi yang sama untuk semua mata pelajaran', () => {
  const template = templateDenganId('modul-ajar');
  const hasil = engine.buatPrompt(template, isiContoh(template, { mapel: 'IPA' }), {}, 'universal');
  assert.doesNotMatch(hasil, /Panduan Mata Pelajaran Matematika|proses matematis/);
  assert.match(hasil, /Panduan Mata Pelajaran IPA/);
  assert.match(hasil, /kurikulum\.kemendikdasmen\.go\.id\/panduan-mapel/);
  assert.match(hasil, /Panduan Pembelajaran dan Asesmen Edisi Revisi 2025/);
  assert.match(hasil, /046\/H\/KR\/2025/);
});

test('template materi dan asesmen menyertakan ketiga acuan resmi', () => {
  ['modul-ajar', 'lkpd', 'slide-presentasi', 'bank-soal', 'kuis-interaktif', 'rubrik-penilaian', 'rekap-nilai'].forEach(id => {
    const template = templateDenganId(id);
    const hasil = engine.buatPrompt(template, isiContoh(template), {}, 'universal');
    assert.match(hasil, /panduan-mapel/, id);
    assert.match(hasil, /Panduan Pembelajaran dan Asesmen Edisi Revisi 2025/, id);
    assert.match(hasil, /Keputusan Kepala BSKAP No\. 046\/H\/KR\/2025/, id);
    assert.ok(template.fields.some(field => field.i === 'mapel'), id + ' wajib punya kolom Mata pelajaran');
    if (id !== 'slide-presentasi') assert.ok(template.fields.some(field => /^(jenjang|kelas)/i.test(field.i)), id + ' wajib punya kolom jenjang/kelas');
    const mapel = engine.buatPrompt(template, isiContoh(template, { mapel: 'Seni Budaya' }), {}, 'universal');
    assert.match(mapel, /Panduan Mata Pelajaran Seni Budaya/, id);
  });
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

require('../prompt-lint.js');
const lint = global.ATIGA_LINT;
function lintTemplate(id, tambahan = {}, mode = 'detail'){
  const template = templateDenganId(id);
  const values = isiContoh(template, tambahan);
  const text = engine.buatPrompt(template, values, {}, 'universal', mode);
  return lint.lintPrompt({ template, values, common: { __fields: [] }, mode, text, targets: katalog.TARGET_AI });
}

test('lint memperingatkan data contoh yang belum diganti', () => {
  const hasil = lintTemplate('modul-ajar');
  assert.ok(hasil.warnings.some(item => item.startsWith('Masih berisi data contoh:') && item.includes('Penyusun / satuan pendidikan')));
  const bersih = lintTemplate('modul-ajar', Object.fromEntries(
    templateDenganId('modul-ajar').fields.filter(field => field.j === 'teks' || field.j === 'area').map(field => [field.i, 'Isian guru ' + field.i + ' yang sudah diganti dengan data asli'])));
  assert.ok(!bersih.warnings.some(item => item.startsWith('Masih berisi data contoh')));
});

test('lint tidak memeriksa data contoh pada kolom yang tersembunyi di mode cepat', () => {
  const hasil = lintTemplate('modul-ajar', {}, 'cepat');
  const pesan = hasil.warnings.find(item => item.startsWith('Masih berisi data contoh')) || '';
  assert.ok(!pesan.includes('Penyusun'));
});

test('lint memperingatkan CP yang terlalu pendek', () => {
  assert.ok(lintTemplate('modul-ajar', { cp: 'Bilangan rasional' }).warnings.some(item => item.startsWith('CP resmi tampaknya terlalu pendek')));
  assert.ok(!lintTemplate('modul-ajar').warnings.some(item => item.includes('terlalu pendek')));
});

test('lint memperingatkan jenjang, fase, dan kelas yang tidak konsisten', () => {
  const konsisten = lintTemplate('modul-ajar').warnings.join(' ');
  assert.doesNotMatch(konsisten, /tidak sesuai|tidak termasuk/);
  assert.ok(lintTemplate('modul-ajar', { fase: 'E (Kelas X)' }).warnings.some(item => item === 'Fase E tidak sesuai dengan jenjang SMP.'));
  assert.ok(lintTemplate('modul-ajar', { kelas: 'IV' }).warnings.some(item => item === 'Kelas IV tidak termasuk Fase D.'));
  assert.ok(lintTemplate('bank-soal', { jenjangKelas: 'SMP Kelas X' }).warnings.some(item => item.includes('kelas 10 bukan jenjang SMP')));
  assert.ok(!lintTemplate('bank-soal', { jenjangKelas: 'SMP kelas 8' }).warnings.some(item => item.includes('tidak konsisten')));
});

test('angka kelas dibaca dari romawi dan angka', () => {
  assert.equal(lint.angkaKelas('VII'), 7);
  assert.equal(lint.angkaKelas('Kelas 10'), 10);
  assert.equal(lint.angkaKelas('SMP Kelas IX'), 9);
  assert.equal(lint.angkaKelas('7A'), null);
});

test('lint tidak menandai isian umum yang kebetulan sama dengan contoh', () => {
  const pesan = lintTemplate('modul-ajar').warnings.find(item => item.startsWith('Masih berisi data contoh')) || '';
  for (const label of ['Kelas', 'Mata pelajaran', 'Topik', 'TP atau arahan']) assert.ok(!pesan.includes(label), label);
  assert.ok(pesan.includes('CP resmi') && pesan.includes('Kondisi murid'));
});

test('lint tidak menganggap LaTeX atau kode sebagai placeholder', () => {
  const template = templateDenganId('bank-soal');
  const cek = text => lint.lintPrompt({ template, values: {}, common: { __fields: [] }, text, targets: katalog.TARGET_AI }).errors;
  assert.ok(!cek('Hitung \\frac{1}{2} + {x} dan function(){ return {a}; }').some(item => item.includes('placeholder')));
  assert.ok(cek('Mata pelajaran: {mapel}').some(item => item.includes('placeholder')));
});
