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

  globalThis.ATIGA_LINT = { estimateTokens, lintPrompt };
})();
