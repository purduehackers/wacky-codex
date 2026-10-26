# agent-harness

Purdue Hackers' Codex dotfiles. Provider MCPs, a named profile, and PH skills.

Requires Bun, Codex with named profile files, GitHub CLI, and Vercel CLI.

```sh
git clone git@github.com:purduehackers/agent-harness.git
cd agent-harness
./install
vercel login
./sync-env
gh auth login
codex --profile purduehackers
```

`install` symlinks the profile into `$CODEX_HOME` (default `~/.codex`), skills
into `~/.agents/skills`, and this checkout into `~/.config/purduehackers`.
It refuses conflicting files. Keep the checkout; `git pull` updates the links.
Personal model and permission settings stay in the base Codex config.

Connect the OAuth MCPs once:

```sh
for server in vercel linear notion figma sentry cloudflare; do
  codex --profile purduehackers mcp login "$server"
done
```

GitHub uses `gh` authentication. Hunter and SerpApi read `.env.local` through
the header helper, including when selected from the desktop app. Use either
this profile's MCP or an existing plugin connection for each provider; disable
duplicate entries with `enabled = false` in the profile.

`sync-env` pulls the six shared variables from the **Development** environment
of [Purdue Hackers / agent-harness](https://vercel.com/purdue-hackers/agent-harness/settings/environment-variables).
No secrets belong in Git. OAuth connections use each organizer's own account.

CMS REST access uses the copied key. CMS MCP is disabled until a separate
`PAYLOAD_MCP_API_KEY` is provisioned and its entry is enabled; the current CMS
MCP exposes reads. PH skills cover CMS writes, HCB, Ask, short links, and the
existing shared wishlist. Native Codex handles coding, search, and scheduling.
