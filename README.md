# agent-harness

Purdue Hackers' Codex dotfiles: native MCP connections, shared PH context, and two focused skills.

## Features

- **Connected services.** GitHub, Vercel, Linear, Notion, Figma, Sentry, Cloudflare, Hunter, and [Discord](https://github.com/purduehackers/discord-mcp) through native MCPs.
- **PH knowledge.** Ask searches our knowledge base. Hooks load [PH accounts and context](codex/context.md) when sessions and subagents start.
- **CMS.** [purdue-hackers-cms-skill](skills/purdue-hackers-cms-skill/SKILL.md) adds PH publishing and media workflows to Payload MCP.
- **Short links.** [phack-rs-skill](skills/phack-rs-skill/SKILL.md) creates and looks up `phack.rs` links using [@purduehackers/phack-cli](https://github.com/purduehackers/puhack.horse/tree/main/cli).

## Layout

```text
codex/                              # MCP config, PH context, hooks, authentication
skills/
  purdue-hackers-cms-skill/
  phack-rs-skill/
scripts/
  install                           # Link config, skills, and phack
  sync-env                          # Pull shared credentials from Vercel
```

## Compared with Wack Hacker

[Wack Hacker](https://github.com/purduehackers/wack-hacker) runs an agent in Discord. This harness brings its PH workflows into Codex.

|                | Wack Hacker              | agent-harness                     |
| -------------- | ------------------------ | --------------------------------- |
| Workspace      | Discord conversations    | Codex sessions and local projects |
| Service access | Custom provider wrappers | Native MCPs and the phack CLI     |
| Guidance       | Provider skill trees     | PH context and two focused skills |
| Agent runtime  | Hosted Eve application   | Codex                             |

Discord bot automations remain in Wack Hacker. Available service actions depend on each MCP.

## Get started

Requires Bun, Codex with hooks support, GitHub CLI, and Vercel CLI.

```sh
git clone https://github.com/purduehackers/agent-harness.git
cd agent-harness
./scripts/install
```

The installer symlinks files and refuses existing config conflicts. It does not install provider plugins.
Keep the checkout; rerun `./scripts/install` after `git pull` to refresh skill links.

<details>
<summary>Connect your accounts</summary>

```sh
vercel login
./scripts/sync-env
gh auth login

for server in vercel linear notion figma sentry cloudflare; do
  codex mcp login "$server"
done
codex
```

`sync-env` pulls credentials from PH's Vercel project into ignored `.env.local`.
Alternatively, fill it using [.env.example](.env.example).
Disable duplicate connections in [config.toml](codex/config.toml) when using provider plugins.

Review hooks with `/hooks` in Codex. Add `~/.local/bin` to `PATH` for `phack`.

</details>
