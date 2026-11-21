/* Auto follows the browser colour scheme; explicit choices remain authoritative. */
(() => {
  'use strict';
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll('[data-appearance-choice]')];
  const status = document.querySelector('#appearance-context');
  const browserScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const key = 'aditusan-appearance';
  const valid = ['auto', 'day', 'night'];
  let selection = 'auto';
  try { selection = localStorage.getItem(key) || 'auto'; } catch { /* Optional storage. */ }
  if (!valid.includes(selection)) selection = 'auto';

  function applyAppearance() {
    const appearance = selection === 'auto' ? (browserScheme.matches ? 'night' : 'day') : selection;
    root.dataset.appearance = appearance;
    root.dataset.appearanceChoice = selection;
    root.style.colorScheme = appearance === 'night' ? 'dark' : 'light';
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.appearanceChoice === selection)));
    if (status) status.textContent = `${appearance === 'night' ? 'Night' : 'Day'} mode${selection === 'auto' ? ', following the browser light or dark setting' : ', manually selected'}.`;
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = appearance === 'night' ? '#14242e' : '#243f43';
    window.dispatchEvent(new CustomEvent('aditusan:appearancechange', { detail: { appearance, selection } }));
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    selection = button.dataset.appearanceChoice;
    try { localStorage.setItem(key, selection); } catch { /* Keep the choice for this visit. */ }
    applyAppearance();
  }));
  browserScheme.addEventListener('change', () => { if (selection === 'auto') applyAppearance(); });
  window.addEventListener('pageshow', applyAppearance);
  applyAppearance();
})();
