# agent-harness

Purdue Hackers' Codex dotfiles: [MCP config](codex/config.toml), [skills](skills/), hooks, and CLIs.

Requires Bun, Codex with inline hooks, `gh`, and `vercel`.

```sh
git clone git@github.com:purduehackers/agent-harness.git
cd agent-harness
./scripts/install
vercel login
./scripts/sync-env
gh auth login

for server in vercel linear notion figma sentry cloudflare; do
  codex mcp login "$server"
done
codex
```

The installer symlinks the config, skills, and CLIs; it refuses existing conflicts.
Keep this checkout and update with `git pull`. Add `~/.local/bin` to `PATH`.
Review and trust the hooks with `/hooks` in Codex.

Shared credentials come from the Vercel `agent-harness` project's Development
environment into ignored `.env.local`. Disable duplicate MCP/plugin connections
in `codex/config.toml`. CMS MCP needs a separate `PAYLOAD_MCP_API_KEY` before enabling.

```sh
phack create https://example.com --slug example  # Uses vercel login; never overwrites
phack get example
hcb get /user/organizations --api v4             # Requires HCB_TOKEN
hcb get /organizations/purdue-hackers/transactions --api v4 --all
```

Checks: `bun run lint`, `bun run typecheck`, `bun run format --check`.
