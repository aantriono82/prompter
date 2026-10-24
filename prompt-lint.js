/* ATIGA PROMPTER — pemeriksaan kualitas prompt sebelum disalin atau dikirim. */
'use strict';

(function(){
  function nilaiTerisi(field, values){
    const value = values && values[field.i];
    return field.j === 'centang'
      ? Array.isArray(value) && value.length > 0
      : String(value ?? '').trim().length > 0;
  }

  function estimateTokens(text){
    const value = String(text || '');
    if (!value) return 0;
    // Perkiraan konservatif untuk Bahasa Indonesia, Markdown, dan kode.
    return Math.ceil(value.length / 4);
  }

  const ROMAWI = { I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8, IX:9, X:10, XI:11, XII:12 };
  const RENTANG_JENJANG = { SD:[1, 6], MI:[1, 6], SMP:[7, 9], MTS:[7, 9], SMA:[10, 12], SMK:[10, 12], MA:[10, 12] };
  const RENTANG_FASE = { A:[1, 2], B:[3, 4], C:[5, 6], D:[7, 9], E:[10, 10], F:[11, 12] };
  const JENJANG_FASE = { PAUD:['Fondasi'], SD:['A', 'B', 'C'], SMP:['D'], SMA:['E', 'F'], SMK:['E', 'F'] };

  function labelBersih(label){
    return String(label).replace(/\s*\((opsional|wajib[^)]*)\)\s*$/i, '').trim();
  }

  function angkaKelas(text){
    const value = String(text || '').trim();
    const cocok = value.match(/\bkelas\s+([IVX]+|\d{1,2})\b/i) || value.match(/^([IVX]+|\d{1,2})\b/i);
    if (!cocok) return null;
    const angka = /^\d+$/.test(cocok[1]) ? Number(cocok[1]) : ROMAWI[cocok[1].toUpperCase()];
    return angka >= 1 && angka <= 12 ? angka : null;
  }

  function jenjangDariTeks(text){
    const cocok = String(text || '').match(/\b(SD|MI|SMP|MTs|SMA|SMK|MA)\b/);
    return cocok ? cocok[1].toUpperCase() : null;
  }

  function dalamRentang(angka, rentang){
    return angka >= rentang[0] && angka <= rentang[1];
  }

  /* Ketidaksesuaian jenjang, fase, dan kelas yang membuat AI menebak tingkat kesulitan. */
  function cekKonsistensiKelas(fields, values){
    const warnings = [];
    for (const field of fields.filter(item => item.cekJenjang)){
      const text = values[field.i];
      const jenjang = jenjangDariTeks(text);
      const kelas = angkaKelas(text);
      if (jenjang && kelas && !dalamRentang(kelas, RENTANG_JENJANG[jenjang])){
        warnings.push(labelBersih(field.l) + ' tidak konsisten: kelas ' + kelas + ' bukan jenjang ' + jenjang + '.');
      }
    }

    const ids = new Set(fields.map(field => field.i));
    if (!ids.has('fase')) return warnings;
    const jenjang = String(values.jenjang || '').toUpperCase();
    const fase = String(values.fase || '').split(' ')[0];
    const kelas = angkaKelas(values.kelas);
    if (jenjang && fase && JENJANG_FASE[jenjang] && !JENJANG_FASE[jenjang].includes(fase)){
      warnings.push('Fase ' + fase + ' tidak sesuai dengan jenjang ' + jenjang + '.');
    }
    if (kelas && RENTANG_FASE[fase] && !dalamRentang(kelas, RENTANG_FASE[fase])){
      warnings.push('Kelas ' + values.kelas + ' tidak termasuk Fase ' + fase + '.');
    } else if (kelas && RENTANG_JENJANG[jenjang] && !dalamRentang(kelas, RENTANG_JENJANG[jenjang])){
      warnings.push('Kelas ' + values.kelas + ' tidak termasuk jenjang ' + jenjang + '.');
    }
    return warnings;
  }

  function lintPrompt({ template, values = {}, common = {}, mode = 'detail', targetId = 'universal', text = '', targets = [] }){
    const errors = [];
    const warnings = [];
    const visible = field => field.m === 'C' || mode === 'detail';
    const required = [...(template?.fields || []), ...(common.__fields || [])]
      .filter(field => field.w && visible(field));

    for (const field of required){
      const source = (template.fields || []).includes(field) ? values : common;
      if (!nilaiTerisi(field, source)) errors.push('Kolom wajib belum diisi: ' + field.l + '.');
    }

    const sourceFields = (template?.fields || []).filter(field => field.promptRole === 'source' && field.warnIfEmpty && visible(field));
    const missingSource = sourceFields.filter(field => !nilaiTerisi(field, values));
    if (missingSource.length){
      warnings.push('Sumber data belum lengkap: ' + missingSource.map(field => field.l).join(', ') + '.');
    }

    const visibleFields = (template?.fields || []).filter(visible);
    const masihContoh = visibleFields.filter(field =>
      (field.contohSpesifik || (field.promptRole === 'source' && field.j === 'area'))
      && typeof field.c === 'string' && field.c.trim()
      && String(values[field.i] ?? '').trim() === field.c.trim());
    if (masihContoh.length){
      warnings.push('Masih berisi data contoh: ' + masihContoh.map(field => labelBersih(field.l)).join(', ') + '. Ganti dengan data Anda.');
    }

    for (const field of visibleFields.filter(item => item.minKata)){
      const jumlahKata = String(values[field.i] ?? '').trim().split(/\s+/).filter(Boolean).length;
      if (jumlahKata > 0 && jumlahKata < field.minKata){
        warnings.push(labelBersih(field.l) + ' tampaknya terlalu pendek (' + jumlahKata + ' kata). Tempel rumusan lengkapnya.');
      }
    }

    warnings.push(...cekKonsistensiKelas(visibleFields, values));

    if (/\{\w+\}/.test(text)) errors.push('Prompt masih memiliki placeholder yang belum terisi.');
    if (text.length > 250000) errors.push('Prompt melebihi batas aman 250.000 karakter.');
    if (text.length > 50000) warnings.push('Prompt sangat panjang; hasil AI dapat terpotong atau kehilangan konteks.');

    const target = targets.find(item => item.id === targetId);
    const tokens = estimateTokens(text);
    if (target?.batasToken && tokens > target.batasToken){
      warnings.push('Perkiraan panjang prompt sekitar ' + tokens.toLocaleString('id-ID') + ' token, melewati batas rekomendasi target.');
    }

    return { errors, warnings, tokens, ok: errors.length === 0 };
  }

  globalThis.ATIGA_LINT = { estimateTokens, lintPrompt, angkaKelas };
})();
