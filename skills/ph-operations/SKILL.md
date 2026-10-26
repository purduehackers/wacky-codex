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

For `phack.rs` links, use Vercel's Global Config tools on
`ecfg_k1ocmrcfwo57k9v2klgtljycqsqj` in the PH team:

- Each key is a slug; its value is `{ "d": "https://destination", "v": 0 }`.
- Slugs match `^[A-Za-z0-9][A-Za-z0-9-]{0,62}[A-Za-z0-9]$`.
  Reserve `404`, `api`, `dashboard`, `favicon`, and `login`.
  Generate eight random alphanumeric characters if no slug was requested.
- Use the atomic `create` operation. An existing slug with the same destination
  can be returned; a different destination is a conflict, never an upsert.
- After a timeout, read the exact key before retrying. Verify the redirect at
  `https://phack.rs/<slug>`; propagation can take several seconds.
