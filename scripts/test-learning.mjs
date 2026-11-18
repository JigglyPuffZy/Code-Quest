import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const cache = new Map();
const memory = new Map();
const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) };
globalThis.window = { localStorage: storage, dispatchEvent() {} };
globalThis.CustomEvent = class { constructor(type) { this.type = type; } };
function load(name) {
  if (cache.has(name)) return cache.get(name);
  const filename = name.replace(/^@\//, '') + '.ts';
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS } }).outputText;
  const loaded = { exports: {} };
  new Function('require', 'module', 'exports', code)(load, loaded, loaded.exports);
  cache.set(name, loaded.exports);
  return loaded.exports;
}
const clock = Date.now;
let now = Date.parse('2026-11-12T04:00:00Z');
Date.now = () => now;
try {
  const reviews = load('@/lib/learning/mistakes');
  const entry = { topicId: 'python', slug: 'loops', questionIndex: 2, exerciseId: 'loops-2', prompt: 'Count items', language: 'python' };
  reviews.recordPracticeMistake(entry);
  // recordPracticeMistake uses the real ISO clock; set a deterministic due date.
  const key = 'devladder.practice-mistakes';
  let stored = JSON.parse(memory.get(key));
  stored[0].dueAt = new Date(now).toISOString();
  memory.set(key, JSON.stringify(stored));
  reviews.recordReviewPass('python', 'loops', 1);
  assert.equal(reviews.listPracticeMistakes()[0].reviewCount, 0, 'other questions do not clear a review');
  reviews.recordReviewPass('python', 'loops', 2);
  assert.equal(reviews.listPracticeMistakes()[0].reviewCount, 1);
  assert.equal(reviews.reviewDueTime(reviews.listPracticeMistakes()[0]), now + 86400000);
  reviews.recordReviewPass('python', 'loops', 2);
  assert.equal(reviews.listPracticeMistakes()[0].reviewCount, 1, 'early passes cannot skip review intervals');
  now += 86400000;
  reviews.recordReviewPass('python', 'loops', 2);
  assert.equal(reviews.reviewDueTime(reviews.listPracticeMistakes()[0]), now + 3 * 86400000);
  reviews.recordPracticeMistake(entry);
  assert.equal(reviews.listPracticeMistakes().length, 1);
  assert.equal(reviews.listPracticeMistakes()[0].reviewCount, 0, 'new failure resets the interval');
  memory.set(key, '{bad');
  assert.deepEqual(reviews.listPracticeMistakes(), []);
  memory.set(key, '[null,{}]');
  assert.deepEqual(reviews.listPracticeMistakes(), []);
  const log = load('@/lib/learning/practice-log');
  for (let i = 0; i < 2002; i++) log.logGuidePracticePass('python', 'loops', i);
  assert.equal(log.readLog().length, 2000);
  assert.equal(log.readLog()[0].index, 2001, 'newest practice is retained');
  const { testFeedback } = load('@/lib/execute/feedback');
  assert.match(testFeedback('', '5'), /No output/);
  assert.match(testFeedback('"5"', '5'), /return type/);
  assert.match(testFeedback('[1]', '[1,2]'), /array length/);
  assert.match(testFeedback('TypeError: invalid', '5'), /first error/);
  assert.match(testFeedback('slow', 'fast', true), /complexity/);
  assert.match(testFeedback('anything', 'different'), /Trace/);
  console.log('Passed: review scheduling, exact question matching, early-pass protection, reset, corrupt storage, practice retention, and feedback hints.');
} finally { Date.now = clock; }
