// 01 — «Ты хочешь всё»: the headline types itself line by line and erases itself
// back, in a loop. Runs only while the block is on screen.
(() => {
  const block = document.getElementById('want');
  if (!block || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const title = block.querySelector('.want__title');
  const parts = title ? [...title.querySelectorAll('.headline__line, .headline__mark')] : [];
  if (!parts.length) return;

  const TYPE = 110, ERASE = 65, HOLD_FULL = 1400, HOLD_EMPTY = 600;

  title.setAttribute('aria-label', parts.map(p => p.textContent.trim()).join(' '));
  parts.forEach(p => {
    p.setAttribute('aria-hidden', 'true');
    p.dataset.text = p.textContent.trim();
    p.textContent = '';
  });
  block.classList.add('is-type-armed');

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  let running = false, wake = null;
  // holds the loop while the block is off screen
  const resume = () => running ? Promise.resolve() : new Promise(resolve => { wake = resolve; });

  async function step(ms) {
    await wait(ms);
    await resume();
  }

  async function loop() {
    while (true) {
      for (const p of parts) {
        p.classList.add('is-typing');
        for (const letter of p.dataset.text) {
          p.textContent += letter;
          await step(letter === ' ' ? TYPE * .6 : TYPE);
        }
        p.classList.remove('is-typing');
      }
      await step(HOLD_FULL);

      for (const p of [...parts].reverse()) {
        p.classList.add('is-deleting');
        while (p.textContent) {
          p.textContent = p.textContent.slice(0, -1);
          await step(ERASE);
        }
        p.classList.remove('is-deleting');
      }
      await step(HOLD_EMPTY);
    }
  }

  let started = false;
  new IntersectionObserver(entries => {
    running = entries.some(e => e.isIntersecting);
    if (running && wake) { wake(); wake = null; }
    if (running && !started) { started = true; void loop(); }
  }, { threshold: .2 }).observe(block);
})();
