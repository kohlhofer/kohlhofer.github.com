// Page exit transitions
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    // Skip external links, hash links, blank targets, and active nav links (which have info panels)
    if (!href || href.startsWith('http') || href.startsWith('#') || link.target === '_blank' || link.classList.contains('active')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(() => window.location.href = href, 250);
    });
  });
});
