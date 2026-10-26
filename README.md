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
`scripts/`, skills in `skills/`, the HCB CLI in `cli/hcb/`, and Bun tests in `tests/`.
Checks: `bun run lint`, `bun run format --check`, `bun run typecheck`, and `bun test`.

The installer installs dependencies and links `codex/config.toml` to `$CODEX_HOME/config.toml` (default
`~/.codex/config.toml`), skills into `~/.agents/skills`, and this checkout into
`~/.config/purduehackers`. It also links `hcb` into `~/.local/bin`; keep that directory
on `PATH`. It refuses conflicting files and removes only its own
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

GitHub uses `gh` authentication. Hunter and Ask read `.env.local` through
the header helper, including when selected from the desktop app. Use either
the configured MCP or an existing plugin connection for each provider; disable
duplicate entries with `enabled = false` in `config.toml`.

Discord uses [purduehackers/discord-mcp](https://github.com/purduehackers/discord-mcp)
at `https://discord.purduehackers.com/mcp`. The header helper sends `DISCORD_TOKEN`
or Wack's existing `DISCORD_BOT_TOKEN` as `X-Discord-Token` on each request.
The xmcp server exposes named operations with typed inputs, validated outputs,
and the token's existing permissions. The [Discord skill](skills/ph-discord/SKILL.md) covers their use.
Ask uses its native MCP at `https://ask.purduehackers.com/api/mcp`.

HCB is a read-only CLI: `hcb get /organizations/purdue-hackers` for public v3,
or `hcb get /user/organizations --api v4` with `HCB_TOKEN` in the environment.
Use `--all` to collect every page into one JSON array. The caller manages HCB
OAuth tokens and refresh. See the [finance skill](skills/ph-finance/SKILL.md).

`scripts/sync-env` pulls shared variables from the **Development** environment
of [Purdue Hackers / agent-harness](https://vercel.com/purdue-hackers/agent-harness/settings/environment-variables).
No secrets belong in Git. OAuth connections use each user's own account.

CMS REST access uses the copied key. CMS MCP is disabled until a separate
`PAYLOAD_MCP_API_KEY` is provisioned and its entry is enabled; the current CMS
MCP exposes reads. PH skills cover CMS writes, HCB, Ask, and short links.
Native Codex handles coding and search. Wack's scheduled tasks are not migrated.

The ten provider skills include all 100 retained topic guides from
[Wack Hacker](https://github.com/purduehackers/wack-hacker/tree/main/packages/agents/agent/subagents),
adapted for Codex/MCP. The shared skill directory and small lifecycle hooks take
inspiration from [e-stack](https://github.com/ElliotDrel/e-stack).
