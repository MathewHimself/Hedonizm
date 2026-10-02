// Endless buffet: fills the hero with plates and serves them from the edges inward.
(() => {
  const buffet = document.querySelector('.buffet');
  if (!buffet) return;

  function lay() {
    buffet.textContent = '';
    const size = parseFloat(getComputedStyle(buffet).getPropertyValue('--plate')) || 150;
    const stepX = size * 1.133;
    const stepY = size;
    const w = buffet.clientWidth;
    const h = buffet.clientHeight;
    const cols = Math.ceil(w / stepX) + 2;
    const rows = Math.ceil(h / stepY) + 1;
    const cx = window.innerWidth / 2;
    const cy = h / 2;
    const maxD = Math.hypot(cx, cy);
    const frag = document.createDocumentFragment();

    for (let r = 0; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const x = c * stepX + (r % 2) * stepX / 2;
        const y = r * stepY - size / 3;
        const s = document.createElement('span');
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        // edges first, centre last: the buffet closes in around the reader
        const d = 1 - Math.min(1, Math.hypot(x - cx, y - cy) / maxD);
        s.style.setProperty('--d', `${(d * 0.9).toFixed(2)}s`);
        frag.appendChild(s);
      }
    }
    buffet.appendChild(frag);
  }

  lay();
  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(lay, 150); });
})();
