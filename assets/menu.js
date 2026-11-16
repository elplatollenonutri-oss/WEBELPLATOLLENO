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

// Cookies por categorías: funcionales (calendario de Doctoralia), analíticas y publicitarias.
// Nada opcional se carga sin consentimiento. Para añadir un script de analítica o publicidad en el futuro:
//   <script type="text/plain" data-consent="analitica" data-src="https://..."></script>   (o data-consent="publicidad")
// Se activa solo cuando la persona acepta esa categoría. También se emite el evento 'epl-consent' en window.
(function () {
  var KEY = 'epl-cookies';
  var me = document.currentScript || document.querySelector('script[src*="assets/menu.js"]');
  var base = me ? me.src.replace(/assets\/menu\.js.*$/, '') : '/';
  var CATS = [
    ['funcionales', 'Funcionales', 'Cargan el calendario de reservas de Doctoralia.'],
    ['analitica', 'Analíticas', 'Me ayudan a saber cuántas personas visitan la web y qué contenidos interesan más.'],
    ['publicidad', 'Publicitarias', 'Permiten medir campañas y mostrarte anuncios relacionados con tus intereses en otras webs y redes.']
  ];
  function get() {
    var v; try { v = localStorage.getItem(KEY); } catch (e) { return null; }
    if (!v) return null;
    if (v === 'si' || v === 'no') return { funcionales: v === 'si', analitica: false, publicidad: false };
    try { return JSON.parse(v); } catch (e) { return null; }
  }
  function save(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
  var gate = document.querySelector('.cookie-gate');
  function loadDoctoralia() {
    if (!document.getElementById('zl-url') || document.getElementById('zl-widget-s')) return;
    var js = document.createElement('script'); js.id = 'zl-widget-s';
    js.src = 'https://platform.docplanner.com/js/widget.js';
    document.body.appendChild(js);
  }
  function apply(c) {
    c = c || {};
    window.eplConsent = c;
    if (gate) gate.hidden = !!c.funcionales;
    if (c.funcionales) loadDoctoralia();
    [].forEach.call(document.querySelectorAll('script[type="text/plain"][data-consent]'), function (s) {
      if (!c[s.getAttribute('data-consent')] || s.dataset.done) return;
      s.dataset.done = '1';
      var n = document.createElement('script');
      if (s.dataset.src) n.src = s.dataset.src; else n.text = s.text;
      if (s.async) n.async = true;
      document.head.appendChild(n);
    });
    try { window.dispatchEvent(new CustomEvent('epl-consent', { detail: c })); } catch (e) {}
  }
  var banner;
  function close() { if (banner) { banner.remove(); banner = null; } }
  function choose(c) { save(c); close(); apply(c); }
  function all(v) { return { funcionales: v, analitica: v, publicidad: v }; }
  function open(showPrefs) {
    close();
    var cur = get() || all(false);
    banner = document.createElement('div');
    banner.className = 'cookie-banner'; banner.setAttribute('role', 'dialog'); banner.setAttribute('aria-label', 'Preferencias de cookies');
    var prefs = '<div class="cookie-prefs"' + (showPrefs ? '' : ' hidden') + '>' +
      '<label class="cookie-opt"><input type="checkbox" checked disabled> <span><strong>Técnicas</strong> · Necesarias para que la web funcione. Siempre activas.</span></label>' +
      CATS.map(function (k) {
        return '<label class="cookie-opt"><input type="checkbox" data-cat="' + k[0] + '"' + (cur[k[0]] ? ' checked' : '') + '> <span><strong>' + k[1] + '</strong> · ' + k[2] + '</span></label>';
      }).join('') + '</div>';
    banner.innerHTML = '<p>Uso cookies propias y de terceros para que la web funcione, cargar el calendario de reservas, analizar las visitas y, en su caso, mostrarte publicidad. Puedes aceptarlas, rechazarlas o elegir cuáles. <a href="' + base + 'cookies/">Más información</a></p>' +
      prefs +
      '<div class="row"><button type="button" class="btn small" data-act="todas">Aceptar todas</button>' +
      '<button type="button" class="btn small ghost" data-act="ninguna">Rechazar</button>' +
      '<button type="button" class="btn small ghost" data-act="config">' + (showPrefs ? 'Guardar mi selección' : 'Configurar') + '</button></div>';
    banner.addEventListener('click', function (e) {
      var a = e.target.getAttribute('data-act'); if (!a) return;
      if (a === 'todas') choose(all(true));
      else if (a === 'ninguna') choose(all(false));
      else {
        var p = banner.querySelector('.cookie-prefs');
        if (p.hidden) { p.hidden = false; e.target.textContent = 'Guardar mi selección'; return; }
        var c = all(false);
        [].forEach.call(banner.querySelectorAll('input[data-cat]'), function (i) { c[i.getAttribute('data-cat')] = i.checked; });
        choose(c);
      }
    });
    document.body.appendChild(banner);
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookies-aceptar]')) { var c = get() || all(false); c.funcionales = true; choose(c); }
    if (e.target.closest('[data-cookies-reabrir]')) open(true);
  });
  var c = get();
  apply(c);
  if (!c) open(false);
})();
