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

// Cookies: el calendario de Doctoralia (único servicio que puede instalar cookies) solo se carga si se acepta.
(function () {
  var KEY = 'epl-cookies';
  var me = document.currentScript || document.querySelector('script[src*="assets/menu.js"]');
  var base = me ? me.src.replace(/assets\/menu\.js.*$/, '') : '/';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var gate = document.querySelector('.cookie-gate');
  function loadDoctoralia() {
    if (!document.getElementById('zl-url') || document.getElementById('zl-widget-s')) return;
    var js = document.createElement('script'); js.id = 'zl-widget-s';
    js.src = 'https://platform.docplanner.com/js/widget.js';
    document.body.appendChild(js);
  }
  function apply(v) {
    if (gate) gate.hidden = v === 'si';
    if (v === 'si') loadDoctoralia();
  }
  var banner;
  function close() { if (banner) { banner.remove(); banner = null; } }
  function choose(v) { save(v); close(); apply(v); }
  function open() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'cookie-banner'; banner.setAttribute('role', 'region'); banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML = '<p>Esta web no usa cookies de analítica ni de publicidad. Solo el <strong>calendario de reservas de Doctoralia</strong> puede instalar cookies. ¿Lo cargamos? <a href="' + base + 'cookies/">Más información</a></p>' +
      '<div class="row"><button type="button" class="btn small" data-v="si">Aceptar</button><button type="button" class="btn small ghost" data-v="no">Rechazar</button></div>';
    banner.addEventListener('click', function (e) { var v = e.target.getAttribute('data-v'); if (v) choose(v); });
    document.body.appendChild(banner);
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookies-aceptar]')) choose('si');
    if (e.target.closest('[data-cookies-reabrir]')) open();
  });
  var v = get();
  apply(v);
  if (!v) open();
})();
