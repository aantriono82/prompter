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
