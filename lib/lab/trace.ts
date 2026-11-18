export type TraceFrame = { line: number; note: string; variables: Record<string, unknown>; stack: string[]; output: string[] };
export type TraceDemo = "sum" | "calls" | "factorial";
export type ProgramTrace = { code: string; frames: TraceFrame[]; result: number };

/** Executes the three supported algorithms and snapshots their actual state.
 * This is deliberately not an arbitrary-JavaScript interpreter. */
export function buildTrace(demo: TraceDemo, input: number[] | number): ProgramTrace {
  const frames: TraceFrame[] = [];
  const output: string[] = [];
  const push = (line: number, note: string, variables: Record<string, unknown>, stack: string[]) => {
    frames.push(JSON.parse(JSON.stringify({ line, note, variables, stack, output })) as TraceFrame);
  };
  if (demo === "factorial") {
    if (typeof input !== "number" || !Number.isInteger(input) || input < 0 || input > 8) throw new Error("Choose a whole number from 0 to 8.");
    const stack = ["main"];
    const factorial = (n: number): number => {
      stack.push(`factorial(${n})`);
      push(1, `Enter factorial with n = ${n}.`, { n }, stack);
      push(2, n <= 1 ? "Base case: return 1." : "The base case is false; recurse.", { n }, stack);
      if (n <= 1) { stack.pop(); return 1; }
      push(3, `Pause this call while factorial(${n - 1}) runs.`, { n }, stack);
      const previous = factorial(n - 1);
      push(3, "The recursive call returned. Resume this frame.", { n, previous }, stack);
      const result = n * previous;
      push(4, `Return ${n} × ${previous} = ${result}.`, { n, previous, result }, stack);
      stack.pop();
      return result;
    };
    push(6, "Call factorial from main.", {}, stack);
    const result = factorial(input);
    push(6, "Store the returned result in main.", { result }, stack);
    output.push(String(result));
    push(7, "Write the result to the console.", { result }, stack);
    return { code: `function factorial(n) {\n  if (n <= 1) return 1;\n  const previous = factorial(n - 1);\n  return n * previous;\n}\nconst result = factorial(${input});\nconsole.log(result);`, frames, result };
  }
  if (!Array.isArray(input) || input.length > 12 || input.some((n) => !Number.isFinite(n) || Math.abs(n) > 1000)) throw new Error("Use a JSON array of up to 12 finite numbers between -1000 and 1000.");
  let total = 0;
  if (demo === "sum") {
    const variables: Record<string, unknown> = { values: [...input] };
    push(1, "Enter sumPositive.", variables, ["main", "sumPositive"]);
    variables.total = total;
    push(2, "Initialize the running total.", variables, ["main", "sumPositive"]);
    for (let i = 0; i <= input.length; i++) {
      variables.i = i;
      push(3, i < input.length ? "Loop condition is true." : "Loop condition is false; leave the loop.", variables, ["main", "sumPositive"]);
      if (i === input.length) break;
      push(4, `Is ${input[i]} greater than 0? ${input[i] > 0 ? "Yes" : "No"}.`, variables, ["main", "sumPositive"]);
      if (input[i] > 0) {
        total += input[i]; variables.total = total;
        push(5, "Add the positive value to total.", variables, ["main", "sumPositive"]);
      }
    }
    push(8, "Return the accumulated total.", variables, ["main", "sumPositive"]);
    output.push(String(total));
    push(10, "Write the returned value to the console.", { result: total }, ["main"]);
    return { code: `function sumPositive(values) {\n  let total = 0;\n  for (let i = 0; i < values.length; i++) {\n    if (values[i] > 0) {\n      total += values[i];\n    }\n  }\n  return total;\n}\nconsole.log(sumPositive(${JSON.stringify(input)}));`, frames, result: total };
  }
  const vars: Record<string, unknown> = { values: [...input], total };
  push(5, "Enter doubleAndSum.", vars, ["main", "doubleAndSum"]);
  push(6, "Initialize total.", vars, ["main", "doubleAndSum"]);
  for (const value of input) {
    vars.value = value;
    push(7, "Take the next value from the array.", vars, ["main", "doubleAndSum"]);
    push(8, "Call double and pause the caller.", vars, ["main", "doubleAndSum"]);
    push(1, "Enter double with its own local x.", { x: value }, ["main", "doubleAndSum", `double(${value})`]);
    const doubled = value * 2;
    push(2, `Return ${doubled} to the caller.`, { x: value, returnValue: doubled }, ["main", "doubleAndSum", `double(${value})`]);
    vars.doubled = doubled;
    push(8, "Resume the caller and store doubled.", vars, ["main", "doubleAndSum"]);
    total += doubled; vars.total = total;
    push(9, "Accumulate the returned value.", vars, ["main", "doubleAndSum"]);
  }
  push(11, "Return total.", vars, ["main", "doubleAndSum"]);
  output.push(String(total));
  push(13, "Write the result to the console.", { result: total }, ["main"]);
  return { code: `function double(x) {\n  return x * 2;\n}\n\nfunction doubleAndSum(values) {\n  let total = 0;\n  for (const value of values) {\n    const doubled = double(value);\n    total += doubled;\n  }\n  return total;\n}\nconsole.log(doubleAndSum(${JSON.stringify(input)}));`, frames, result: total };
}
