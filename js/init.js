document.addEventListener('DOMContentLoaded', () => {
  // Initialize shader background
  new ShaderBackground();

  // Page exit transitions
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || link.target === '_blank') return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(() => window.location.href = href, 250);
    });
  });
}); 