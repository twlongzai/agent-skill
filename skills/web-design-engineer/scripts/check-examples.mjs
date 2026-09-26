#!/usr/bin/env node
// Deterministic checks for executable examples, with no network or browser dependency.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../references/advanced-patterns.md', import.meta.url), 'utf8');
const timeline = source.match(/const useTime = \(duration = 5000\) => \{[\s\S]*?\n\};/)[0];
const slideCode = source.match(/<script>\n([\s\S]*?)<\/script>/)[1];
let checks = 0;
const check = (name, fn) => { fn(); checks++; console.log(`PASS ${name}`); };

function mountTimeline(duration = 5000) {
  let cells = [], cursor = 0, previousDependencies, pendingEffect, cleanup;
  let sequence = 0, frames = new Map(), result;
  const context = { React: {
    useState(initial) { const i = cursor++; if (!(i in cells)) cells[i] = initial; return [cells[i], value => cells[i] = typeof value === 'function' ? value(cells[i]) : value]; },
    useRef(initial) { const i = cursor++; if (!(i in cells)) cells[i] = {current: initial}; return cells[i]; },
    useCallback(fn) { return fn; },
    useEffect(fn, deps) { if (!previousDependencies || deps.some((v, i) => v !== previousDependencies[i])) { pendingEffect = fn; previousDependencies = deps; } },
  }, requestAnimationFrame(fn) { frames.set(++sequence, fn); return sequence; }, cancelAnimationFrame(id) { frames.delete(id); } };
  vm.createContext(context);
  vm.runInContext(timeline + '\nglobalThis.useTime = useTime;', context);
  const render = () => { cursor = 0; result = context.useTime(duration); if (pendingEffect) { cleanup?.(); cleanup = pendingEffect(); pendingEffect = undefined; } return result; };
  render();
  return {
    frame(timestamp) { const current = [...frames.values()]; frames.clear(); current.forEach(fn => fn(timestamp)); return render(); },
    play(value) { result.setPlaying(value); return render(); },
    seek(value) { result.seek(value); return render(); },
    duration(value) { duration = value; return render(); },
    unmount() { cleanup?.(); },
    get queued() { return frames.size; },
  };
}
const clock = mountTimeline();
check('timeline counts from timestamp zero', () => { clock.frame(0); assert.equal(clock.frame(1000).time, 0.2); });
check('pause cancels queued animation', () => { clock.play(false); assert.equal(clock.queued, 0); });
check('resume excludes paused interval', () => { clock.play(true); assert.equal(clock.frame(9000).time, 0.2); assert.ok(Math.abs(clock.frame(10000).time - 0.4) < 1e-10); });
check('seek works while paused', () => { clock.play(false); assert.equal(clock.seek(0.75).time, 0.75); });
check('seek clamps and ignores non-finite input', () => { assert.equal(clock.seek(2).time, 1); assert.equal(clock.seek(-1).time, 0); assert.equal(clock.seek(NaN).time, 0); });
check('seek while playing resets elapsed baseline', () => { clock.play(true); clock.frame(11000); clock.seek(0.5); assert.equal(clock.frame(18000).time, 0.5); });
check('duration change preserves normalized progress', () => { clock.duration(1000); assert.equal(clock.frame(19000).time, 0.5); assert.equal(clock.frame(19250).time, 0.75); });
check('timeline loops at endpoint', () => { assert.equal(clock.frame(19500).time, 0); });
check('unmount cancels remaining animation', () => { clock.unmount(); assert.equal(clock.queued, 0); });
check('invalid durations are rejected', () => { for (const value of [0, -1, NaN, Infinity]) assert.throws(() => mountTimeline(value), {name: 'RangeError'}); });

function mountDeck(saved = '0', count = 3, blockedStorage = false) {
  const slides = Array.from({length: count}, () => ({active: false, classList: {toggle(_, value) { this.active = value; }}}));
  const counter = {textContent: ''};
  const stage = {style: {}, dataset: {deckId: 'test-deck'}};
  const events = {}, buttons = {};
  const context = {window: {innerWidth: 960, innerHeight: 540, location: {pathname: '/deck.html'}, addEventListener() {}},
    document: {querySelector(selector) { if (selector === '.stage') return stage; if (selector === '.slide-counter') return counter; return {addEventListener(_, fn) { buttons[selector] = fn; }}; }, querySelectorAll() { return slides; }, addEventListener(type, fn) { events[type] = fn; }},
    localStorage: {getItem() { if (blockedStorage) throw Error('denied'); return saved; }, setItem(key, value) { if (blockedStorage) throw Error('denied'); assert.equal(key, 'slideIndex:test-deck'); saved = value; }}};
  vm.createContext(context); vm.runInContext(slideCode, context);
  return {counter, slides, stage, buttons, key(key, editing = false) { let prevented = false; events.keydown({key, target: {closest() { return editing ? {} : null; }}, preventDefault() { prevented = true; }}); return prevented; }};
}
check('malformed saved index recovers to first slide', () => { const d = mountDeck('invalid'); assert.equal(d.counter.textContent, '1 / 3'); assert.equal(d.slides.filter(s => s.classList.active).length, 1); });
check('out-of-range saved index clamps', () => { assert.equal(mountDeck('99').counter.textContent, '3 / 3'); assert.equal(mountDeck('-1').counter.textContent, '1 / 3'); });
check('storage denial does not block navigation', () => { const d = mountDeck('2', 3, true); assert.equal(d.key('ArrowRight'), true); assert.equal(d.counter.textContent, '2 / 3'); });
check('typing in an interactive element does not navigate', () => { const d = mountDeck(); assert.equal(d.key(' ', true), false); assert.equal(d.counter.textContent, '1 / 3'); });
check('buttons navigate and empty deck remains valid', () => { const d = mountDeck(); d.buttons['[data-slide-next]'](); assert.equal(d.counter.textContent, '2 / 3'); d.buttons['[data-slide-prev]'](); assert.equal(d.counter.textContent, '1 / 3'); assert.equal(mountDeck('0', 0).counter.textContent, '0 / 0'); });
console.log(`${checks} behavioral checks passed. React rendering, CSS layout, and accessibility still require browser verification.`);
