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

  function showPanel() {
    panel.style.display = 'block';
    adjustPanelPosition();
    // Trigger reflow to ensure the transition works
    panel.offsetHeight;
    panel.classList.add('visible');
  }

  function hidePanel() {
    panel.classList.remove('visible');
    // Wait for the animation to complete before hiding
    setTimeout(() => {
      panel.style.display = 'none';
    }, 300); // Match the transition duration
  }

  // Set initial display state
  if (!localStorage.getItem(storageKey)) {
    showPanel();
  } else {
    panel.style.display = 'none';
  }

  // Handle window resize
  window.addEventListener('resize', function() {
    if (panel.classList.contains('visible')) {
      adjustPanelPosition();
    }
  });

  // Handle close button click
  closeButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    hidePanel();
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
      const isHidden = !panel.classList.contains('visible');
      if (isHidden) {
        showPanel();
        localStorage.removeItem(storageKey);
      } else {
        hidePanel();
        localStorage.setItem(storageKey, 'true');
      }
    }
  });
}); 