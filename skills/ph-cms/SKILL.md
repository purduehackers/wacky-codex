---
name: ph-cms
description: Manage Purdue Hackers CMS events, Hack Night sessions, media, microgrants, and shelter showcases.
---

CMS: `https://cms.purduehackers.com`; source: `purduehackers/cms`.
Prefer its native MCP when available. The current MCP exposes reads and requires
a Payload MCP key. The copied `PAYLOAD_CMS_API_KEY` is a service-account REST
key, not an MCP key.

Use the existing Payload REST API for operations the MCP does not expose:
`/api/<collection>` and `/api/<collection>/<id>`, with
`Authorization: service-accounts API-Key <key>`. Load the key with
`bun --env-file "$HOME/.config/purduehackers/.env.local" <script.ts>` and read
`process.env.PAYLOAD_CMS_API_KEY`. Keep credentials out of arguments and output.
Use native `fetch`, `Bun.file`, and `FormData` for JSON requests and uploads.

Collections: `events`, `rsvps`, `emails`, `hack-night-sessions`, `media`,
`microgrants`, `shelter`, `users`, `service-accounts`. Inspect the current
collection schema in the CMS repo before writing. List queries use `limit`,
`page`, `depth`, `sort`, and Payload `where[...]` filters; follow `hasNextPage`.

- Events need explicit start and end times, name, event type, and description.
  Use `America/Indiana/Indianapolis` and preserve offsets.
- Sessions use `title`, `date`, `host: { preferred_name, discord_id }`, and
  `description`. Descriptions are Lexical rich text, not plain strings.
- Publishing sets `published`; microgrants and shelter use `visible`.
  Upload media first and reference returned IDs; large files use the CMS's
  direct Blob upload flow.
- An event/email's `send` flag triggers real email. Publishing alone does not
  authorize sending. Preserve unsubscribe state in RSVP edits.
- Respect the service account's access result; do not bypass denied writes.
  Verify the resulting record/public page and link the admin document at
  `/admin/collections/<collection>/<id>`.

Read only the relevant topic below. These are PH workflows; discover the connected
provider's current tools and input schemas instead of assuming a tool name.

- [Events](references/events.md): Manage events, RSVPs, and email blasts on cms.purduehackers.com
- [Hack nights](references/hack-nights.md): Create, update, and publish hack night session records on cms.purduehackers.com
- [Media](references/media.md): List, fetch, upload, and delete image/file assets in the CMS media library
- [Service accounts](references/service-accounts.md): Manage service-account (API-key-only) identities in the CMS — bots and integrations
- [Showcases](references/showcases.md): Manage the ugrants (microgrants) and shelter-projects showcases on cms.purduehackers.com
- [Users](references/users.md): Admin-only management of CMS user accounts — invite, update roles, remove
