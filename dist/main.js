(() => {
  'use strict';
  const html = document.documentElement;
  const title = document.querySelector('.ink-title');
  const suffix = document.querySelector('.dev-suffix');
  const motionInput = document.querySelector('#reduce-motion');
  const topControl = document.querySelector('.back-to-top');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let savedMotion = null;
  try { savedMotion = localStorage.getItem('aditusan-reduce-motion'); } catch { /* Browser storage is optional. */ }
  let reduceMotion = savedMotion === null ? motionQuery.matches : savedMotion === 'true';
  let inkCycle = 0;
  let isAtTop = window.scrollY <= 20;
  let scrollFrame = 0;

  function applyMotion() {
    html.classList.toggle('reduce-motion', reduceMotion);
    html.classList.toggle('motion-enabled', !reduceMotion && savedMotion === 'false');
    motionInput.checked = reduceMotion;
    if (reduceMotion) {
      title.classList.remove('is-writing');
      title.dataset.inkState = 'complete';
      title.classList.add('has-played');
      document.querySelector('.hero').style.removeProperty('--landscape-y');
    }
    window.dispatchEvent(new CustomEvent('aditusan:motionchange', { detail: { reduced: reduceMotion } }));
  }

  function replayInk() {
    inkCycle += 1;
    title.dataset.inkCycle = String(inkCycle);
    title.classList.remove('is-writing');
    title.classList.add('has-played');
    title.dataset.inkState = reduceMotion ? 'complete' : 'writing';
    if (reduceMotion) return;
    // Restart both the glyph masks and the delayed solid-type .dev fade together.
    void title.offsetWidth;
    title.classList.add('is-writing');
  }

  suffix.addEventListener('animationend', (event) => {
    if (event.animationName === 'dev-appear') title.dataset.inkState = 'complete';
  });

  motionInput.addEventListener('change', () => {
    reduceMotion = motionInput.checked;
    savedMotion = String(reduceMotion);
    try { localStorage.setItem('aditusan-reduce-motion', savedMotion); } catch { /* Keep the setting for this visit. */ }
    applyMotion();
    if (!reduceMotion && window.scrollY <= 20) replayInk();
  });

  motionQuery.addEventListener('change', (event) => {
    if (savedMotion !== null) return;
    reduceMotion = event.matches;
    applyMotion();
    if (!reduceMotion && window.scrollY <= 20) replayInk();
  });

  function updateScroll() {
    const y = Math.max(0, window.scrollY);
    html.classList.toggle('is-scrolled', y > 180);
    topControl.classList.toggle('is-visible', y > 420);
    updateActiveNav();
    // Hysteresis prevents tiny trackpad movements at the boundary from restarting it.
    if (y > 80) isAtTop = false;
    if (y <= 20 && !isAtTop) {
      isAtTop = true;
      replayInk();
    }
    if (!reduceMotion && y < 1100) {
      document.querySelector('.hero').style.setProperty('--landscape-y', `${Math.min(y * .12, 100)}px`);
    }
    scrollFrame = 0;
  }

  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }, { passive: true });

  document.querySelectorAll('[data-home]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (window.scrollY <= 20) {
        isAtTop = true;
        replayInk();
      }
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
      if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
    });
  });

  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const sections = [...document.querySelectorAll('.section-observed')];
  function updateActiveNav() {
    const offset = parseFloat(getComputedStyle(html).scrollPaddingTop) + 25;
    let current = sections[0].id;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= offset) current = section.id;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1].id;
    }
    navLinks.forEach((link) => {
      if (link.dataset.nav === current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('resize', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }, { passive: true });
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: .06, rootMargin: '0px 0px -25px 0px' });
    document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));
  } else {
    document.querySelectorAll('.reveal').forEach((item) => item.classList.add('in-view'));
  }

  const projectCards = [...document.querySelectorAll('.project-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projectGrid = document.querySelector('#project-grid');
  const filterStatus = document.querySelector('#filter-status');
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      projectGrid.classList.toggle('is-filtered', filter !== 'all');
      let count = 0;
      projectCards.forEach((card) => {
        const visible = filter === 'all' || card.dataset.category === filter;
        card.hidden = !visible;
        if (visible) { count += 1; card.classList.add('in-view'); }
      });
      filterStatus.textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown.`;
    });
  });

  const dialog = document.querySelector('#project-dialog');
  const dialogClose = dialog.querySelector('.dialog-close');
  let openingButton = null;
  let returnScrollY = 0;

  function closeProject() {
    if (dialog.open) dialog.close();
  }

  function openProject(key, button) {
    const project = window.ADITUSAN_PROJECTS[key];
    if (!project) return;
    openingButton = button;
    returnScrollY = window.scrollY;
    document.querySelector('#dialog-kicker').textContent = project.kicker;
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-status').textContent = project.status;
    document.querySelector('#dialog-lede').textContent = project.lede;
    document.querySelector('#dialog-description').textContent = project.description;
    document.querySelector('#dialog-disclaimer').textContent = project.disclaimer;
    const notes = project.notes.map((note) => {
      const item = document.createElement('li'); item.textContent = note; return item;
    });
    document.querySelector('#dialog-notes').replaceChildren(...notes);
    const links = project.links.map((link) => {
      const anchor = document.createElement('a');
      anchor.textContent = link.label;
      anchor.href = link.href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.className = link.primary ? 'brush-button' : 'quiet-link';
      return anchor;
    });
    document.querySelector('#dialog-actions').replaceChildren(...links);
    const art = document.querySelector('#dialog-art');
    const image = document.createElement('img');
    image.src = window.ADITUSAN_ASSET_URLS?.[project.image] || `./assets/${project.image}`;
    image.alt = project.imageAlt || '';
    art.dataset.imageKind = project.imageKind || 'illustration';
    image.width = project.imageKind === 'website' ? 1348 : 700;
    image.height = project.imageKind === 'website' ? 936 : 480;
    art.style.backgroundColor = project.color;
    art.replaceChildren(image);
    dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.scrollTop = 0;
    dialogClose.focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => openProject(button.dataset.project, button));
  });
  dialogClose.addEventListener('click', closeProject);
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeProject();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    window.scrollTo({ top: returnScrollY, behavior: 'instant' });
    if (openingButton) openingButton.focus({ preventScroll: true });
  });

  document.querySelector('#copyright-year').textContent = String(new Date().getFullYear());
  applyMotion();
  replayInk();
  updateScroll();
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && window.scrollY <= 20) { isAtTop = true; replayInk(); }
  });
})();
