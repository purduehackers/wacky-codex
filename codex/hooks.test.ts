import { afterEach, expect, test } from "bun:test";
import { mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const directories: string[] = [];
async function temporaryHome() {
  const directory = await mkdtemp(join(tmpdir(), "ph-hook-test-"));
  directories.push(directory);
  return directory;
}
afterEach(async () => {
  await Promise.all(
    directories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

async function invoke(directory: string, event: unknown, raw = false) {
  const child = Bun.spawn([process.execPath, "--no-env-file", join(import.meta.dir, "hooks.ts")], {
    env: { ...process.env, CODEX_HOME: directory },
    stdin: new Response(raw ? String(event) : JSON.stringify(event)),
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  expect(code).toBe(0);
  return { stdout, stderr };
}

async function log(directory: string) {
  const path = join(
    directory,
    "purduehackers/audit",
    new Date().toISOString().slice(0, 10) + ".jsonl",
  );
  return { path, text: await Bun.file(path).text() };
}

test("startup, resumed/compacted sessions, and subagents receive the PH tree", async () => {
  const directory = await temporaryHome();
  for (const source of ["startup", "resume", "compact", "fork"]) {
    const { stdout } = await invoke(directory, {
      hook_event_name: "SessionStart",
      session_id: "session-1",
      source,
    });
    const result = JSON.parse(stdout);
    expect(result.hookSpecificOutput.hookEventName).toBe("SessionStart");
    expect(result.hookSpecificOutput.additionalContext).toContain("ph-discord/SKILL.md");
    expect(result.hookSpecificOutput.additionalContext).toContain("America/Indiana/Indianapolis");
    expect(result.continue).toBeUndefined();
  }
  const { stdout } = await invoke(directory, {
    hook_event_name: "SubagentStart",
    session_id: "session-1",
    agent_id: "child-1",
  });
  expect(JSON.parse(stdout).hookSpecificOutput.hookEventName).toBe("SubagentStart");
});

test("parallel audit writes retain call identities without recording sensitive payloads", async () => {
  const directory = await temporaryHome();
  const secret = "sensitive-fixture-do-not-record";
  await Promise.all(
    Array.from({ length: 20 }, (_, index) =>
      invoke(directory, {
        hook_event_name: "PostToolUse",
        session_id: "session-1",
        tool_use_id: "call-" + index,
        tool_name: "mcp__discord__send_message",
        tool_input: { token: secret, content: secret },
        tool_response: { isError: index % 2 === 0, content: [{ text: secret }] },
        prompt: secret,
        transcript_path: secret,
        last_assistant_message: secret,
      }),
    ),
  );
  const saved = await log(directory);
  expect(saved.text).not.toContain(secret);
  const records = saved.text
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  expect(new Set(records.map((record) => record.tool_use_id)).size).toBe(20);
  expect(records.filter((record) => record.outcome === "reported_error")).toHaveLength(10);
  expect(records.filter((record) => record.outcome === "returned")).toHaveLength(10);
  expect((await stat(saved.path)).mode & 0o777).toBe(0o600);
});

test("end hooks observe lifecycle without continuing or blocking the agent", async () => {
  const directory = await temporaryHome();
  for (const name of ["Stop", "SubagentStop", "Interrupt", "SessionEnd"]) {
    const { stdout } = await invoke(directory, {
      hook_event_name: name,
      session_id: "session-1",
      last_assistant_message: "private content",
    });
    expect(JSON.parse(stdout)).toEqual({});
  }
  expect((await log(directory)).text).not.toContain("private content");
});

test("malformed and unsupported events are ignored", async () => {
  const directory = await temporaryHome();
  for (const raw of ["", "{broken", "null", "[]", '{"hook_event_name":"Unknown"}']) {
    expect((await invoke(directory, raw, true)).stdout).toBe("");
  }
  expect(await Bun.file(join(directory, "purduehackers/audit")).exists()).toBe(false);
});

test("audit filesystem failures leave the agent running", async () => {
  const directory = await temporaryHome();
  await Bun.write(join(directory, "purduehackers"), "occupied");
  const result = await invoke(directory, { hook_event_name: "Stop", session_id: "session-1" });
  expect(JSON.parse(result.stdout)).toEqual({});
  expect(result.stderr).toContain("local audit log unavailable");
});
