// 06 — «Ты хочешь чужое»: the images enter 3 -> 2 -> 1, then the three
// labels keep typing and erasing themselves in a loop while the quote types once.
(() => {
  const block = document.getElementById('other');
  if (!block || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tags = [...block.querySelectorAll('.other__tags li')];
  const quote = block.querySelector('.other__quote blockquote');
  if (!tags.length || !quote) return;

  tags.forEach(tag => {
    tag.dataset.text = tag.textContent.trim();
    tag.textContent = '';
  });
  quote.dataset.text = quote.textContent.trim();
  quote.setAttribute('aria-label', quote.dataset.text);
  quote.textContent = '';
  quote.classList.add('longread-motion__copy');
  block.classList.add('is-armed', 'is-motion-armed');

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function type(tag) {
    const text = tag.dataset.text;
    tag.classList.add('is-typing');
    for (const letter of text) {
      tag.textContent += letter;
      await wait(letter === ' ' ? 35 : 62);
    }
    await wait(180);
    tag.classList.remove('is-typing');
    tag.classList.add('is-typed');
  }

  async function erase(tag) {
    tag.classList.add('is-deleting');
    while (tag.textContent) {
      tag.textContent = tag.textContent.slice(0, -1);
      await wait(40);
    }
    // an empty label hides, so no bare cyan stub is left behind
    tag.classList.remove('is-deleting', 'is-typed');
  }

  async function loopTags() {
    while (true) {
      await Promise.all(tags.map(type));
      await wait(1300);
      await Promise.all(tags.map(erase));
      await wait(450);
    }
  }

  async function typeQuote() {
    quote.classList.add('is-typing');
    for (const letter of quote.dataset.text) {
      quote.textContent += letter;
      await wait(letter === ' ' ? 24 : 42);
    }
    quote.classList.remove('is-typing');
    quote.classList.add('is-typed');
  }

  new IntersectionObserver((entries, observer) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();

    requestAnimationFrame(() => requestAnimationFrame(async () => {
      block.classList.add('is-play');
      await wait(2250);
      void typeQuote();
      await loopTags();
    }));
  }, { threshold: .24 }).observe(block);
})();
