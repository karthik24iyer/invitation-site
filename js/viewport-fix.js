// Viewport height fix for mobile browsers
// Handles dynamic viewport changes and sets CSS custom properties

(function() {
  'use strict';

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  let resizeTimer;
  const RESIZE_DELAY = 100;

  function updateVH() {
    const newVH = window.innerHeight * 0.01;

    // Only update if there's a significant change (more than 1px)
    if (Math.abs(vh - newVH) > 0.01) {
      vh = newVH;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      // Dispatch custom event for other scripts to listen to
      window.dispatchEvent(new CustomEvent('viewportHeightChanged', {
        detail: { vh: vh, innerHeight: window.innerHeight }
      }));
    }
  }

  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateVH, RESIZE_DELAY);
  }

  function handleOrientationChange() {
    // Wait for orientation change to complete
    setTimeout(updateVH, 150);
  }

  // Listen for resize events
  window.addEventListener('resize', handleResize);

  // Listen for orientation changes (mobile)
  window.addEventListener('orientationchange', handleOrientationChange);

  // iOS specific handling for viewport changes
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    // iOS Safari address bar toggle detection
    let initialHeight = window.innerHeight;

    window.addEventListener('resize', () => {
      const heightDiff = Math.abs(window.innerHeight - initialHeight);

      // Significant height change suggests address bar toggle
      if (heightDiff > 60) {
        setTimeout(updateVH, 50);
      }
    });

    // Visual viewport API support (iOS 13+)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        const newVH = window.visualViewport.height * 0.01;
        document.documentElement.style.setProperty('--vh', `${newVH}px`);
      });
    }
  }

  // Android Chrome specific handling
  if (/Android/.test(navigator.userAgent) && /Chrome/.test(navigator.userAgent)) {
    // Handle address bar hiding/showing
    let lastHeight = window.innerHeight;

    const checkHeight = () => {
      if (window.innerHeight !== lastHeight) {
        lastHeight = window.innerHeight;
        updateVH();
      }
    };

    // Check more frequently on Android Chrome
    setInterval(checkHeight, 250);
  }

  // Initial call
  updateVH();

  console.log('Viewport height fix initialized:', { vh, innerHeight: window.innerHeight });
})();