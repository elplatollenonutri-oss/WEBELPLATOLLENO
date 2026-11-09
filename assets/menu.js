// Desplegable de "Servicios" en el menú: se abre al pasar el ratón, al pulsar o con el teclado.
(function () {
  var item = document.querySelector('.has-sub');
  if (!item) return;
  var btn = item.querySelector('.sub-toggle');
  function set(open) { item.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); }
  btn.addEventListener('click', function (e) { e.stopPropagation(); set(!item.classList.contains('open')); });
  document.addEventListener('click', function (e) { if (!item.contains(e.target)) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); btn.focus(); } });
  item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) set(false); });
})();
