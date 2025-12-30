// Scattered card effect - cards lift on hover, land with new rotation on leave
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.bit-card');

  cards.forEach(card => {
    // Store current random rotation and fixed position
    card.randomRotation = (Math.random() - 0.5) * 2;
    card.posX = (Math.random() - 0.5) * 8;
    card.posY = (Math.random() - 0.5) * 8;
    applyTransform(card, false);

    // On hover: lift up
    card.addEventListener('mouseenter', () => {
      applyTransform(card, true);
    });

    // On leave: land with new random rotation only
    card.addEventListener('mouseleave', () => {
      card.randomRotation = (Math.random() - 0.5) * 2;
      applyTransform(card, false);
    });
  });

  function applyTransform(el, isHovered) {
    const lift = isHovered ? -6 : 0;
    el.style.transform = `rotate(${el.randomRotation}deg) translate(${el.posX}px, ${el.posY + lift}px)`;
  }
});
