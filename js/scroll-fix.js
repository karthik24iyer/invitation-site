// Enhanced scroll solution for consistent mobile behavior
// Works alongside CSS scroll-snap, enhances on mobile devices only

(function() {
  'use strict';

  // Wait for DOM and GSAP to be ready
  let initTimeout;

  function init() {
    // Clear any existing timeout
    if (initTimeout) clearTimeout(initTimeout);

    // Feature detection
    const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    const supportsScrollSnap = CSS.supports('scroll-snap-type', 'y mandatory');

    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    console.log('Scroll Fix Initialized:', { hasGSAP, supportsScrollSnap, isMobile, isIOS, isAndroid, isSafari });

    // Only enhance on mobile devices with known issues
    const needsEnhancement = isMobile && (isIOS || isAndroid);

    if (hasGSAP && needsEnhancement) {
      console.log('Applying GSAP scroll enhancements for mobile');
      initGSAPScroll();
    } else {
      console.log('Using standard CSS scroll behavior');
      initFallbackScroll();
    }
  }

  // Try to initialize when GSAP is ready
  if (typeof gsap !== 'undefined') {
    init();
  } else {
    // Wait a bit for GSAP to load
    initTimeout = setTimeout(init, 1000);
  }

  function initGSAPScroll() {
    try {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      let panels = gsap.utils.toArray(".section"),
          observer,
          isEnhancing = false;

      if (!panels.length) {
        console.warn('No sections found, falling back to CSS scroll');
        return;
      }

      // Only enhance scroll behavior, don't replace it completely
      // This works alongside CSS scroll-snap

      // Handle mobile viewport changes
      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 200);
      });

      // Handle iOS specific viewport changes
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        let initialHeight = window.innerHeight;

        window.addEventListener('resize', () => {
          const heightChange = Math.abs(window.innerHeight - initialHeight);

          // Significant height change suggests address bar toggle
          if (heightChange > 100) {
            setTimeout(() => {
              ScrollTrigger.refresh();
              // Realign current section if needed
              const pageWrapper = document.querySelector('.page-wrapper');
              if (pageWrapper) {
                const currentSection = Math.round(pageWrapper.scrollTop / window.innerHeight);
                const targetScroll = currentSection * window.innerHeight;
                const currentScroll = pageWrapper.scrollTop;

                // Only adjust if significantly misaligned
                if (Math.abs(currentScroll - targetScroll) > 50) {
                  pageWrapper.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                  });
                }
              }
            }, 100);
          }
        });
      }

      console.log('GSAP scroll enhancements applied with', panels.length, 'panels');

    } catch (error) {
      console.error('GSAP scroll enhancement failed:', error);
      console.log('Falling back to CSS scroll behavior');
    }
  }

  function initFallbackScroll() {
    console.log('Using standard CSS scroll behavior');

    // CSS scroll-snap should handle most cases
    // Only add minimal enhancements if needed

    const pageWrapper = document.querySelector('.page-wrapper');
    const sections = document.querySelectorAll('.section');

    if (!pageWrapper || !sections.length) {
      console.log('Page wrapper or sections not found');
      return;
    }

    console.log('Basic scroll initialized with', sections.length, 'sections');

    // Monitor viewport changes for mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // Handle mobile viewport changes
      let lastHeight = window.innerHeight;

      window.addEventListener('resize', () => {
        const currentHeight = window.innerHeight;
        const heightDiff = Math.abs(currentHeight - lastHeight);

        // Significant height change on mobile (address bar)
        if (heightDiff > 100) {
          setTimeout(() => {
            // Ensure current section stays aligned
            const currentSection = Math.round(pageWrapper.scrollTop / currentHeight);
            const targetScroll = currentSection * currentHeight;

            if (Math.abs(pageWrapper.scrollTop - targetScroll) > 50) {
              pageWrapper.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
              });
            }
          }, 100);
        }

        lastHeight = currentHeight;
      });
    }
  }

  // Navigation scroll handling
  function initNavigationScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Use native scroll-into-view which works well with CSS scroll-snap
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      });
    });
  }

  // Initialize navigation after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigationScroll);
  } else {
    initNavigationScroll();
  }

  // Initialize main scroll behavior
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();