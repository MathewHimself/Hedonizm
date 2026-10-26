// 10 — «Жажда»: lift the headline into view, then type the two lines of copy.
(() => {
  const block = document.getElementById('thirst');
  if (!block || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lines = [...block.querySelectorAll('.thirst__text > span')];
  if (!lines.length) return;

  lines.forEach(line => {
    line.dataset.text = line.textContent.trim();
    line.textContent = '';
  });
  block.classList.add('is-armed');

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function type(line) {
    line.classList.add('is-typing');
    for (const letter of line.dataset.text) {
      line.textContent += letter;
      await wait(letter === ' ' ? 24 : 42);
    }
    await wait(160);
    line.classList.remove('is-typing');
    line.classList.add('is-typed');
  }

  new IntersectionObserver((entries, observer) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();

    requestAnimationFrame(() => requestAnimationFrame(async () => {
      block.classList.add('is-play');
      await wait(850);
      for (const line of lines) {
        await type(line);
        await wait(100);
      }
    }));
  }, { threshold: .25 }).observe(block);
})();
