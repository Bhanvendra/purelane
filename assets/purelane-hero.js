/**
 * Hero product stage carousel — auto-advances when visible.
 */
function initPurelaneHero(root) {
  if (!(root instanceof HTMLElement) || root.dataset.purelaneHeroInit === 'true') return;
  root.dataset.purelaneHeroInit = 'true';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stage = root.querySelector('.pl-hstage');
  if (!stage) return;

  var slides = [].slice.call(stage.querySelectorAll('.pl-hslide'));
  var dotsWrap = root.querySelector('.pl-hdots');
  var dots = dotsWrap ? [].slice.call(dotsWrap.querySelectorAll('button')) : [];
  var i = 0;
  var timer = null;

  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, idx) {
      s.classList.toggle('on', idx === i);
    });
    dots.forEach(function (d, idx) {
      d.classList.toggle('on', idx === i);
      d.setAttribute('aria-selected', idx === i ? 'true' : 'false');
    });
  }

  function play() {
    if (!timer && !reduce && slides.length > 1) {
      timer = window.setInterval(function () {
        go(i + 1);
      }, 3800);
    }
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach(function (d, idx) {
    d.addEventListener('click', function () {
      stop();
      go(idx);
      play();
    });
  });

  stage.addEventListener('mouseenter', stop);
  stage.addEventListener('mouseleave', play);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          e.isIntersecting ? play() : stop();
        });
      },
      { threshold: 0.2 }
    ).observe(stage);
  } else {
    play();
  }
}

document.querySelectorAll('.pl-hero[data-section-id]').forEach(initPurelaneHero);
document.addEventListener('shopify:section:load', function (event) {
  var root = event.target.querySelector('.pl-hero[data-section-id]');
  if (root) initPurelaneHero(root);
});
