import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../lib/execute/read-stream.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.ESNext } }).outputText;
const { readGradeStream } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const grade = { passed: true, tests: [] };
const encoder = new TextEncoder();
const event = JSON.stringify({ type: 'result', data: grade });
const progress = JSON.stringify({ type: 'progress', percent: 50, label: 'Checking', phase: 'visible' });
const updates = [];
const response = new Response(new ReadableStream({
  start(controller) {
    const bytes = encoder.encode(`${progress}\n${event}`);
    for (let i = 0; i < bytes.length; i += 3) controller.enqueue(bytes.slice(i, i + 3));
    controller.close();
  },
}));
assert.deepEqual(await readGradeStream(response, (value) => updates.push(value)), grade);
assert.equal(updates[0].percent, 50);
assert.equal(response.body.locked, false);
await assert.rejects(readGradeStream(new Response('')), /did not return a grade/);
let cancelled = false;
const broken = new Response(new ReadableStream({
  start(controller) { controller.enqueue(encoder.encode('{invalid}\n')); },
  cancel() { cancelled = true; },
}));
await assert.rejects(readGradeStream(broken), SyntaxError);
assert.equal(cancelled, true);
assert.equal(broken.body.locked, false);
await assert.rejects(readGradeStream(new Response(JSON.stringify({ type: 'error', message: 'Sandbox unavailable' }) + '\n')), /Sandbox unavailable/);
console.log('Passed: fragmented events, trailing result, progress, missing grade, malformed stream cleanup, and server errors.');
