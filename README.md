# agent-harness

Bring Purdue Hackers' tools and workflows into Codex.

A small set of dotfiles that gives Codex PH context, service connections, and reusable skills.

## Features

- **Connected tools.** GitHub, Vercel, Linear, Notion, Figma, Sentry, Cloudflare, and Hunter through MCP.
- **Discord access.** Search messages and manage the server through [our Discord MCP](https://github.com/purduehackers/discord-mcp).
- **PH knowledge.** Ask searches our knowledge base; skills cover deployments, events, and other PH workflows.
- **CMS access.** Manage events, RSVPs, Hack Night sessions, media, and showcases through Payload MCP.
- **Short links.** Create and look up `phack.rs` links with the `phack` CLI.
- **Shared context.** Hooks load PH guidance when sessions and subagents start.

## Compared with Wack Hacker

[Wack Hacker](https://github.com/purduehackers/wack-hacker) brings an agent into Discord. This repo brings PH workflows into Codex.

|                      | Wack Hacker                                  | agent-harness                                    |
| -------------------- | -------------------------------------------- | ------------------------------------------------ |
| Where you work       | Discord conversations                        | Codex sessions                                   |
| Service access       | Custom provider tools                        | MCP servers and small CLIs                       |
| Coding               | Dedicated sandbox workflow                   | Codex's workspace and coding tools               |
| PH workflows         | Built-in domain skills                       | Adapted skills in this repo                      |
| Hosting              | Bot and agent services                       | Local configuration; connects to hosted services |
| Community automation | Discord commands, events, and scheduled jobs | Not migrated                                     |

## Get started

Requires Bun, Codex with hooks support, GitHub CLI, and Vercel CLI.

```sh
git clone https://github.com/purduehackers/agent-harness.git
cd agent-harness
./scripts/install
```

Keep the checkout; `git pull` updates the linked config and skills. The installer refuses to replace existing config files.

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

`sync-env` requires access to PH's Vercel project. For your own setup, fill
`.env.local` using [.env.example](.env.example) and adjust [config.toml](codex/config.toml).
Disable any MCPs already connected through plugins. Review hooks with `/hooks` in Codex.

Add `~/.local/bin` to `PATH` for `phack`.
CMS uses `PAYLOAD_MCP_API_KEY` from the shared credentials.

</details>
