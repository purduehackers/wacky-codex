const token = process.env.DISCORD_BOT_TOKEN;
if (!token) throw new Error("Missing DISCORD_BOT_TOKEN; run ./sync-env.");

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

const child = Bun.spawn(["bun", "--no-env-file", "x", "--bun", "@el4cteo/discord-mcp@1.2.0"], {
  env,
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => child.kill(signal));
}
process.exit(await child.exited);
