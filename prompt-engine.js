/*
 * ATIGA PROMPTER — prompt-engine.js
 * Mesin penyusun prompt yang tidak bergantung pada DOM.
 */
'use strict';

(function(){
  function teksKolom(f, v){
    if (v === undefined || v === null) return '';
    if (f.j === 'centang') return Array.isArray(v) ? v.join(', ') : '';
    return String(v).trim();
  }

  function barisSpesifikasi(f, v){
    if (v === undefined || v === null) return '';
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
      if (vals[id] === undefined || vals[id] === null || !String(vals[id]).trim()) return '';
    }
    return kalimat.replace(/\{(\w+)\}/g, (_, id) => String(vals[id]).trim());
  }

  function susunBlok(t, vals = {}, umum = {}, mode = 'detail'){
    const blok = { peran:'', konteks:'', tugas:'', spesifikasi:[], aturan:[], format:[] };
    const nilai = vals || {};
    const preferensi = umum || {};
    const detailAktif = mode === 'detail';
    const fieldKhususPromptBebas = new Set([
      'peranBebas', 'konteksBebas', 'tugasBebas', 'formatBebas',
      'langkahBebas', 'contohBebas', 'nadaBebas'
    ]);

    blok.peran = t.peran || teksKolom({ j:'teks' }, nilai.peranBebas);
    blok.tugas = t.tugas || teksKolom({ j:'area' }, nilai.tugasBebas);
    if (t.konteks){
      blok.konteks = t.konteks.map(k => substitusiKonteks(k, nilai)).filter(Boolean).join(' ');
    }
    if (t.id === 'prompt-bebas' && nilai.konteksBebas) blok.konteks = String(nilai.konteksBebas).trim();

    for (const f of t.fields){
      if (f.m === 'D' && !detailAktif) continue;
      if (t.id === 'prompt-bebas' && fieldKhususPromptBebas.has(f.i)) continue;
      const v = nilai[f.i];
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
      if (nilai.bahasaGambar === 'Indonesia'){
        blok.aturan.push('Tulis prompt gambar dalam Bahasa Indonesia.');
      } else {
        blok.aturan.push('Tulis prompt gambar dalam Bahasa Inggris sebagai hasil utama, lalu sertakan terjemahan Bahasa Indonesianya di bawahnya.');
      }
    }
    if (t.id === 'prompt-bebas' && detailAktif && nilai.langkahBebas){
      blok.aturan.push('Langkah pengerjaan: ' + String(nilai.langkahBebas).trim().replace(/\n/g, '; '));
    }

    (t.format || []).forEach(x => blok.format.push(x));
    if (t.id === 'prompt-bebas'){
      if (nilai.formatBebas) blok.format.push('Bentuk hasil: ' + nilai.formatBebas + '.');
      if (detailAktif && nilai.contohBebas) blok.format.push('Contoh hasil yang diinginkan: ' + String(nilai.contohBebas).trim());
      if (detailAktif && nilai.nadaBebas) blok.format.push('Nada & gaya jawaban: ' + nilai.nadaBebas + '.');
    }
    const detail = preferensi.__detail || 'Standar';
    blok.format.push('Tingkat detail hasil: ' + detail + '.');
    if (t.id !== 'prompt-gambar') blok.format.push('Seluruh jawaban dalam Bahasa Indonesia.');

    const sikap = detailAktif
      ? (preferensi.__sikap || 'Langsung kerjakan dengan asumsi terbaik')
      : 'Langsung kerjakan dengan asumsi terbaik';
    blok.aturan.push(sikap === 'Tanya dulu sebelum mengerjakan'
      ? 'Bila ada hal yang kurang jelas atau ambigu, tanyakan dulu kepadaku sebelum mengerjakan.'
      : 'Bila ada hal yang kurang jelas, kerjakan dengan asumsi terbaik dan sebutkan asumsimu secara singkat.');

    return blok;
  }

  function bungkus(targetId, blok){
    const B = blok;
    const md = (judul, isi) => isi ? '## ' + judul + '\n' + isi : '';
    const gabungMd = bagian => bagian.filter(Boolean).join('\n\n');

    switch (targetId){
      case 'claude': {
        const tag = (nama, isi) => isi ? '<' + nama + '>\n' + isi + '\n</' + nama + '>' : '';
        return [
          tag('peran', B.peran),
          tag('konteks', B.konteks), tag('tugas', B.tugas),
          tag('spesifikasi', B.spesifikasi.map(s => '- ' + s.replace(/\n/g, '\n  ')).join('\n')),
          tag('aturan', B.aturan.map(a => '- ' + a).join('\n')),
          tag('format_hasil', B.format.map(f => '- ' + f).join('\n'))
        ].filter(Boolean).join('\n\n');
      }
      case 'chatgpt':
        return gabungMd([
          md('PERAN', B.peran), md('KONTEKS', B.konteks), md('TUGAS', B.tugas),
          md('SPESIFIKASI', B.spesifikasi.map(s => '- ' + s.replace(/\n/g, '\n  ')).join('\n')),
          md('ATURAN WAJIB', B.aturan.map((a, i) => (i + 1) + '. ' + a).join('\n')),
          md('FORMAT HASIL', B.format.map(f => '- ' + f).join('\n')),
          'Ikuti urutan instruksi di atas dan patuhi FORMAT HASIL.'
        ]);
      case 'gemini': {
        const tebal = (judul, isi) => isi ? '**' + judul + '**\n' + isi : '';
        const satu = B.spesifikasi.filter(s => !s.includes('\n'));
        let spek;
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
          'Kerjakan tugas berikut secara langsung dan teknis. Berikan keluaran sesuai FORMAT HASIL.',
          blokTeks('PERAN', B.peran), blokTeks('KONTEKS', B.konteks), blokTeks('TUGAS', B.tugas),
          blokTeks('SPESIFIKASI', B.spesifikasi.map((s, i) => (i + 1) + '. ' + s.replace(/\n/g, ' ')).join('\n')),
          blokTeks('ATURAN', B.aturan.map((a, i) => (i + 1) + '. ' + a).join('\n')),
          blokTeks('FORMAT HASIL', B.format.join(' '))
        ].filter(Boolean).join('\n\n');
      }
      case 'copilot': {
        const ringkas = (label, isi) => isi ? '**' + label + ':** ' + isi : '';
        return [
          ringkas('Peran', B.peran), ringkas('Konteks', B.konteks), ringkas('Tugas', B.tugas),
          ringkas('Spesifikasi', B.spesifikasi.map(s => s.replace(/\n/g, '; ')).join('; ')),
          ringkas('Aturan', B.aturan.join(' ')), ringkas('Format hasil', B.format.join(' '))
        ].filter(Boolean).join('\n\n');
      }
      case 'grok':
        return gabungMd([
          md('PERAN', B.peran), md('KONTEKS', B.konteks), md('TUGAS', B.tugas),
          md('SPESIFIKASI', B.spesifikasi.map(s => '- ' + s.replace(/\n/g, '\n  ')).join('\n')),
          md('ATURAN WAJIB', B.aturan.map(a => '- ' + a).join('\n')),
          md('FORMAT HASIL', B.format.map(f => '- ' + f).join('\n'))
        ]);
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
      default:
        return gabungMd([
          md('PERAN', B.peran), md('KONTEKS', B.konteks), md('TUGAS', B.tugas),
          md('SPESIFIKASI', B.spesifikasi.map(s => '- ' + s.replace(/\n/g, '\n  ')).join('\n')),
          md('ATURAN WAJIB', B.aturan.map(a => '- ' + a).join('\n')),
          md('FORMAT HASIL', B.format.map(f => '- ' + f).join('\n'))
        ]);
    }
  }

  function buatPrompt(t, vals, umum, targetId, mode = 'detail'){
    return bungkus(targetId, susunBlok(t, vals, umum, mode));
  }

  globalThis.ATIGA_ENGINE = { susunBlok, bungkus, buatPrompt };
})();
