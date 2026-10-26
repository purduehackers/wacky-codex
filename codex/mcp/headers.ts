import { Result } from "better-result";

import { HarnessError } from "../harness-error";

function requireToken(token: string | undefined, provider: string) {
  return token
    ? Result.ok(token)
    : Result.err(
        new HarnessError({
          message: "Missing credentials for " + provider + "; run ./scripts/sync-env.",
        }),
      );
}

function githubToken() {
  return Result.gen(async function* () {
    const child = yield* Result.try({
      try: () =>
        Bun.spawn(["gh", "auth", "token", "--hostname", "github.com"], {
          stdout: "pipe",
          stderr: "ignore",
        }),
      catch: () => new HarnessError({ message: "Install GitHub CLI and run gh auth login." }),
    });
    const [token, code] = yield* Result.await(
      Result.tryPromise({
        try: () => Promise.all([new Response(child.stdout).text(), child.exited]),
        catch: () => new HarnessError({ message: "Could not read GitHub credentials." }),
      }),
    );
    if (code !== 0) return Result.err(new HarnessError({ message: "Run gh auth login first." }));
    const credential = yield* requireToken(token.trim(), "github");
    return Result.ok(credential);
  });
}

async function credentials(provider: string | undefined): Promise<Result<string, HarnessError>> {
  switch (provider) {
    case "github": {
      const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
      return token ? Result.ok(token) : githubToken();
    }
    case "hunter":
      return requireToken(process.env.HUNTER_API_KEY, provider);
    case "cms":
      return requireToken(process.env.PAYLOAD_MCP_API_KEY, provider);
    default:
      return Result.err(new HarnessError({ message: "Expected github, hunter, or cms." }));
  }
}

const provider = Bun.argv[2];
const result = await credentials(provider);
result.match({
  ok: (token) => {
    // Codex consumes stdout as authentication headers. Keep diagnostics on stderr.
    console.log(
      JSON.stringify(
        provider === "hunter" ? { "X-API-Key": token } : { Authorization: "Bearer " + token },
      ),
    );
  },
  err: (error) => {
    console.error(error.message);
    process.exitCode = 1;
  },
});
