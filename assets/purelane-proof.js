/**
 * Purelane proof section — auto-rotating product showcase.
 */
function initPurelaneProof(root) {
  if (!(root instanceof HTMLElement) || root.dataset.plProofInit === 'true') return;
  root.dataset.plProofInit = 'true';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var slides = [].slice.call(root.querySelectorAll('.pl-rot__frame .pl-pimg'));
  var dots = [].slice.call(root.querySelectorAll('[data-pl-rot-dots] button'));
  var nameEl = root.querySelector('[data-pl-rot-name]');
  var noteEl = root.querySelector('[data-pl-rot-note]');
  if (slides.length < 2) return;

  var idx = 0;
  var timer;

  function show(i) {
    idx = i;
    slides.forEach(function (s, n) {
      s.classList.toggle('on', n === i);
    });
    dots.forEach(function (d, n) {
      d.classList.toggle('on', n === i);
      d.setAttribute('aria-selected', n === i ? 'true' : 'false');
    });
    if (nameEl) nameEl.textContent = slides[i].getAttribute('data-name') || '';
    if (noteEl) noteEl.textContent = slides[i].getAttribute('data-note') || '';
  }

  dots.forEach(function (dot, n) {
    dot.addEventListener('click', function () {
      show(n);
    });
  });

  timer = window.setInterval(function () {
    show((idx + 1) % slides.length);
  }, 3200);

  root.addEventListener('shopify:section:unload', function () {
    window.clearInterval(timer);
  });
}

document.querySelectorAll('[data-pl-proof-rot]').forEach(initPurelaneProof);
document.addEventListener('shopify:section:load', function (event) {
  var root = event.target.querySelector('[data-pl-proof-rot]');
  if (root) initPurelaneProof(root);
});
