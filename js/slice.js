// 03 — «Десятый кусок»: pieces of pie land in random spots one by one while the
// counter climbs to 10, then vanish one by one back down to 1 — and round again.
// Every round the pieces get new spots and sizes. Runs only while the block is on screen.
(() => {
  const block = document.getElementById('slice');
  const swarm = block && block.querySelector('.slice__swarm');
  const count = block && block.querySelector('.slice__count');
  if (!swarm || !count) return;

  const TOTAL = 10;
  const STEP = [110, 240];        // ms between two pieces, min–max
  const HOLD_EMPTY = 450;          // pause at 1; at 10 it turns back right away
  const mobile = matchMedia('(max-width: 899px)');
  const calm = matchMedia('(prefers-reduced-motion: reduce)');

  // layout grids in px of the mockup: the area pieces may land in, piece sizes,
  // and spots kept clear (the counter, the heart of the big piece, the headline and the text)
  const GRIDS = {
    desktop: { w: 1440, h: 1180, min: 80, max: 280, keepClear: [[90, 380, 400, 400], [540, 300, 400, 360], [80, 750, 870, 290], [80, 1020, 560, 100]] },
    mobile:  { w: 375,  h: 300,  min: 36, max: 104, keepClear: [[0, 96, 190, 210], [120, 120, 150, 120]] },
  };

  const rand = (a, b) => a + Math.random() * (b - a);
  const hits = (a, b) => a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3];

  const pieces = Array.from({ length: TOTAL }, () => {
    const el = document.createElement('div');
    el.className = 'slice__sq';
    el.innerHTML = '<img src="images/slice-pie.png" alt="" width="180" height="180">';
    swarm.appendChild(el);
    return { el, box: null, on: false };
  });

  // a free spot for one piece, avoiding the kept-clear zones and, as far as it can, the other pieces
  function spot(grid, taken) {
    let best = null;
    for (let tries = 0; tries < 400; tries++) {
      // skew towards small pieces so the big ones stand out
      const s = grid.min + (grid.max - grid.min) * Math.random() ** 1.15;
      const box = [rand(0, grid.w - s), rand(0, grid.h - s), s, s];
      if (grid.keepClear.some(z => hits(box, z))) continue;
      const crowd = taken.filter(p => Math.hypot(p[0] - box[0], p[1] - box[1]) < (p[2] + s) * .45).length;
      if (!best || crowd < best.crowd) best = { box, crowd };
      if (crowd === 0) break;
    }
    return best.box;
  }

  function place(p, box) {
    p.box = box;
    p.el.style.setProperty('--x', box[0].toFixed(1));
    p.el.style.setProperty('--y', box[1].toFixed(1));
    p.el.style.setProperty('--s', box[2].toFixed(1));
    p.el.style.setProperty('--r', `${rand(-20, 20).toFixed(1)}deg`);
  }

  // new spots and sizes for the hidden pieces; the visible ones stay where they are
  function reshuffle() {
    const grid = GRIDS[mobile.matches ? 'mobile' : 'desktop'];
    const taken = pieces.filter(p => p.on).map(p => p.box);
    pieces.filter(p => !p.on).forEach(p => { const box = spot(grid, taken); taken.push(box); place(p, box); });
  }

  // a breakpoint switch changes the grid, so everything is laid out anew
  function relayAll() {
    const grid = GRIDS[mobile.matches ? 'mobile' : 'desktop'];
    const taken = [];
    pieces.forEach(p => { const box = spot(grid, taken); taken.push(box); place(p, box); });
  }

  const visible = () => pieces.filter(p => p.on).length;
  function show(p, on) {
    p.on = on;
    p.el.classList.toggle('is-on', on);
    count.textContent = visible();
  }
  const pick = list => list[Math.floor(Math.random() * list.length)];

  relayAll();
  show(pieces[0], true);   // the round starts at 1

  if (calm.matches) {
    pieces.forEach(p => show(p, true));
    return;
  }

  let rising = true, timer = 0, running = false;

  function tick() {
    let wait = rand(...STEP);
    if (rising) {
      show(pick(pieces.filter(p => !p.on)), true);
      if (visible() === TOTAL) rising = false;
    } else {
      show(pick(pieces.filter(p => p.on)), false);
      if (visible() === 1) { rising = true; wait = HOLD_EMPTY; setTimeout(reshuffle, 250); }
    }
    timer = setTimeout(tick, wait);
  }

  mobile.addEventListener('change', relayAll);

  new IntersectionObserver(entries => {
    const inView = entries.some(e => e.isIntersecting);
    if (inView && !running) { running = true; timer = setTimeout(tick, 300); }
    if (!inView && running) { running = false; clearTimeout(timer); }
  }, { threshold: .35 }).observe(block);
})();
