document.addEventListener('DOMContentLoaded', () => {
  // Animation for design list
  const targetElement = document.getElementById('design-target');
  const listElement = document.getElementById('design-list');
  const items = Array.from(listElement.getElementsByTagName('li'));
  let currentIndex = 0;
  let interval = 1000; // Start with 1 second
  let baseInterval = interval;
  let isAnimating = true;

  function wrapLetters(text, animDuration) {
    return text.split('').map(char => 
      char === ' ' ? ' ' : `<span class="letter" style="animation-delay: ${Math.random() * 0.2 * animDuration}s">${char}</span>`
    ).join('');
  }

  function startAnimation() {
    currentIndex = 0;
    isAnimating = true;
    updateText();
  }

  function updateText() {
    if (!isAnimating) return;
    
    // Calculate progress through the list (0 to 1)
    const progress = currentIndex / (items.length - 1);
    
    // Calculate intervals and animation durations
    interval = baseInterval * Math.pow(0.85, progress * 25);
    const animDuration = Math.max(0.05, 0.3 * Math.pow(0.85, progress * 15));
    
    const nextItem = items[currentIndex];
    const icon = nextItem.querySelector('i').outerHTML;
    const text = nextItem.textContent.trim();
    
    // Set new content with animated letters
    targetElement.style.setProperty('--animation-duration', `${animDuration}s`);
    targetElement.innerHTML = icon + wrapLetters(text, animDuration);
    
    // Add animation class to trigger animations
    requestAnimationFrame(() => {
      targetElement.querySelectorAll('.letter').forEach(el => el.classList.add('animate'));
    });

    currentIndex++;
    
    if (currentIndex >= items.length - 1) {
      // Show final "Everything" and stop
      const finalItem = items[items.length - 1];
      targetElement.innerHTML = finalItem.querySelector('i').outerHTML + 
                              wrapLetters(finalItem.textContent.trim(), animDuration);
      requestAnimationFrame(() => {
        targetElement.querySelectorAll('.letter').forEach(el => el.classList.add('animate'));
      });
      isAnimating = false;
      targetElement.classList.add('clickable');
      return;
    }
    
    setTimeout(updateText, Math.max(5, interval));
  }

  // Start the animation immediately
  updateText();

  // Add click handler for restarting animation
  targetElement.addEventListener('click', () => {
    if (!isAnimating) {
      targetElement.classList.remove('clickable');
      startAnimation();
    }
  });
}); 