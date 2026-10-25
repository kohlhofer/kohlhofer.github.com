/* Apps I make — a slim, dismissible strip at the bottom of the page.
 *
 * Appended as the last child of <body>. On viewports 640px and wider it is
 * pinned to the bottom edge (position: fixed, and a matching rule in each
 * page's inline styles adds room so nothing is covered); below that it sits
 * in normal flow at the end of the page. A dismissal is remembered per
 * browser via localStorage. The strip's markup is built here so the pages
 * only need one <script> tag; its CSS lives in each page's inline <style>
 * block (the site's CSP allows inline styles but not external stylesheets).
 */
(function () {
  "use strict";

  var KEY = "kohlhofer-appstrip-dismissed";
  var DESKTOP = window.matchMedia ? window.matchMedia("(min-width: 640px)") : { matches: true };

  var APPS = [
    ["Signal Recorder SR-7", "https://signalrecorder.app/"],
    ["Markdown Library ML-42", "https://markdownlibrary.app/"],
    ["Chaos Studies", "https://chaosstudies.app/"]
  ];

  function isDismissed() {
    try {
      return window.localStorage.getItem(KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function rememberDismissal() {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch (e) {}
  }

  function appstrip() {
    return document.getElementById("appstrip");
  }

  function syncHtmlClass() {
    document.documentElement.classList.toggle(
      "appstrip-on",
      Boolean(appstrip()) && DESKTOP.matches
    );
  }

  function remove() {
    var strip = appstrip();
    if (!strip) return;
    strip.parentNode.removeChild(strip);
    syncHtmlClass();
  }

  function closeStrip() {
    rememberDismissal();
    var strip = appstrip();
    if (!strip) return;
    var reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      remove();
      return;
    }
    strip.classList.add("appstrip-gone");
    strip.addEventListener("transitionend", remove, { once: true });
    window.setTimeout(remove, 350); /* in case transitionend never fires */
  }

  function build() {
    if (appstrip() || isDismissed()) return;

    var strip = document.createElement("aside");
    strip.id = "appstrip";
    strip.className = "appstrip";
    strip.setAttribute("aria-label", "Apps I make");

    var label = document.createElement("span");
    label.className = "appstrip-label";
    label.textContent = "Apps I make";
    strip.appendChild(label);

    var nav = document.createElement("nav");
    nav.className = "appstrip-nav";
    APPS.forEach(function (entry) {
      var link = document.createElement("a");
      link.href = entry[1];
      link.textContent = entry[0];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      nav.appendChild(link);
    });
    strip.appendChild(nav);

    var close = document.createElement("button");
    close.type = "button";
    close.className = "appstrip-close";
    close.setAttribute("aria-label", "Dismiss apps strip");
    close.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    close.addEventListener("click", closeStrip);
    strip.appendChild(close);

    document.body.appendChild(strip);
    syncHtmlClass();

    if (typeof DESKTOP.addEventListener === "function") {
      DESKTOP.addEventListener("change", syncHtmlClass);
    } else if (typeof DESKTOP.addListener === "function") {
      DESKTOP.addListener(syncHtmlClass);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
