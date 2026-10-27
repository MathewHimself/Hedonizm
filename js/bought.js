// 04 — «Твои желания куплены»: five desire images form a random living collage.
(() => {
  const block = document.getElementById('bought');
  const layer = block?.querySelector('.bought__chaos');
  if (!block || !layer || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sources = [
    'images/bought-couple.jpg',
    'images/bought-tag.jpg',
    'images/bought-spritz.webp',
    'images/bought-shake.webp',
    'images/bought-orange.webp',
  ];

  let active = false;
  let timer = 0;
  let queue = [];

  const random = (min, max) => min + Math.random() * (max - min);

  function refillQueue() {
    queue = [...sources];
    for (let index = queue.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [queue[index], queue[swap]] = [queue[swap], queue[index]];
    }
  }

  function spawn() {
    if (!active) return;
    if (!queue.length) refillQueue();

    const image = document.createElement('img');
    const compact = innerWidth < 900;
    const life = random(1450, 2400);
    const rotation = random(-13, 13);

    image.className = 'bought__chaos-card';
    image.src = queue.pop();
    image.alt = '';
    image.style.setProperty('--x', `${random(-8, compact ? 55 : 76)}%`);
    image.style.setProperty('--y', `${random(-5, compact ? 67 : 61)}%`);
    image.style.setProperty('--w', `${random(compact ? 42 : 19, compact ? 72 : 38)}%`);
    image.style.setProperty('--r', `${rotation}deg`);
    image.style.setProperty('--r2', `${rotation + random(-12, 12)}deg`);
    image.style.setProperty('--life', `${life}ms`);
    image.style.zIndex = String(Math.floor(random(1, 8)));
    layer.append(image);

    setTimeout(() => image.remove(), life + 100);
    timer = setTimeout(spawn, random(260, 560));
  }

  block.classList.add('is-chaos');
  refillQueue();

  new IntersectionObserver(entries => {
    const visible = entries.some(entry => entry.isIntersecting);
    if (visible === active) return;
    active = visible;
    clearTimeout(timer);
    if (active) spawn();
  }, { threshold: .12 }).observe(block);
})();
