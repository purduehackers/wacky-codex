# Showcases

Use `/api/microgrants` and `/api/shelter`. Wack's `ugrants` and
`shelter-projects` names are not the current REST routes.

- Microgrants require `name`, `author`, `description`, and `image`. Optional links are `authorUrl` and `projectUrl`.
- Shelter requires `name`, `last_division`, `last_owner`, `description`, and `image`.
- `image` is a media relationship ID, not Wack's `image_id` input. Upload first; preserve the existing ID on unrelated edits.
- Both collections default `visible` to **true**. Set `visible: false` explicitly when preparing a draft.
- Publishing sets `visible: true`; hiding sets it to false. Verify the record and public showcase after a visibility change.
- Recheck [Microgrants.ts](https://github.com/purduehackers/cms/blob/main/src/collections/Microgrants.ts) and [Shelter.ts](https://github.com/purduehackers/cms/blob/main/src/collections/Shelter.ts) when fields change.
