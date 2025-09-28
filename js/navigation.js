document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  const trigger = document.querySelector('.nav-trigger');
  const sheet = document.getElementById('nav-menu');

  if (!nav || !trigger || !sheet) {
    return;
  }

  const openMenu = () => {
    nav.classList.add('is-open');
    sheet.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    if (!nav.classList.contains('is-open')) {
      return;
    }
    nav.classList.remove('is-open');
    sheet.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  };

  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  sheet.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
});
