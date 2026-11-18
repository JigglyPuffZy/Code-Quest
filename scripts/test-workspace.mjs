import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const nativeRequire = createRequire(import.meta.url);
const cache = new Map();
function load(name, parent = process.cwd()) {
  if (!name.startsWith('@/') && !name.startsWith('.')) return nativeRequire(name);
  const base = name.startsWith('@/') ? path.resolve(name.slice(2)) : path.resolve(parent, name);
  const file = [base, `${base}.ts`, `${base}.json`, path.join(base, 'index.ts')].find((item) => fs.existsSync(item) && fs.statSync(item).isFile());
  if (!file) throw new Error(`Missing test dependency: ${base}`);
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} }; cache.set(file, loaded);
  if (file.endsWith('.json')) { loaded.exports = JSON.parse(fs.readFileSync(file, 'utf8')); return loaded.exports; }
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  new Function('require', 'module', 'exports', code)((dependency) => load(dependency, path.dirname(file)), loaded, loaded.exports);
  return loaded.exports;
}

const { PAGE_MANUALS, getPageManual, searchManuals } = load('@/lib/help/pages');
const root = path.resolve('app/(play)');
const pages = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filename = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(filename);
    else if (entry.name === 'page.tsx') pages.push(filename);
  }
}
walk(root);
for (const filename of pages) {
  const route = '/' + path.relative(root, path.dirname(filename)).split(path.sep).join('/')
    .replace('[topic]', 'python').replace('[slug]', 'introduction').replace('[challengeId]', 'js-sum')
    .replace('[track]', 'core').replace('[level]', '1').replace('[id]', 'lab-sum');
  assert.notEqual(getPageManual(route).id, 'workspace', `Missing page guide for ${route}`);
}
assert.equal(new Set(PAGE_MANUALS.map((manual) => manual.id)).size, PAGE_MANUALS.length);
for (const manual of PAGE_MANUALS) {
  assert.ok(manual.steps.length >= 3, manual.id);
  assert.ok(fs.existsSync(path.join(root, manual.href, 'page.tsx')), `${manual.id} has a broken related-page link`);
}
assert.equal(getPageManual('/guides/catalog/python').id, 'catalog-entry');
assert.equal(getPageManual('/guides/python/functions?question=1#practice').id, 'guide-lesson');
assert.equal(getPageManual('/game/core/1').id, 'game-level');
assert.equal(getPageManual('/lab/mission/lab-sum').id, 'lab-mission');
assert.ok(searchManuals('backup').some((manual) => manual.id === 'learning'));
assert.ok(searchManuals('CO-OP').some((manual) => manual.id === 'coop'));
assert.equal(searchManuals('no-such-task-xyz-123').length, 0);

let reads = 0;
const memory = new Map();
globalThis.window = { localStorage: { getItem: (key) => { reads++; return memory.get(key) ?? null; }, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) }, dispatchEvent() {} };
globalThis.CustomEvent = class { constructor(type) { this.type = type; } };
const guides = load('@/lib/guides/index');
for (const item of guides.allGuides) {
  assert.equal(guides.getGuide(item.topicId, item.slug), guides.allGuides.find((candidate) => candidate.topicId === item.topicId && candidate.slug === item.slug));
}
const pythonBefore = guides.guidesForTopic('python').map((guide) => guide.slug);
guides.guidesForTopic('python').reverse();
assert.deepEqual(guides.guidesForTopic('python').map((guide) => guide.slug), pythonBefore, 'callers cannot reorder the cached outline');
const progress = load('@/lib/guides/progress');
memory.set('devladder.guide-progress', JSON.stringify({ read: { python: null, javascript: ['introduction', 7, 'introduction'] }, practiced: [], passedByLesson: { lesson: [0, -1, 'bad', 2] } }));
const cleaned = progress.exportGuideProgress();
assert.deepEqual(cleaned.read, { javascript: ['introduction'] });
assert.deepEqual(cleaned.practiced, {});
assert.deepEqual(cleaned.passedByLesson, { lesson: [0, 2] });
const read = {};
for (const guide of guides.allGuides) (read[guide.topicId] ??= []).push(guide.slug);
memory.set('devladder.guide-progress', JSON.stringify({ read, practiced: {}, passedByLesson: {} }));
reads = 0;
const next = load('@/lib/guides/navigation').continueGuide();
assert.ok(next);
assert.ok(reads <= 3, `Continue guide performed ${reads} storage reads instead of a bounded snapshot`);
const { NAV_ITEMS } = load('@/components/shell/nav');
assert.equal(NAV_ITEMS.filter((item) => item.mobile).length, 5);
assert.equal(new Set(NAV_ITEMS.map((item) => item.href)).size, NAV_ITEMS.length);
console.log(`Passed: tutorial coverage for all ${pages.length} workspace route templates, manual search and links, indexed guide behavior, corrupt-progress recovery, bounded storage reads (${reads}), and five-item mobile navigation.`);

// The workspace restyle (v2) may change colors, but its scoped light and dark palettes must still
// define every color token the app relies on, so no page loses a variable.
const originalCss = fs.readFileSync('app/globals.css', 'utf8');
const workspaceCss = fs.readFileSync('app/(play)/workspace.css', 'utf8');
function palette(css, selector) {
  const start = css.indexOf(selector + ' {');
  assert.ok(start >= 0, selector);
  const block = css.slice(start, css.indexOf('}', start));
  return new Map([...block.matchAll(/(--dl-[\w-]+):\s*(#[0-9a-f]+);/gi)].map((match) => [match[1], match[2].toLowerCase()]));
}
const REQUIRED = ['--dl-canvas', '--dl-surface', '--dl-surface-2', '--dl-surface-3', '--dl-ink', '--dl-muted', '--dl-line', '--dl-primary', '--dl-primary-hover', '--dl-primary-foreground', '--dl-primary-50', '--dl-primary-100', '--dl-primary-200', '--dl-primary-300', '--dl-primary-400', '--dl-primary-500', '--dl-primary-600', '--dl-primary-700', '--dl-primary-800', '--dl-primary-900'];
for (const [original, scoped] of [[':root', '.workspace'], ['html.dark', 'html.dark .workspace']]) {
  const expected = palette(originalCss, original);
  const actual = palette(workspaceCss, scoped);
  for (const name of REQUIRED) {
    assert.ok(expected.has(name), `${original} should still define ${name} for auth pages`);
    assert.ok(actual.has(name), `${scoped} must define ${name}`);
  }
}
console.log('Passed: workspace light and dark palettes define every required token.');

const { catalogSections } = load('@/lib/guides/catalog');
const { catalogPage } = load('@/lib/guides/catalog/pagination');
const originalEntries = catalogSections.flatMap((section) => section.entries.map((entry) => `${section.id}/${entry.slug}`));
const pagedEntries = [];
for (let page = 0; page < Math.ceil(originalEntries.length / 60); page++) {
  const sections = catalogPage(catalogSections, page);
  const rows = sections.flatMap((section) => section.entries.map((entry) => `${section.id}/${entry.slug}`));
  assert.ok(rows.length <= 60);
  pagedEntries.push(...rows);
}
assert.deepEqual(pagedEntries, originalEntries, 'catalog paging must preserve every entry exactly in order');
const first = catalogPage(catalogSections, 0);
first[0].entries.pop();
assert.equal(catalogSections.flatMap((section) => section.entries).length, originalEntries.length, 'paging must not mutate source sections');
assert.deepEqual(catalogPage(catalogSections, -1), []);
assert.deepEqual(catalogPage(catalogSections, 999), []);
assert.deepEqual(catalogPage([], 0), []);
console.log(`Passed: bounded catalog pagination preserves all ${originalEntries.length} rows without mutating the catalog.`);

assert.equal(new Set(catalogSections.map((section) => section.id)).size, catalogSections.length, 'catalog section anchors must be unique');
const catalog = load('@/lib/guides/catalog');
assert.equal(catalog.getCatalogEntry('mongodb').part, 'databases');
assert.equal(catalog.getCatalogEntry('mongodb').kind, 'Database');
assert.ok(catalog.sectionsByPart('databases').length > 0);
assert.ok(catalog.sectionsByPart('languages').length > 0);
console.log('Passed: database filters, MongoDB classification, and unique section anchors.');
