/* Theme toggle: respects OS preference until the visitor overrides it.
   Runs in <head> (render-blocking, tiny) so the saved theme is applied
   before first paint — no flash. No inline JS, so CSP stays script-src 'self'. */
(function () {
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) {}

  function effectiveTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  }

  function wire() {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    var sync = function () {
      btn.setAttribute('aria-pressed', String(effectiveTheme() === 'dark'));
    };
    sync();
    btn.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      sync();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
