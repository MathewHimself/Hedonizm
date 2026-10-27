// 10 — «Жажда»: loop the headline forwards and backwards while typing the copy.
(() => {
  const block = document.getElementById('thirst');
  if (!block || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const title = block.querySelector('.thirst__title');
  const lines = [...block.querySelectorAll('.thirst__text > span')];
  if (!title || !lines.length) return;

  title.dataset.text = title.textContent.trim();
  title.setAttribute('aria-label', title.dataset.text);
  title.textContent = '';

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

  async function loopTitle() {
    while (true) {
      title.classList.add('is-typing');
      for (const letter of title.dataset.text) {
        title.textContent += letter;
        await wait(150);
      }
      title.classList.remove('is-typing');
      await wait(900);

      title.classList.add('is-deleting');
      while (title.textContent) {
        title.textContent = title.textContent.slice(0, -1);
        await wait(105);
      }
      title.classList.remove('is-deleting');
      await wait(650);
    }
  }

  new IntersectionObserver((entries, observer) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();

    requestAnimationFrame(() => requestAnimationFrame(async () => {
      block.classList.add('is-play');
      void loopTitle();
      for (const line of lines) {
        await type(line);
        await wait(100);
      }
    }));
  }, { threshold: .25 }).observe(block);
})();
