"use client";
import { labButton, labInput, labPanel } from "@/components/lab/LabShell";
import { buildTrace, type TraceDemo } from "@/lib/lab/trace";
import { useEffect, useMemo, useState } from "react";

export function TimeMachine() {
  const [demo, setDemo] = useState<TraceDemo>("sum");
  const [input, setInput] = useState("[3, -2, 5]");
  const [applied, setApplied] = useState<{ demo: TraceDemo; input: number[] | number }>({ demo: "sum", input: [3, -2, 5] });
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const trace = useMemo(() => buildTrace(applied.demo, applied.input), [applied]);
  const frame = trace.frames[step];
  const finished = step >= trace.frames.length - 1;
  useEffect(() => {
    if (!playing || finished) return;
    const timer = window.setInterval(() => setStep((index) => Math.min(index + 1, trace.frames.length - 1)), 800);
    return () => window.clearInterval(timer);
  }, [playing, finished, trace.frames.length]);
  function apply() {
    try {
      const value: unknown = JSON.parse(input);
      if (typeof value !== "number" && !Array.isArray(value)) throw new Error("Enter a JSON array, or a number for factorial.");
      buildTrace(demo, value as number[] | number);
      setApplied({ demo, input: value as number[] | number }); setStep(0); setPlaying(false); setError("");
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Check your input."); }
  }
  return <div className="space-y-5"><section className={labPanel}><h2 className="text-2xl font-bold">Code Time Machine</h2><p className="mt-3 text-sm leading-6 text-muted">Explore three supported JavaScript programs with editable inputs. Each snapshot records the state of the algorithm at the highlighted line. You can rewind without rerunning code. This viewer does not execute arbitrary pasted JavaScript.</p>
    <div className="mt-5 grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]"><label className="text-sm font-semibold">Program<select className={`${labInput} mt-2`} value={demo} onChange={(event) => { const value = event.target.value as TraceDemo; setDemo(value); setInput(value === "factorial" ? "4" : "[3, -2, 5]"); }}><option value="sum">Loops and conditions</option><option value="calls">Function calls</option><option value="factorial">Recursive call stack</option></select></label><label className="text-sm font-semibold">{demo === "factorial" ? "Whole number (0–8)" : "JSON array (up to 12 numbers)"}<input className={`${labInput} mt-2`} value={input} onChange={(event) => setInput(event.target.value)} /></label><button type="button" className={labButton} onClick={apply}>Load execution</button></div><p role="alert" className="mt-3 text-sm text-danger">{error}</p></section>
    <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]"><section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-slate-100" aria-label="Traced code"><div className="border-b border-slate-800 px-4 py-3 text-xs text-cyan-300">JavaScript · {applied.demo}</div><div className="overflow-x-auto py-3 font-mono text-xs leading-7 sm:text-sm">{trace.code.split("\n").map((line, index) => <div key={index} aria-current={frame.line === index + 1 ? "step" : undefined} className={`flex min-w-max px-4 ${frame.line === index + 1 ? "border-l-2 border-cyan-300 bg-cyan-400/15 text-cyan-100" : "border-l-2 border-transparent"}`}><span className="mr-4 inline-block w-5 select-none text-right text-slate-500">{index + 1}</span><span className="whitespace-pre">{line || " "}</span></div>)}</div></section>
    <div className="space-y-4"><section className={labPanel}><h3 className="font-semibold">Current frame variables</h3><dl className="mt-3 space-y-2 font-mono text-sm">{Object.entries(frame.variables).map(([name, value]) => <div key={name} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3 rounded-lg bg-surface-2 p-2"><dt className="break-words text-primary">{name}</dt><dd className="overflow-x-auto">{JSON.stringify(value)}</dd></div>)}{!Object.keys(frame.variables).length ? <p className="text-xs text-muted">No local variables yet.</p> : null}</dl></section><section className={labPanel}><h3 className="font-semibold">Call stack</h3><ol className="mt-3 space-y-2">{[...frame.stack].reverse().map((call, index) => <li key={`${call}:${index}`} className={`rounded-lg border border-line p-2 font-mono text-sm ${index === 0 ? "text-primary" : "text-muted"}`}>{index === 0 ? "→ " : ""}{call}</li>)}</ol></section><section className={labPanel}><h3 className="font-semibold">Console</h3><pre className="mt-2 whitespace-pre-wrap text-sm">{frame.output.join("\n") || "(no output yet)"}</pre></section></div></div>
    <section className={labPanel}><p aria-live="polite" className="min-h-12 text-sm leading-6">{frame.note}</p><input type="range" min={0} max={trace.frames.length - 1} value={step} aria-label="Execution step" className="mt-3 w-full accent-violet-500" onChange={(event) => { setPlaying(false); setStep(Number(event.target.value)); }} /><div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" className={labButton} disabled={step === 0} onClick={() => { setStep(0); setPlaying(false); }}>Rewind</button><button type="button" className={labButton} disabled={step === 0} onClick={() => { setStep(step - 1); setPlaying(false); }}>Back</button><button type="button" className={labButton} disabled={finished} onClick={() => setPlaying(!playing)}>{playing && !finished ? "Pause" : "Play"}</button><button type="button" className={labButton} disabled={finished} onClick={() => { setStep(step + 1); setPlaying(false); }}>Step forward</button><p className="ml-auto text-xs tabular-nums text-muted">Snapshot {step + 1} / {trace.frames.length}</p></div></section>
  </div>;
}
