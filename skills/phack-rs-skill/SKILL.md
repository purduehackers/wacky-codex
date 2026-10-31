---
name: phack-rs-skill
description: Create and look up Purdue Hackers phack.rs short links.
---

Use the `phack` command from
[@purduehackers/phack-cli](https://github.com/purduehackers/puhack.horse/tree/main/cli).
It requires Bun and an existing `vercel login` with access to the PH team.

```sh
phack create https://purduehackers.com/events --slug events
phack create https://purduehackers.com/events
phack get events
```

If the command is unavailable, use `bunx @purduehackers/phack-cli` with the
same arguments. Output is JSON.

Creation never overwrites an existing destination. An identical link returns
`status: "existing"`; a different destination is a conflict.
Omitting `--slug` generates an eight-character slug.

After an uncertain create, read the slug reported in the error.
Retry with that same `--slug` instead of generating another link.

A saved link can take several seconds to propagate. Verify the returned URL's
redirect before reporting it live. The CLI does not update or delete links.
