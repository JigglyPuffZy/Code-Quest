import type { LanguageId } from "@/lib/types";

const WANDBOX_URL = "https://wandbox.org/api/compile.json";

const COMPILERS: Record<LanguageId, string> = {
  python: "cpython-3.12.7",
  javascript: "nodejs-20.17.0",
  typescript: "typescript-5.5.2",
  java: "openjdk-17.0.2",
};

type WandboxResponse = {
  status?: string;
  program_output?: string;
  program_error?: string;
  compiler_error?: string;
  compiler_message?: string;
};

export type SandboxRun = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
};

export async function runInSandbox(
  language: LanguageId,
  code: string,
  stdin = "",
): Promise<SandboxRun> {
  const response = await fetch(WANDBOX_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(20_000),
    body: JSON.stringify({
      compiler: COMPILERS[language],
      code,
      stdin,
    }),
  });

  if (!response.ok) {
    throw new Error(`The code sandbox returned ${response.status}.`);
  }

  const data = (await response.json()) as WandboxResponse;
  const stderr = [data.compiler_error, data.program_error, data.compiler_message]
    .filter((part) => part && part.trim() && part.trim() !== (data.program_output ?? "").trim())
    .join("\n")
    .trim();
  const parsed = data.status === undefined || data.status === "" ? null : Number(data.status);

  return {
    stdout: data.program_output ?? "",
    stderr,
    exitCode: parsed === null || Number.isNaN(parsed) ? null : parsed,
  };
}
