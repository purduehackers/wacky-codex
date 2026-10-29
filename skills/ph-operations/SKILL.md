---
name: ph-operations
description: Operate Purdue Hackers deployments and project integrations, investigate failures, or create phack.rs short links.
---

Use Vercel, GitHub, Sentry, Linear, and Cloudflare MCPs with the PH account.
Resolve the deployment's linked repository and production branch before editing
or deploying. Check the actual deployment and affected URL after a change.
Use native Codex worktrees, code tools, and scheduled tasks for execution.

Read the relevant provider skill's topic guide for detailed work:
[Vercel](../ph-vercel/SKILL.md), [GitHub](../ph-github/SKILL.md),
[Sentry](../ph-sentry/SKILL.md), [Linear](../ph-linear/SKILL.md), or
[Cloudflare](../ph-cloudflare/SKILL.md). Use the current MCP/plugin schema.

PH Vercel team: `purdue-hackers` (`team_kOQWJUQYzGW4blWthdK71Y8A`).
GitHub and Sentry organization: `purduehackers`. Discover Cloudflare account
and zone IDs from the connected account. Repository instructions take priority
over generic provider defaults; PH Bun repositories use Bun.

For `phack.rs` links, use the installed `phack` CLI:

```sh
phack create https://purduehackers.com/events --slug events
phack create https://purduehackers.com/events
phack get events
```

It uses `vercel login` and the PH team's short-link store. No extra API key is
needed. Without the installed command, run
`bun "$HOME/.config/purduehackers/cli/phack/index.ts"` with the same arguments.
Output is JSON; failures go to stderr and exit nonzero.

Creation is atomic and never overwrites a destination. An existing identical
link returns `status: "existing"`. Different destinations are conflicts.
If creation cannot be verified, the error includes the slug: read that slug
and retry with the same `--slug`. Do not generate another link after a timeout.
The CLI generates an eight-character slug when omitted. Explicit slugs are
2–64 letters/digits with optional internal hyphens; reserved routes are rejected.

The result confirms stored configuration, not public propagation. Verify the
redirect at the returned URL before reporting it live. Allow several seconds
for propagation. This CLI does not update, delete, or reset visit counts.
