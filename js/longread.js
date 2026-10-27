// Shared motion language for the visible headings and body copy. Bespoke
// sections (05–07 and 10) retain their dedicated animation sequences.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sequences = [
    { id: 'hero', title: '.hero__title', copy: [] },
    { id: 'want', title: '.want__title', copy: ['.want__quote blockquote'] },
    { id: 'measure', title: '.measure__label', copy: ['.measure__text', '.measure__quote blockquote'] },
    { id: 'slice', title: '.slice__title', copy: ['.slice__text'] },
    { id: 'bought', title: '.bought__title', copy: ['.bought__quote blockquote'] },
    { id: 'body', title: '.body__title', copy: ['.body__text'] },
    { id: 'memory', title: '.memory__title', copy: ['.memory__quote blockquote'] },
    { id: 'drill', title: '.drill__title', copy: ['.drill__text'] },
    { id: 'final', title: '.final__title', copy: ['.final__text p'] },
  ];

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function type(target) {
    target.classList.add('is-typing');
    for (const letter of target.dataset.text) {
      target.textContent += letter;
      await wait(letter === ' ' ? 24 : 42);
    }
    await wait(160);
    target.classList.remove('is-typing');
    target.classList.add('is-typed');
  }

  sequences.forEach(({ id, title: titleSelector, copy: copySelectors }) => {
    const section = document.getElementById(id);
    const title = section && section.querySelector(titleSelector);
    if (!section || !title) return;

    const copies = copySelectors.flatMap(selector => [...section.querySelectorAll(selector)]);
    const bodyParameters = id === 'body'
      ? [...section.querySelectorAll('.body__list :is(.body__metric, .body__status)')]
      : [];
    title.classList.add('longread-motion__title');
    copies.forEach(target => {
      target.classList.add('longread-motion__copy');
      target.dataset.text = target.textContent.trim();
      target.setAttribute('aria-label', target.dataset.text);
      target.textContent = '';
    });
    bodyParameters.forEach(target => {
      target.dataset.text = target.textContent.trim();
      target.setAttribute('aria-label', target.dataset.text);
      target.textContent = '';
    });
    section.classList.add('is-motion-armed');

    if (id === 'memory') {
      const materialObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          materialObserver.unobserve(entry.target);
          requestAnimationFrame(() => entry.target.classList.add('is-materialized'));
        });
      }, { threshold: .01 });
      section.querySelectorAll('.memory__img, .memory__self').forEach(element => materialObserver.observe(element));
    }

    new IntersectionObserver((entries, observer) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();

      requestAnimationFrame(() => requestAnimationFrame(async () => {
        section.classList.add('is-motion-play');

        if (id === 'body') {
          const parameters = [...section.querySelectorAll('.body__list li')];
          (async () => {
            await wait(950);
            for (const parameter of parameters) {
              const metric = parameter.querySelector('.body__metric');
              const status = parameter.querySelector('.body__status');
              metric?.classList.add('is-visible');
              if (metric) await type(metric);
              await wait(140);
              status?.classList.add('is-visible');
              if (status) await type(status);
              await wait(260);
            }
          })();
        }

        for (const target of copies) {
          await type(target);
          await wait(100);
        }
      }));
    }, { threshold: .22 }).observe(section);
  });
})();
