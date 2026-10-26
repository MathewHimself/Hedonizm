// 03 — «Десятый кусок»: when the block comes into view, ten more pieces land
// in random spots one by one and the counter climbs from 1 to 10.
(() => {
  const block = document.getElementById('slice');
  const swarm = block && block.querySelector('.slice__swarm');
  const count = block && block.querySelector('.slice__count');
  if (!swarm || !count) return;

  const TOTAL = 10;
  const mobile = matchMedia('(max-width: 899px)');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');

  // layout grids in px of the mockup: the area pieces may land in, piece sizes,
  // and spots kept clear (the counter, the heart of the big piece, the headline and the text)
  const GRIDS = {
    desktop: { w: 1440, h: 1180, min: 150, max: 220, keepClear: [[90, 380, 400, 400], [540, 300, 400, 360], [80, 750, 870, 290], [80, 1020, 560, 100]] },
    mobile:  { w: 375,  h: 300,  min: 56,  max: 84,  keepClear: [[0, 96, 190, 210], [120, 120, 150, 120]] },
  };

  const hits = (a, b) => a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3];

  function scatter(grid) {
    const placed = [];
    for (let i = 0; i < TOTAL; i++) {
      let best = null;
      for (let tries = 0; tries < 400; tries++) {
        const s = grid.min + Math.random() * (grid.max - grid.min);
        const box = [Math.random() * (grid.w - s), Math.random() * (grid.h - s), s, s];
        if (grid.keepClear.some(z => hits(box, z))) continue;
        // let pieces touch, but not pile up on one another
        const crowd = placed.filter(p => Math.hypot(p[0] - box[0], p[1] - box[1]) < (p[2] + s) * .45).length;
        if (!best || crowd < best.crowd) best = { box, crowd };
        if (crowd === 0) break;
      }
      placed.push(best.box);
    }
    return placed;
  }

  const pieces = Array.from({ length: TOTAL }, () => {
    const sq = document.createElement('div');
    sq.className = 'slice__sq';
    sq.style.setProperty('--r', `${(Math.random() * 40 - 20).toFixed(1)}deg`);
    sq.innerHTML = '<img src="images/slice-pie.png" alt="" width="180" height="180">';
    swarm.appendChild(sq);
    return sq;
  });

  function lay() {
    scatter(GRIDS[mobile.matches ? 'mobile' : 'desktop']).forEach(([x, y, s], i) => {
      pieces[i].style.setProperty('--x', x.toFixed(1));
      pieces[i].style.setProperty('--y', y.toFixed(1));
      pieces[i].style.setProperty('--s', s.toFixed(1));
    });
  }
  lay();
  mobile.addEventListener('change', lay);

  function serve() {
    if (calm.matches) {
      pieces.forEach(p => p.classList.add('is-on'));
      count.textContent = TOTAL;
      return;
    }
    let i = 0;
    (function next() {
      pieces[i].classList.add('is-on');
      count.textContent = ++i;
      if (i < TOTAL) setTimeout(next, 180 + Math.random() * 320);
    })();
  }

  new IntersectionObserver((entries, seen) => {
    if (entries.some(e => e.isIntersecting)) { seen.disconnect(); serve(); }
  }, { threshold: .35 }).observe(block);
})();
