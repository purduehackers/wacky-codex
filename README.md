# agent-harness

Purdue Hackers' Codex dotfiles: MCPs, hooks, and PH skills.

Requires Bun, Codex with inline hooks, GitHub CLI, and Vercel CLI.

```sh
git clone git@github.com:purduehackers/agent-harness.git
cd agent-harness
./scripts/install
vercel login
./scripts/sync-env
gh auth login
codex
```

`codex/` contains `config.toml`, MCP helpers, and hooks. Setup scripts live in
`scripts/`, skills in `skills/`, and Bun tests in `tests/`.

The installer links `codex/config.toml` to `$CODEX_HOME/config.toml` (default
`~/.codex/config.toml`), skills into `~/.agents/skills`, and this checkout into
`~/.config/purduehackers`. It refuses conflicting files and removes only its own
old profile symlink. Keep the checkout; `git pull` updates the links.

Open `/hooks` to review and trust the hooks. Session and
subagent starts load PH context, including after compaction. Tool and lifecycle
hooks append metadata to `$CODEX_HOME/purduehackers/audit/YYYY-MM-DD.jsonl`
(default `~/.codex`); arguments, responses, and message text are not stored.
This is a local, best-effort activity log. Codex handles usage accounting.

Connect the OAuth MCPs once:

```sh
for server in vercel linear notion figma sentry cloudflare; do
  codex mcp login "$server"
done
```

GitHub uses `gh` authentication. Hunter reads `.env.local` through
the header helper, including when selected from the desktop app. Use either
the configured MCP or an existing plugin connection for each provider; disable
duplicate entries with `enabled = false` in `config.toml`.

Discord uses the local [Discord MCP](https://github.com/EL4CTEO/discord-mcp),
pinned to 1.2.0 and launched with Bun. It uses Wack's bot token and defaults to
the PH server. The package's destructive-action and mass-mention defaults stay
disabled; its configuration is available through `mcp_servers.discord.env`.

`scripts/sync-env` pulls shared variables from the **Development** environment
of [Purdue Hackers / agent-harness](https://vercel.com/purdue-hackers/agent-harness/settings/environment-variables).
No secrets belong in Git. OAuth connections use each organizer's own account.

CMS REST access uses the copied key. CMS MCP is disabled until a separate
`PAYLOAD_MCP_API_KEY` is provisioned and its entry is enabled; the current CMS
MCP exposes reads. PH skills cover CMS writes, HCB, Ask, and short links.
Native Codex handles coding, search, and scheduling.

The ten provider skills include all 100 retained topic guides from
[Wack Hacker](https://github.com/purduehackers/wack-hacker/tree/main/packages/agents/agent/subagents),
adapted for Codex/MCP. The shared skill directory and small lifecycle hooks take
inspiration from [e-stack](https://github.com/ElliotDrel/e-stack).
