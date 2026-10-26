import { afterEach, expect, test } from "bun:test";
import { chmod, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { panic, Result } from "better-result";

import { HarnessError } from "../codex/harness-error";

const directories: string[] = [];

async function executable(name: string, script: string) {
  const result = await Result.tryPromise({
    try: async () => {
      const directory = await mkdtemp(join(tmpdir(), "ph-mcp-test-"));
      directories.push(directory);
      const path = join(directory, name);
      await Bun.write(path, "#!/bin/sh\n" + script);
      await chmod(path, 0o700);
      return directory;
    },
    catch: () => new HarnessError({ message: "Could not create fake executable." }),
  });
  if (result.isErr()) panic(result.error.message);
  return result.value;
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

async function invoke(helper: "headers" | "discord", args: string[], env: NodeJS.ProcessEnv = {}) {
  const child = Bun.spawn(
    [
      process.execPath,
      "--no-env-file",
      join(import.meta.dir, "../codex/mcp/" + helper + ".ts"),
      ...args,
    ],
    {
      env: { PATH: "/nonexistent", ...env },
      stdin: "ignore",
      stdout: "pipe",
      stderr: "pipe",
    },
  );
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { stdout, stderr, code };
}

test("header helpers select only the requested provider credential", async () => {
  const env = {
    GH_TOKEN: "fixture-gh",
    GITHUB_TOKEN: "fixture-github",
    HUNTER_API_KEY: "fixture-hunter",
    PAYLOAD_MCP_API_KEY: "fixture-cms",
    PHACK_ASK_API_KEY: "fixture-ask",
  };
  for (const [provider, headers] of [
    ["github", { Authorization: "Bearer fixture-gh" }],
    ["hunter", { "X-API-Key": "fixture-hunter" }],
    ["cms", { Authorization: "Bearer fixture-cms" }],
    ["ask", { Authorization: "Bearer fixture-ask" }],
  ] as const) {
    expect(await invoke("headers", [provider], env)).toEqual({
      code: 0,
      stderr: "",
      stdout: JSON.stringify(headers) + "\n",
    });
  }
  expect(await invoke("headers", ["github"], { GITHUB_TOKEN: "fixture-github" })).toEqual({
    code: 0,
    stderr: "",
    stdout: '{"Authorization":"Bearer fixture-github"}\n',
  });
});

test("missing credentials and invalid providers fail without writing protocol output", async () => {
  for (const args of [[], ["unknown"], ["hunter"], ["cms"], ["github"], ["ask"]]) {
    const result = await invoke("headers", args);
    expect(result.code).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr.trim().split("\n")).toHaveLength(1);
    expect(result.stderr).not.toBe("");
  }
});

test("GitHub CLI fallback validates its exit status before emitting credentials", async () => {
  const success = await executable(
    "gh",
    '[ "$*" = "auth token --hostname github.com" ] || exit 2\nprintf "fixture-cli-token\\n"\n',
  );
  expect(await invoke("headers", ["github"], { PATH: success })).toEqual({
    code: 0,
    stderr: "",
    stdout: '{"Authorization":"Bearer fixture-cli-token"}\n',
  });
  const failure = await executable(
    "gh",
    'printf "fixture-cli-token\\n"\nprintf "private diagnostic" >&2\nexit 1\n',
  );
  expect(await invoke("headers", ["github"], { PATH: failure })).toEqual({
    code: 1,
    stderr: "Run gh auth login first.\n",
    stdout: "",
  });
});

test("Discord forwards protocol streams and exit status while isolating provider keys", async () => {
  const directory = await executable(
    "bun",
    `
[ "$1" = "--no-env-file" ] || exit 70
case "$2" in */node_modules/@purduehackers/discord-mcp/src/index.ts) ;; *) exit 70 ;; esac
[ "$DISCORD_TOKEN" = "fixture-discord" ] || exit 71
[ "$DISCORD_AUTH_PREFIX" = "Bearer" ] || exit 72
[ -z "$DISCORD_BOT_TOKEN$HUNTER_API_KEY$GH_TOKEN$PAYLOAD_MCP_API_KEY$PHACK_ASK_API_KEY" ] || exit 73
printf 'fixture-mcp-frame\n'
printf 'fixture-diagnostic\n' >&2
exit 7
`,
  );
  expect(
    await invoke("discord", [], {
      PATH: directory,
      HOME: directory,
      DISCORD_BOT_TOKEN: "fixture-discord",
      DISCORD_AUTH_PREFIX: "Bearer",
      HUNTER_API_KEY: "fixture-hunter",
      GH_TOKEN: "fixture-gh",
      PAYLOAD_MCP_API_KEY: "fixture-cms",
      PHACK_ASK_API_KEY: "fixture-ask",
    }),
  ).toEqual({ code: 7, stdout: "fixture-mcp-frame\n", stderr: "fixture-diagnostic\n" });
});

test("Discord reports missing credentials and launch failures without a stack trace", async () => {
  expect(await invoke("discord", [])).toEqual({
    code: 1,
    stdout: "",
    stderr: "Missing DISCORD_TOKEN or DISCORD_BOT_TOKEN; run ./scripts/sync-env.\n",
  });
  expect(await invoke("discord", [], { DISCORD_BOT_TOKEN: "fixture-discord" })).toEqual({
    code: 1,
    stdout: "",
    stderr: "Could not start Discord MCP.\n",
  });
});
