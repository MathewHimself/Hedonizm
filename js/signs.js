// 05 — «Мы потребляем знаки»: arms the entrance and keeps the quote typing
// forwards and backwards. Without JS or with reduced motion, the final state stays visible.
(() => {
  const block = document.getElementById('signs');
  if (!block || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const quote = block.querySelector('.signs__quote blockquote');
  if (!quote) return;
  quote.dataset.text = quote.textContent.trim();
  quote.setAttribute('aria-label', quote.dataset.text);
  quote.textContent = '';
  quote.classList.add('longread-motion__copy');
  block.classList.add('is-armed', 'is-motion-armed');

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function loopQuote() {
    while (true) {
      quote.classList.remove('is-typed');
      quote.classList.add('is-typing');
      for (const letter of quote.dataset.text) {
        quote.textContent += letter;
        await wait(letter === ' ' ? 24 : 42);
      }
      await wait(900);

      while (quote.textContent) {
        quote.textContent = quote.textContent.slice(0, -1);
        await wait(55);
      }
      quote.classList.remove('is-typing');
      await wait(650);
    }
  }

  new IntersectionObserver((entries, seen) => {
    if (!entries.some(e => e.isIntersecting)) return;
    seen.disconnect();
    // let the armed state paint first, or the transitions would be skipped
    requestAnimationFrame(() => requestAnimationFrame(async () => {
      block.classList.add('is-play');
      await wait(3000);   // the list rows finish at ~2.9s (see --row in style.css)
      await loopQuote();
    }));
  }, { threshold: .25 }).observe(block);
})();
