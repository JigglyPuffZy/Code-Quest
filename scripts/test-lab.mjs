import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
const nativeRequire = createRequire(import.meta.url);
const memory = new Map();
globalThis.window = { localStorage: { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) }, dispatchEvent() {} };
globalThis.CustomEvent = class { constructor(type) { this.type = type; } };
const cache = new Map();
function load(name, parent = process.cwd()) {
  if (!name.startsWith('@/') && !name.startsWith('.')) return nativeRequire(name);
  let base = name.startsWith('@/') ? path.resolve(name.slice(2)) : path.resolve(parent, name);
  const file = [base, base + '.ts', base + '.json', path.join(base, 'index.ts')].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
  if (!file) throw new Error('Missing test module: ' + base);
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} }; cache.set(file, loaded);
  if (file.endsWith('sandbox.ts')) {
    loaded.exports.runInSandbox = async (language, program) => {
      assert.equal(language, 'javascript');
      const lines = [];
      try {
        // Only the fixed reference fixtures below execute in this test runner.
        vm.runInNewContext(program, { console: { log: value => lines.push(String(value)) }, performance }, { timeout: 1000 });
        return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
      } catch (error) { return { stdout: lines.join('\n'), stderr: String(error), exitCode: 1 }; }
    };
    return loaded.exports;
  }
  if (file.endsWith('.json')) { loaded.exports = JSON.parse(fs.readFileSync(file, 'utf8')); return loaded.exports; }
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  new Function('require', 'module', 'exports', code)(name => load(name, path.dirname(file)), loaded, loaded.exports);
  return loaded.exports;
}
const { labMissions, getLabMission, explanationPasses } = load('@/lib/lab/missions');
const { gradeExercise } = load('@/lib/execute/grade');
const add = `function addTask(tasks,title){ title=title.trim(); if(!title)return [...tasks];return [...tasks,{id:Math.max(0,...tasks.map(t=>t.id))+1,title,completed:false}]; }`;
const toggle = `function toggleTask(tasks,id){return tasks.map(t=>t.id===id?{...t,completed:!t.completed}:{...t});}`;
const reducer = `${add}\n${toggle}\nfunction taskReducer(tasks,action){if(action.type==='add')return addTask(tasks,action.title);if(action.type==='toggle')return toggleTask(tasks,action.id);if(action.type==='clearCompleted')return tasks.filter(t=>!t.completed);return [...tasks];}`;
const fixes = {
  'lab-sum': 'function cartTotal(prices){return prices.reduce((sum,value)=>sum+value,0);}',
  'lab-count': 'function countMatches(items,target){return items.filter(item=>item===target).length;}',
  'lab-largest': 'function largest(scores){return scores.length?Math.max(...scores):null;}',
  'lab-unique': 'function uniqueNames(names){return [...new Set(names)];}',
  'lab-discount': 'function discountedPrice(price,percent){return price*(1-percent/100);}',
  'lab-greet': "function greet(name){return 'Hello, '+(name.trim()||'friend')+'!';}",
  'lab-project-add': add,
  'lab-project-toggle': `${add}\n${toggle}`,
  'lab-project-reducer': reducer,
};
assert.equal(new Set(labMissions.map(m=>m.id)).size, labMissions.length);
for (const mission of labMissions) {
  const broken = await gradeExercise('challenge', mission.id, mission.exercise.starterCode);
  assert.equal(broken.passed, false, mission.id + ' starter must fail');
  const fixed = await gradeExercise('challenge', mission.id, fixes[mission.id]);
  assert.equal(fixed.passed, true, mission.id + ': ' + JSON.stringify(fixed.tests));
  assert.equal(explanationPasses(mission, mission.checks.map(c=>c.correct), 'I traced the edge cases and fixed the incorrect state transition.'), true);
  assert.equal(explanationPasses(mission, [], 'A long reflection cannot replace answering the concept questions.'), false);
  assert.equal(explanationPasses(mission, mission.checks.map(c=>c.correct), 'short'), false);
}
const { buildTrace } = load('@/lib/lab/trace');
for (const [demo, inputs] of [['sum', [[], [1], [3,-2,5], [-3,-1], [0,0]]], ['calls',[[], [3,-2,5], [1]]], ['factorial',[0,1,4,8]]]) {
  for (const input of inputs) {
    const trace = buildTrace(demo, input);
    const output = [];
    vm.runInNewContext(trace.code, { console: { log: value => output.push(String(value)) } }, { timeout: 1000 });
    assert.equal(String(trace.result), output.at(-1));
    assert.deepEqual(trace.frames.at(-1).output, output);
    assert.deepEqual(trace.frames[0].output, [], 'earlier console snapshots are immutable');
    assert.ok(trace.frames.every(frame=>frame.line>=1 && frame.line<=trace.code.split('\n').length));
  }
}
assert.throws(()=>buildTrace('factorial', 9));
assert.throws(()=>buildTrace('sum', [Infinity]));
assert.throws(()=>buildTrace('sum', Array(13).fill(1)));
const progress = load('@/lib/lab/progress');
const fresh = progress.readLabProgress('player-a');
assert.equal(progress.planBoss(fresh, ['loops'])[0].topic, 'loops');
const passed = await gradeExercise('challenge', 'lab-sum', fixes['lab-sum']);
progress.storeLabEvidence('player-a', { missionId:'lab-sum', code:fixes['lab-sum'], tests:passed.tests, reflection:'I included the last array index and checked the empty cart.', answers:getLabMission('lab-sum').checks.map(c=>c.correct), at:new Date().toISOString() });
assert.equal(progress.topicStrength(progress.readLabProgress('player-a'), 'loops'), 1);
assert.equal(Object.keys(progress.readLabProgress('player-b').evidence).length, 0, 'accounts stay separate');
const { buildPortfolioHtml, escapeHtml, buildTaskDemo } = load('@/lib/lab/portfolio');
assert.equal(escapeHtml('<script>'), '&lt;script&gt;');
const html = buildPortfolioHtml({author:'<img src=x onerror=alert(1)>',title:'<script>alert(1)</script>',entries:Object.values(progress.readLabProgress('player-a').evidence),includeCode:false,exportedAt:'2026-11-12'});
assert.ok(!html.includes('<img src=x'));
assert.ok(!html.includes('<script>alert(1)'));
assert.ok(!html.includes(fixes['lab-sum']), 'source must be opt-in');
assert.ok(buildTaskDemo('</script><script>evil()</script>').includes('\\u003c/script>'), 'worker source cannot close the HTML script');
const { coopRole } = load('@/lib/lab/coop');
const room = {creator_id:'a',partner_id:'b',driver_id:'a'};
assert.equal(coopRole(room,'a'),'driver');assert.equal(coopRole(room,'b'),'reviewer');assert.equal(coopRole(room,'c'),'outside');
console.log('Passed: all 9 mission starter/fix grading pairs, explanation gates, 13 execution traces, input limits, adaptive ranking, account isolation, export escaping, opt-in source, and co-op roles.');

if (process.env.LAB_PREVIEW_PATH) {
  const evidence = {missionId:'lab-project-reducer',code:reducer,tests:(await gradeExercise('challenge','lab-project-reducer',reducer)).tests,reflection:'I combined immutable task updates with explicit action dispatch and tested unknown actions.',answers:getLabMission('lab-project-reducer').checks.map(c=>c.correct),at:new Date().toISOString()};
  fs.writeFileSync(process.env.LAB_PREVIEW_PATH, buildPortfolioHtml({author:'Demo learner',title:'Developer lab preview',entries:[evidence],includeCode:true,exportedAt:new Date().toISOString()}));
}
