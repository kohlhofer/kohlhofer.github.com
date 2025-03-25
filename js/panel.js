document.addEventListener('DOMContentLoaded', function() {
  const panel = document.getElementById('nav-info-panel');
  if (!panel) return; // Exit if panel doesn't exist on this page
  
  const closeButton = panel.querySelector('.close-button');
  const activeNavLink = document.querySelector('.top-nav a.active');
  const currentPage = activeNavLink.getAttribute('href').split('.')[0]; // 'map' or 'music'
  const storageKey = `panel_closed_${currentPage}`;
  
  function adjustPanelPosition() {
    const linkRect = activeNavLink.getBoundingClientRect();
    document.documentElement.style.setProperty('--nav-bottom', `${linkRect.bottom}px`);
  }

  // Set initial display state
  if (!localStorage.getItem(storageKey)) {
    panel.style.display = 'block';
    adjustPanelPosition();
  } else {
    panel.style.display = 'none';
  }

  // Handle window resize
  window.addEventListener('resize', function() {
    if (panel.style.display === 'block') {
      adjustPanelPosition();
    }
  });

  // Handle close button click
  closeButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    panel.style.display = 'none';
    localStorage.setItem(storageKey, 'true');
  });

  // Prevent clicks on the panel from triggering the nav link
  panel.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
  });

  // Handle active nav item click
  activeNavLink.addEventListener('click', function(e) {
    if (this.classList.contains('active')) {
      e.preventDefault();
      const isHidden = panel.style.display === 'none';
      panel.style.display = isHidden ? 'block' : 'none';
      if (isHidden) {
        adjustPanelPosition();
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, 'true');
      }
    }
  });
}); 