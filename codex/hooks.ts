import { mkdir, open } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const events = new Set([
  "SessionStart",
  "SubagentStart",
  "PreToolUse",
  "PostToolUse",
  "SubagentStop",
  "Stop",
  "Interrupt",
  "SessionEnd",
]);

function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function identifier(value: unknown): string | undefined {
  return typeof value === "string" && /^[\w.:-]{1,180}$/u.test(value) ? value : undefined;
}

async function audit(event: Record<string, unknown>, name: string) {
  const session = identifier(event.session_id);
  if (!session) return;
  const now = new Date().toISOString();
  const directory = join(
    process.env.CODEX_HOME || join(homedir(), ".codex"),
    "purduehackers",
    "audit",
  );
  const record: Record<string, unknown> = {
    time: now,
    event: name,
    session_id: session,
  };
  // Allowlist metadata; never persist arguments, responses, prompts, or transcripts.
  for (const field of ["turn_id", "tool_name", "tool_use_id", "agent_id", "agent_type", "source"]) {
    const value = identifier(event[field]);
    if (value) record[field] = value;
  }
  if (name === "PostToolUse") {
    const response = object(event.tool_response);
    // A returned response is not proof that the requested external effect succeeded.
    record.outcome =
      response.isError === true ||
      response.ok === false ||
      (typeof response.exit_code === "number" && response.exit_code !== 0)
        ? "reported_error"
        : "returned";
  }
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const file = await open(join(directory, now.slice(0, 10) + ".jsonl"), "a", 0o600);
  try {
    await file.chmod(0o600);
    await file.write(JSON.stringify(record) + "\n");
  } finally {
    await file.close();
  }
}

async function run() {
  let event: Record<string, unknown>;
  try {
    event = object(JSON.parse(await Bun.stdin.text()));
  } catch {
    return;
  }
  const name = event.hook_event_name;
  if (typeof name !== "string" || !events.has(name)) return;

  try {
    await audit(event, name);
  } catch {
    console.error("PH hook: local audit log unavailable.");
  }

  if (name === "SessionStart" || name === "SubagentStart") {
    const skills = resolve(import.meta.dir, "../skills");
    const context = (await Bun.file(join(skills, "ph-context/SKILL.md")).text())
      .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/u, "")
      .trim();
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: name,
          additionalContext:
            "Purdue Hackers profile is active. PH skills are in " +
            skills +
            ". Read only the relevant provider skill and linked topic references.\n\n" +
            context,
        },
      }),
    );
  } else {
    // Stop and SubagentStop require JSON, even when no continuation is requested.
    console.log("{}");
  }
}

try {
  await run();
} catch {
  console.error("PH hook: context unavailable.");
  console.log("{}");
}
