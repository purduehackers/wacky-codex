/**
 * @fileoverview Validates Codex events and records only approved metadata.
 * Audit failures leave context delivery and the agent running.
 */
import { mkdir, open } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

import { Result } from "better-result";

import { HarnessError } from "../harness-error";
import { hookEventSchema, type HookEvent } from "./schemas";

async function audit(event: HookEvent) {
  if (!event.session_id) return Result.ok();

  const { hook_event_name, tool_response: reportedError, ...metadata } = event;
  const now = new Date().toISOString();
  const directory = join(
    process.env.CODEX_HOME || join(homedir(), ".codex"),
    "purduehackers",
    "audit",
  );
  const record = {
    time: now,
    event: hook_event_name,
    ...metadata,
    outcome:
      hook_event_name === "PostToolUse"
        ? reportedError
          ? "reported_error"
          : "returned"
        : undefined,
  };

  return Result.tryPromise({
    try: async () => {
      await mkdir(directory, { recursive: true, mode: 0o700 });
      await using file = await open(join(directory, now.slice(0, 10) + ".jsonl"), "a", 0o600);
      await file.chmod(0o600);
      await file.write(JSON.stringify(record) + "\n");
    },
    catch: () => new HarnessError({ message: "PH hook: local audit log unavailable." }),
  });
}

async function run() {
  const input = await Result.tryPromise({
    try: () => Bun.stdin.json(),
    catch: () => new HarnessError({ message: "PH hook: invalid input." }),
  });
  if (input.isErr()) return;
  const event = hookEventSchema.safeParse(input.value);
  if (!event.success) return;

  const saved = await audit(event.data);
  if (saved.isErr()) console.error(saved.error.message);

  const name = event.data.hook_event_name;
  if (name !== "SessionStart" && name !== "SubagentStart") {
    console.log("{}");
    return;
  }

  const skills = resolve(import.meta.dir, "../../skills");
  const context = await Result.tryPromise({
    try: () => Bun.file(resolve(import.meta.dir, "../context.md")).text(),
    catch: () => new HarnessError({ message: "PH hook: context unavailable." }),
  });
  if (context.isErr()) {
    console.error(context.error.message);
    console.log("{}");
    return;
  }

  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: name,
        additionalContext:
          "Purdue Hackers configuration is active. PH-specific skills are in " +
          skills +
          ". Use native provider MCPs and plugins for other services.\n\n" +
          context.value.trim(),
      },
    }),
  );
}

await run();
