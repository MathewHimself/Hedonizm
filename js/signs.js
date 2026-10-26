// 05 — «Мы потребляем знаки»: arms the entrance (styles in style.css) and plays it
// once when the block scrolls into view. Without JS, or with reduced motion,
// the block simply shows its final state.
(() => {
  const block = document.getElementById('signs');
  if (!block || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  block.classList.add('is-armed');
  new IntersectionObserver((entries, seen) => {
    if (!entries.some(e => e.isIntersecting)) return;
    seen.disconnect();
    // let the armed state paint first, or the transitions would be skipped
    requestAnimationFrame(() => requestAnimationFrame(() => block.classList.add('is-play')));
  }, { threshold: .25 }).observe(block);
})();
