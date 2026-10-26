---
name: ph-vercel
description: Operate Purdue Hackers Vercel projects, deployments, environments, domains, integrations, and platform settings.
---

Team: purdue-hackers (team_kOQWJUQYzGW4blWthdK71Y8A). Use Vercel MCP/plugin and maintained Vercel skills; use the CLI for gaps.

Resolve project and environment before mutation. Verify final deployment/traffic behavior, not just acceptance of an asynchronous request.

Keep environment values and tokens out of output. Application error analysis routes to ph-sentry.

Read only the relevant topic below. These are PH workflows; discover the connected
provider's current tools and input schemas instead of assuming a tool name.

- [Artifacts](references/artifacts.md): Inspect the Turborepo remote cache — status, artifact existence, and usage.
- [Deployments](references/deployments.md): Inspect and control deployments — list, view events, cancel, delete, promote, rollback.
- [Domains](references/domains.md): Aliases, team domains, DNS records, registrar queries (availability, pricing, auth code), and TLS certs.
- [Edge platform](references/edge-platform.md): Global Config stores/items/tokens/backups, edge cache invalidation, native Vercel feature flags.
- [Integrations](references/integrations.md): Browse installed integrations, provision new marketplace stores (Turso, Upstash Redis, Neon Postgres, Vercel Blob), and connect them to projects.
- [Observability](references/observability.md): Runtime logs, log/data drains, API Observability settings, and team audit events.
- [Projects](references/projects.md): Inspect and mutate Vercel projects — lifecycle, env vars (value-stripped on list), project domains, members.
- [Rollouts](references/rollouts.md): Rolling releases (canary rollouts) and deployment checks.
- [Sandboxes](references/sandboxes.md): Vercel Sandbox lifecycle, shell commands, snapshots.
- [Security](references/security.md): Firewall configuration, attack challenge mode, bypass IPs, auth tokens.
- [Team admin](references/team-admin.md): Team members, access groups, webhooks, project routes, connect networks, microfrontends, billing, custom environments.
