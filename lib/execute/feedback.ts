/** Suggestions describe symptoms rather than guessing at the source code. */
export function testFeedback(actual: string, expected: string, performance = false) {
  if (performance) return "Check for repeated work inside loops. Compare your approach with the required complexity.";
  if (!actual.trim()) return "No output was received. Check that your function returns a value, or your program prints the requested output.";
  if (/syntaxerror|indentationerror|referenceerror|typeerror|exception|traceback/i.test(actual)) return "Start with the first error message. Check the referenced name, value type, and line.";
  if (actual.trim() === expected.trim()) return "Check spaces, indentation, and extra newlines against the expected output.";
  try {
    const got: unknown = JSON.parse(actual);
    const wanted: unknown = JSON.parse(expected);
    if (typeof got !== typeof wanted) return "Check the return type: a number, a string, and a boolean are different values.";
    if (Array.isArray(got) && Array.isArray(wanted)) return "Compare array length, element order, and each value. Check empty input and the first and last elements.";
  } catch { /* Plain text is also valid output. */ }
  return "Trace the example input through your code. Compare where your result first differs; check boundary conditions and return statements.";
}
