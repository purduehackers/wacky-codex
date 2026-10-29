# Media

Upload through Payload's multipart or direct Blob flow. Provide required `alt`
text and retain the returned media ID for relationship fields.

- REST fields are `source`, `batchId`, `discordMessageId`, and `discordUserId`. Wack's snake_case projections are not REST input names.
- `source` is `manual` (default), `hack-night`, or `discord-drop`. Preserve real provenance instead of inventing Discord IDs.
- Use `where[batchId][equals]=<batch>` and `where[source][equals]=hack-night` to inspect a batch. Paginate before treating it as complete.
- The CMS stores originals; image resizing happens on the events site. Do not rely on the old wrapper's thumbnail fields.
- Before deleting an asset, check references: pages using it lose their image. Verify the intended record after upload or deletion.
- The `wack_hacker` role can upload media but has restricted deletion access. Honor the server's response.

Field source: [Media.ts](https://github.com/purduehackers/cms/blob/main/src/collections/Media.ts).
