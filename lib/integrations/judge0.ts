/**
 * Judge0 integration — sandboxed code execution.
 *
 * STATUS: Stub. Mock mode returns a canned response so the sandbox UI works.
 *
 * To go live: set JUDGE0_API_URL + JUDGE0_API_KEY, and replace `run` with a
 * real fetch to /submissions?wait=true.
 */

const MOCK = !process.env.JUDGE0_API_KEY;

export type RunInput = {
  language: "python" | "javascript" | "shell";
  code: string;
  stdin?: string;
};

export type RunResult = {
  stdout: string;
  stderr: string;
  status: "ok" | "error" | "timeout";
  durationMs: number;
};

const LANGUAGE_IDS: Record<RunInput["language"], number> = {
  python: 71, // Python 3.8.1
  javascript: 63, // Node.js 12
  shell: 46, // Bash 5
};

export const judge0 = {
  isMock: MOCK,

  async run({ language, code, stdin = "" }: RunInput): Promise<RunResult> {
    if (MOCK) {
      // Pretend-execute: return a friendly mock response so the sandbox feels
      // alive in development.
      await new Promise((r) => setTimeout(r, 400));
      return {
        stdout: `[mock-judge0] Executed ${code.split("\n").length} lines of ${language}.\n→ Connect a real Judge0 endpoint to run this code.`,
        stderr: "",
        status: "ok",
        durationMs: 412,
      };
    }

    const url = process.env.JUDGE0_API_URL;
    const key = process.env.JUDGE0_API_KEY;
    const res = await fetch(`${url}/submissions?wait=true`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-key": key!,
      },
      body: JSON.stringify({
        source_code: code,
        language_id: LANGUAGE_IDS[language],
        stdin,
      }),
    });
    const j = await res.json();
    return {
      stdout: j.stdout ?? "",
      stderr: j.stderr ?? j.compile_output ?? "",
      status: j.status?.id === 3 ? "ok" : "error",
      durationMs: Math.round((j.time ?? 0) * 1000),
    };
  },
};
