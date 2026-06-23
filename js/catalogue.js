// Arrow-key page turning for the /catalogue/ collection. Progressive enhancement:
// the prev/next links in the footer already work; this just lets the keyboard
// turn pages like a book. Reads the <link rel="prev"/"next"> in the document.
(function () {
  function go(rel) {
    var l = document.querySelector('link[rel="' + rel + '"]');
    if (l && l.href) window.location.href = l.href;
  }
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    var t = e.target;
    if (t && /^(input|textarea|select)$/i.test(t.tagName)) return;
    if (t && t.isContentEditable) return;
    if (e.key === 'ArrowLeft') go('prev');
    else if (e.key === 'ArrowRight') go('next');
  });
})();
