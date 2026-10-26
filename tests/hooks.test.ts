import { afterEach, expect, test } from "bun:test";
import { mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { panic, Result } from "better-result";

import { HarnessError } from "../codex/harness-error";

const directories: string[] = [];
async function temporaryHome() {
  const result = await Result.tryPromise({
    try: () => mkdtemp(join(tmpdir(), "ph-hook-test-")),
    catch: () => new HarnessError({ message: "Could not create test directory." }),
  });
  if (result.isErr()) panic(result.error.message);
  const directory = result.value;
  directories.push(directory);
  return directory;
}
afterEach(async () => {
  const result = await Result.tryPromise({
    try: async () => {
      for (const path of directories.splice(0)) await rm(path, { recursive: true, force: true });
    },
    catch: () => new HarnessError({ message: "Could not remove test directories." }),
  });
  if (result.isErr()) panic(result.error.message);
});

function parseJson(text: string): unknown {
  const result = Result.try({
    try: () => JSON.parse(text),
    catch: () => new HarnessError({ message: "Invalid JSON from hook." }),
  });
  if (result.isErr()) panic(result.error.message);
  return result.value;
}

async function invoke(directory: string, event: unknown, raw = false) {
  const child = Bun.spawn(
    [process.execPath, "--no-env-file", join(import.meta.dir, "../codex/hooks/lifecycle.ts")],
    {
      env: { ...process.env, CODEX_HOME: directory },
      stdin: new Response(raw ? String(event) : JSON.stringify(event)),
      stdout: "pipe",
      stderr: "pipe",
    },
  );
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
    const result = parseJson(stdout);
    expect(result).toHaveProperty("hookSpecificOutput.hookEventName", "SessionStart");
    expect(result).toHaveProperty(
      "hookSpecificOutput.additionalContext",
      expect.stringContaining("ph-discord/SKILL.md"),
    );
    expect(result).toHaveProperty(
      "hookSpecificOutput.additionalContext",
      expect.stringContaining("America/Indiana/Indianapolis"),
    );
    expect(result).not.toHaveProperty("continue");
  }
  const { stdout } = await invoke(directory, {
    hook_event_name: "SubagentStart",
    session_id: "session-1",
    agent_id: "child-1",
  });
  expect(parseJson(stdout)).toHaveProperty("hookSpecificOutput.hookEventName", "SubagentStart");
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
  const records = saved.text.trim().split("\n").map(parseJson);
  expect(records).toHaveLength(20);
  for (let index = 0; index < 20; index++) {
    expect(records).toContainEqual(
      expect.objectContaining({
        tool_use_id: "call-" + index,
        outcome: index % 2 === 0 ? "reported_error" : "returned",
      }),
    );
  }
  const info = await Result.tryPromise({
    try: () => stat(saved.path),
    catch: () => new HarnessError({ message: "Could not read audit permissions." }),
  });
  if (info.isErr()) panic(info.error.message);
  expect(info.value.mode & 0o777).toBe(0o600);
});

test("end hooks observe lifecycle without continuing or blocking the agent", async () => {
  const directory = await temporaryHome();
  for (const name of ["Stop", "SubagentStop", "Interrupt", "SessionEnd"]) {
    const { stdout } = await invoke(directory, {
      hook_event_name: name,
      session_id: "session-1",
      last_assistant_message: "private content",
    });
    expect(parseJson(stdout)).toEqual({});
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
  expect(parseJson(result.stdout)).toEqual({});
  expect(result.stderr).toContain("local audit log unavailable");
});

test("invalid optional metadata cannot leak into the audit or prevent startup context", async () => {
  const directory = await temporaryHome();
  const result = await invoke(directory, {
    hook_event_name: "SessionStart",
    session_id: "session-1",
    source: "startup",
    tool_name: { secret: "private content" },
    agent_id: "invalid identifier with spaces",
    turn_id: "a".repeat(181),
    extra: "private content",
  });
  expect(parseJson(result.stdout)).toHaveProperty(
    "hookSpecificOutput.hookEventName",
    "SessionStart",
  );
  const saved = parseJson((await log(directory)).text);
  expect(saved).toEqual({
    time: expect.any(String),
    event: "SessionStart",
    session_id: "session-1",
    source: "startup",
  });

  const withoutSession = await temporaryHome();
  expect(
    parseJson((await invoke(withoutSession, { hook_event_name: "SessionStart" })).stdout),
  ).toHaveProperty("hookSpecificOutput.hookEventName", "SessionStart");
  expect(await Bun.file(join(withoutSession, "purduehackers/audit")).exists()).toBe(false);
});

test("audit outcomes distinguish explicit errors from arbitrary returned JSON", async () => {
  const directory = await temporaryHome();
  const responses = [
    { response: { isError: true }, outcome: "reported_error" },
    { response: { ok: false }, outcome: "reported_error" },
    { response: { exit_code: 2 }, outcome: "reported_error" },
    { response: { ok: true, exit_code: 0 }, outcome: "returned" },
    { response: { isError: "true", ok: "false", exit_code: "1" }, outcome: "returned" },
    { response: "plain text result", outcome: "returned" },
    { response: ["result"], outcome: "returned" },
    { response: null, outcome: "returned" },
    { response: {}, outcome: "returned" },
  ];
  for (const [index, { response }] of responses.entries()) {
    await invoke(directory, {
      hook_event_name: "PostToolUse",
      session_id: "session-1",
      tool_use_id: "call-" + index,
      tool_response: response,
    });
  }
  const records = (await log(directory)).text.trim().split("\n").map(parseJson);
  expect(records).toHaveLength(responses.length);
  for (const [index, { outcome }] of responses.entries()) {
    expect(records[index]).toMatchObject({ tool_use_id: "call-" + index, outcome });
  }
});
