import { Result } from "better-result";

import { HarnessError } from "../harness-error";

function run() {
  return Result.gen(async function* () {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      return Result.err(
        new HarnessError({
          message: "Missing DISCORD_BOT_TOKEN; run ./scripts/sync-env.",
        }),
      );
    }

    // Forward Discord configuration and runtime paths, not other providers' keys.
    const env = Object.fromEntries(
      Object.entries(process.env).filter(
        ([name, value]) =>
          value !== undefined &&
          (["PATH", "HOME", "TMPDIR"].includes(name) || name.startsWith("DISCORD_")),
      ),
    );
    env.DISCORD_TOKEN = token;
    delete env.DISCORD_BOT_TOKEN;

    const child = yield* Result.try({
      try: () =>
        Bun.spawn(["bun", "--no-env-file", "x", "--bun", "@el4cteo/discord-mcp@1.2.0"], {
          env,
          stdin: "inherit",
          stdout: "inherit",
          stderr: "inherit",
        }),
      catch: () => new HarnessError({ message: "Could not start Discord MCP." }),
    });
    for (const signal of ["SIGINT", "SIGTERM"] as const) {
      process.on(signal, () => child.kill(signal));
    }
    const code = yield* Result.await(
      Result.tryPromise({
        try: () => child.exited,
        catch: () => new HarnessError({ message: "Could not wait for Discord MCP." }),
      }),
    );
    return Result.ok(code);
  });
}

const result = await run();
process.exit(
  result.match({
    ok: (code) => code,
    err: (error) => {
      console.error(error.message);
      return 1;
    },
  }),
);
