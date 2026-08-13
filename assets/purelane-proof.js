/**
 * Purelane proof section — auto-rotating product showcase.
 */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('[data-pl-proof-rot]').forEach(function (rot) {
    var slides = [].slice.call(rot.querySelectorAll('.pl-rot__frame .pl-pimg'));
    var dots = [].slice.call(rot.querySelectorAll('[data-pl-rot-dots] i'));
    var nameEl = rot.querySelector('[data-pl-rot-name]');
    var noteEl = rot.querySelector('[data-pl-rot-note]');
    if (slides.length < 2) return;

    var idx = 0;

    function show(i) {
      idx = i;
      slides.forEach(function (s, n) {
        s.classList.toggle('on', n === i);
      });
      dots.forEach(function (d, n) {
        d.classList.toggle('on', n === i);
      });
      if (nameEl) nameEl.textContent = slides[i].getAttribute('data-name') || '';
      if (noteEl) noteEl.textContent = slides[i].getAttribute('data-note') || '';
    }

    setInterval(function () {
      show((idx + 1) % slides.length);
    }, 3200);
  });
})();
