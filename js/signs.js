// 05 — «Мы потребляем знаки»: arms the entrance (styles in style.css) and plays it
// once when the block scrolls into view. Without JS, or with reduced motion,
// the block simply shows its final state.
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
  async function typeQuote() {
    quote.classList.add('is-typing');
    for (const letter of quote.dataset.text) {
      quote.textContent += letter;
      await wait(letter === ' ' ? 24 : 42);
    }
    quote.classList.remove('is-typing');
    quote.classList.add('is-typed');
  }

  new IntersectionObserver((entries, seen) => {
    if (!entries.some(e => e.isIntersecting)) return;
    seen.disconnect();
    // let the armed state paint first, or the transitions would be skipped
    requestAnimationFrame(() => requestAnimationFrame(async () => {
      block.classList.add('is-play');
      await wait(4600);
      await typeQuote();
    }));
  }, { threshold: .25 }).observe(block);
})();
