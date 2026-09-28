import type { LanguageId } from "@/lib/types";

const WANDBOX_URL = "https://wandbox.org/api/compile.json";

const COMPILERS: Record<LanguageId, string> = {
  python: "cpython-3.12.7",
  javascript: "nodejs-20.17.0",
  typescript: "typescript-5.6.2",
  java: "openjdk-jdk-22+36",
};

/** Wandbox saves single-file Java as prog.java — drop public so class Main still runs. */
function prepareJavaCode(code: string) {
  return code.replace(/\bpublic\s+(?=class\s+\w)/g, "");
}

function buildRequest(language: LanguageId, code: string, stdin: string) {
  return {
    compiler: COMPILERS[language],
    code: language === "java" ? prepareJavaCode(code) : code,
    stdin,
  };
}

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
    body: JSON.stringify(buildRequest(language, code, stdin)),
  });

  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).trim();
    if (detail.includes("Unknown compiler")) {
      throw new Error("This language runtime is temporarily unavailable. Try again shortly.");
    }
    throw new Error(
      detail ? `The code sandbox failed: ${detail}` : `The code sandbox returned ${response.status}.`,
    );
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
