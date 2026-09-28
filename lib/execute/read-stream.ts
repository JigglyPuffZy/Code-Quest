import type { GradeProgress, GradeStreamEvent } from "@/lib/execute/grade-progress";
import type { GradeResponse } from "@/lib/types";

export async function readGradeStream(
  response: Response,
  onProgress?: (progress: GradeProgress) => void,
): Promise<GradeResponse> {
  if (!response.body) {
    throw new Error("The sandbox could not stream grading progress.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: GradeResponse | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as GradeStreamEvent;
      if (event.type === "progress") {
        onProgress?.({
          percent: event.percent,
          label: event.label,
          phase: event.phase,
          completedTests: event.completedTests,
          totalTests: event.totalTests,
        });
      } else if (event.type === "result") {
        result = event.data;
      } else if (event.type === "error") {
        throw new Error(event.message);
      }
    }
  }

  if (buffer.trim()) {
    const event = JSON.parse(buffer) as GradeStreamEvent;
    if (event.type === "progress") {
      onProgress?.({
        percent: event.percent,
        label: event.label,
        phase: event.phase,
        completedTests: event.completedTests,
        totalTests: event.totalTests,
      });
    } else if (event.type === "result") {
      result = event.data;
    } else if (event.type === "error") {
      throw new Error(event.message);
    }
  }

  if (!result) {
    throw new Error("The sandbox did not return a grade.");
  }

  return result;
}
