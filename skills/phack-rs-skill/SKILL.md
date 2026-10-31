---
name: phack-rs-skill
description: Create and look up Purdue Hackers phack.rs short links.
---

Use the `phack` command from
[@purduehackers/phack](https://github.com/purduehackers/puhack.horse).
It requires Bun and `PHACK_TOKEN`, an organizer-owned API key from
[the dashboard](https://phack.rs/dashboard). The installed command loads credentials
from the harness checkout’s `.env.local`. Set `PHACK_URL=https://phack.rs` in that file.

```sh
phack create https://purduehackers.com/events --slug events
phack create https://purduehackers.com/events
phack get events
```

If the command is unavailable, run `./scripts/install` from the harness checkout.
Output is JSON. Use the API client; do not write to Vercel Edge Config.

Creation never overwrites an existing destination. An identical link returns
`status: "existing"`; a different destination is a conflict.
Omitting `--slug` generates an eight-character slug.

After an uncertain create, read the slug reported in the error.
Retry with that same `--slug` instead of generating another link.

Verify the returned URL’s redirect before reporting it live.
Use `phack delete <slug>` only when the user requests deletion.
