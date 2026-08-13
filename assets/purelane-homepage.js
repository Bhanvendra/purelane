/**
 * Purelane homepage shell — scroll scenes, reveal, progress rail, mobile nav.
 */
(function () {
  if (!document.body.classList.contains('template-index')) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal on scroll */
  var revs = document.querySelectorAll('.pl-rv');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('pl-rv--in');
            ro.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    revs.forEach(function (el) {
      ro.observe(el);
    });
  } else {
    revs.forEach(function (el) {
      el.classList.add('pl-rv--in');
    });
  }

  /* Scene crossfade */
  var scenes = [].slice.call(document.querySelectorAll('.pl-scene'));
  var zones = [].slice.call(document.querySelectorAll('[data-pl-scene]'));
  var stage = document.getElementById('pl-scenes');
  var current = 1;

  function setScene(n) {
    if (n === current || !scenes.length) return;
    current = n;
    scenes.forEach(function (s, i) {
      s.classList.toggle('on', i + 1 === n);
    });
    if (stage) stage.setAttribute('data-d', String(n));
  }

  function pickScene() {
    if (!zones.length) return;
    var focus = window.scrollY + window.innerHeight * 0.5;
    var n = 1;
    zones.forEach(function (z) {
      var top = z.getBoundingClientRect().top + window.scrollY;
      if (top <= focus) n = parseInt(z.getAttribute('data-pl-scene'), 10) || n;
    });
    setScene(n);
  }

  /* Progress rail */
  var railLinks = [].slice.call(document.querySelectorAll('.pl-rail a'));
  var targets = railLinks.map(function (a) {
    var href = a.getAttribute('href');
    return href && href.charAt(0) === '#' ? document.querySelector(href) : null;
  });

  function syncRail() {
    var mid = window.scrollY + window.innerHeight * 0.42;
    var idx = 0;
    targets.forEach(function (t, i) {
      if (t && t.getBoundingClientRect().top + window.scrollY <= mid) idx = i;
    });
    railLinks.forEach(function (a, i) {
      a.classList.toggle('on', i === idx);
    });
  }

  /* Header shrink on scroll */
  var hdr = document.getElementById('pl-chrome-hdr');
  function syncHeader() {
    if (hdr) hdr.classList.toggle('up', window.scrollY > 60);
  }

  function onScroll() {
    pickScene();
    syncRail();
    syncHeader();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile drawer */
  var burger = document.querySelector('[data-pl-menu-toggle]');
  var drawer = document.querySelector('[data-pl-menu-drawer]');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('shopify:section:load', onScroll);
})();
