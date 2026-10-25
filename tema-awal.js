/* ATIGA PROMPTER — terapkan tema sebelum halaman dilukis agar mode gelap tidak berkedip terang. */
'use strict';
(function(){
  let tema = null;
  try { tema = localStorage.getItem('atiga-prompter-tema'); } catch (e) {}
  const gelap = tema ? tema === 'gelap'
    : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (gelap) document.documentElement.setAttribute('data-theme', 'gelap');
})();
