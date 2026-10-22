/* ATIGA PROMPTER — penyimpanan dan normalisasi data lokal. */
'use strict';

(function(){
  const VERSI_DATA = 1;
  const BATAS_ITEM_PUSTAKA = 500;
  const BATAS_UKURAN_IMPOR = 2 * 1024 * 1024;
  const BATAS_PANJANG_PROMPT = 250000;

  function bacaJSON(kunci, bawaan, validasi = () => true){
    try {
      const mentah = localStorage.getItem(kunci);
      if (!mentah) return bawaan;
      const nilai = JSON.parse(mentah);
      return validasi(nilai) ? nilai : bawaan;
    } catch (e) {
      return bawaan;
    }
  }

  function tulisJSON(kunci, nilai){
    try {
      localStorage.setItem(kunci, JSON.stringify(nilai));
      return true;
    } catch (e) {
      return false;
    }
  }

  function normalisasiDraf(data){
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    const hasil = {};
    for (const [id, draf] of Object.entries(data)){
      if (!draf || typeof draf !== 'object' || Array.isArray(draf)) continue;
      hasil[id] = {
        nilai: draf.nilai && typeof draf.nilai === 'object' && !Array.isArray(draf.nilai) ? draf.nilai : {},
        umum: draf.umum && typeof draf.umum === 'object' && !Array.isArray(draf.umum) ? draf.umum : {}
      };
    }
    return hasil;
  }

  function normalisasiPustaka(data, targetAI){
    if (!Array.isArray(data)) return [];
    return data.filter(item => item && typeof item === 'object'
      && typeof item.nama === 'string' && item.nama.trim()
      && typeof item.teks === 'string' && item.teks.trim())
      .slice(0, BATAS_ITEM_PUSTAKA)
      .map((item, idx) => ({
        id: typeof item.id === 'string' && item.id ? item.id.slice(0, 100) : 'p' + Date.now().toString(36) + idx,
        nama: item.nama.trim().slice(0, 200),
        templateId: typeof item.templateId === 'string' ? item.templateId.slice(0, 100) : '',
        templateNama: typeof item.templateNama === 'string' ? item.templateNama.slice(0, 200) : 'Impor',
        target: targetAI.some(a => a.id === item.target) ? item.target : 'universal',
        teks: item.teks.trim().slice(0, BATAS_PANJANG_PROMPT),
        favorit: item.favorit === true,
        waktu: Number.isFinite(Number(item.waktu)) ? Number(item.waktu) : Date.now()
      }));
  }

  globalThis.ATIGA_STORAGE = {
    VERSI_DATA, BATAS_ITEM_PUSTAKA, BATAS_UKURAN_IMPOR, BATAS_PANJANG_PROMPT,
    bacaJSON, tulisJSON, normalisasiDraf, normalisasiPustaka
  };
})();
