(function () {
  const cards = document.querySelectorAll('[data-memory-card]');
  if (!cards.length) {
    return;
  }

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  cards.forEach(card => {
    const tilt = randomInRange(-10, 10).toFixed(2);
    const shiftX = randomInRange(-10, 10).toFixed(1);
    const shiftY = randomInRange(-10, 10).toFixed(1);

    card.style.setProperty('--memory-tilt', `${tilt}deg`);
    card.style.setProperty('--memory-shift-x', `${shiftX}px`);
    card.style.setProperty('--memory-shift-y', `${shiftY}px`);
  });
})();
