/** Helpers for large hidden performance test inputs (generated at load time). */

export function repeatChar(char: string, count: number) {
  return char.repeat(count);
}

export function rangeArray(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}
