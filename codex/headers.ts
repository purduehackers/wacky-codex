const provider = Bun.argv[2];
const variables: Record<string, string> = {
  hunter: "HUNTER_API_KEY",
  serpapi: "SERPAPI_API_KEY",
  cms: "PAYLOAD_MCP_API_KEY",
};

let token: string | undefined;
if (provider === "github") {
  token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) {
    const child = Bun.spawn(["gh", "auth", "token", "--hostname", "github.com"], {
      stdout: "pipe",
      stderr: "ignore",
    });
    token = (await new Response(child.stdout).text()).trim();
    if (await child.exited) throw new Error("Run gh auth login first.");
  }
} else if (provider && variables[provider]) {
  token = process.env[variables[provider]];
} else {
  throw new Error("Expected github, hunter, serpapi, or cms.");
}
if (!token) throw new Error(`Missing credentials for ${provider}; run ./sync-env.`);

// Stdout is consumed by Codex as authentication headers. Never log it elsewhere.
console.log(
  JSON.stringify(
    provider === "hunter" ? { "X-API-Key": token } : { Authorization: `Bearer ${token}` },
  ),
);
