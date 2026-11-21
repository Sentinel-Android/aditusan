import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../dist/appearance.js', import.meta.url), 'utf8');
function page({ saved = null, dark = false, storageBlocked = false } = {}) {
  const root = { dataset: {}, style: {} };
  const controls = ['auto', 'day', 'night'].map(choice => ({
    dataset: { appearanceChoice: choice }, attrs: {},
    setAttribute(key, value) { this.attrs[key] = value; },
    addEventListener(name, handler) { this[name] = handler; }
  }));
  const scheme = { matches: dark, addEventListener(name, handler) { this[name] = handler; } };
  const status = {};
  const events = [];
  vm.runInNewContext(source, {
    document: { documentElement: root, querySelectorAll: () => controls,
      querySelector: selector => selector === '#appearance-context' ? status : {} },
    window: { matchMedia: () => scheme, dispatchEvent: event => events.push(event), addEventListener() {} },
    localStorage: { getItem() { if (storageBlocked) throw Error('Blocked'); return saved; },
      setItem(key, value) { if (storageBlocked) throw Error('Blocked'); saved = value; } },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } }
  });
  return { root, controls, events, status,
    click(choice) { controls.find(control => control.dataset.appearanceChoice === choice).click(); },
    setDark(value) { scheme.matches = value; scheme.change(); }
  };
}

const auto = page({ dark: true });
assert.equal(auto.root.dataset.appearance, 'night');
assert.equal(auto.root.dataset.appearanceChoice, 'auto');
auto.setDark(false);
assert.equal(auto.root.dataset.appearance, 'day');
auto.click('night');
auto.setDark(true); auto.setDark(false);
assert.equal(auto.root.dataset.appearance, 'night', 'A manual choice must survive browser scheme changes.');
auto.click('day'); auto.setDark(true);
assert.equal(auto.root.dataset.appearance, 'day');
auto.click('auto');
assert.equal(auto.root.dataset.appearance, 'night', 'Auto must immediately return to the current browser scheme.');
auto.setDark(false);
assert.equal(auto.root.dataset.appearance, 'day');
assert.equal(auto.controls.filter(control => control.attrs['aria-pressed'] === 'true').length, 1);
assert.match(auto.status.textContent, /following the browser/);
assert.equal(auto.events.at(-1).detail.appearance, 'day');
assert.equal(page({ saved: 'day', dark: true }).root.dataset.appearance, 'day');
assert.equal(page({ saved: 'invalid', dark: true }).root.dataset.appearanceChoice, 'auto');
const blocked = page({ dark: true, storageBlocked: true });
blocked.click('day');
assert.equal(blocked.root.dataset.appearance, 'day');
console.log('Appearance behavior verified: browser Auto, live changes, manual overrides, saved choices, and blocked storage.');
