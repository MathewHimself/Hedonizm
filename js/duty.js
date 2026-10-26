// 07 — «Счастье как обязанность»: reveal and check the list from top to
// bottom, strike the final item, then show the heading and quote.
(() => {
  const block = document.getElementById('duty');
  if (!block || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = [...block.querySelectorAll('.duty__list li')];
  const lead = block.querySelector('.duty__lead');
  const quote = block.querySelector('.duty__aside .quote');
  const quoteText = quote && quote.querySelector('blockquote');
  if (!items.length || !lead || !quoteText) return;

  [lead, quoteText].forEach(target => {
    target.dataset.text = target.textContent.trim();
    target.setAttribute('aria-label', target.dataset.text);
    target.textContent = '';
    target.classList.add('longread-motion__copy');
  });
  block.classList.add('is-armed', 'is-motion-armed');
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function type(target) {
    target.classList.add('is-typing');
    for (const letter of target.dataset.text) {
      target.textContent += letter;
      await wait(letter === ' ' ? 24 : 42);
    }
    target.classList.remove('is-typing');
    target.classList.add('is-typed');
  }

  new IntersectionObserver((entries, observer) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();

    requestAnimationFrame(() => requestAnimationFrame(async () => {
      await wait(62);
      for (const item of items) {
        item.classList.add('is-visible');
        await wait(90);

        if (item.classList.contains('duty__undone')) {
          item.classList.add('is-struck');
          await wait(182);
        } else {
          item.classList.add('is-checked');
          await wait(105);
        }
      }

      await wait(180);
      lead.classList.add('is-visible');
      await type(lead);
      await wait(180);
      quote.classList.add('is-visible');
      await type(quoteText);
    }));
  }, { threshold: .22 }).observe(block);
})();
