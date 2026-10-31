---
name: purdue-hackers-cms-skill
description: Manage Purdue Hackers CMS events, RSVPs, Hack Night sessions, media, and showcases.
---

Use CMS MCP for records at `https://cms.purduehackers.com`.
The collection definitions live in [purduehackers/cms](https://github.com/purduehackers/cms/tree/main/src/collections).
Use [uploads and REST authentication](references/uploads.md) when a task requires the REST fallback.

- CMS events and Hack Night sessions use `published`. Publishing a session
  makes it visible on the Hack Night dashboard.
- Setting an event or email's `send` flag triggers real email. Publishing alone
  does not send. Set `send` only for a requested send; check `sentAt` before
  retrying an uncertain send.
- RSVP unsubscribe requests set `unsubscribed`, preserving the attendance record.
- Hack Night descriptions use Lexical rich text. Hosts use
  `host: { preferred_name, discord_id }`; the Discord ID is a string.
  Session photos use `images: [{ image: mediaId }]`.
- Microgrants and shelter showcases default to `visible: true`.
  Set `visible: false` for drafts. Their `image` field references a media ID.
- Upload media before attaching its returned ID to a record.
  The CMS stores originals; the events site handles image resizing.

Link the resulting admin record at
`https://cms.purduehackers.com/admin/collections/<collection>/<id>`.
