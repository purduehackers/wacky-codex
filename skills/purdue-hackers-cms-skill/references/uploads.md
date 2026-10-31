# Uploads and REST authentication

CMS MCP uses `PAYLOAD_MCP_API_KEY`. REST uses the separate
`PAYLOAD_CMS_API_KEY` with
`Authorization: service-accounts API-Key <key>`.

Load REST credentials through the harness environment:

```sh
bun --env-file "$HOME/.config/purduehackers/.env.local" <script.ts>
```

Read `process.env.PAYLOAD_CMS_API_KEY` inside the script.
Collection routes are `https://cms.purduehackers.com/api/<collection>`.

Upload originals to `media` through Payload's multipart flow. Large files use
the direct Blob upload flow configured in
[payload.config.ts](https://github.com/purduehackers/cms/blob/main/src/payload.config.ts).
Token issuance uses the CMS account's media-create permission.

Media requires `alt`. Its provenance fields are `source`, `batchId`,
`discordMessageId`, and `discordUserId`. Use `source: "manual"` for ordinary
uploads; `hack-night` and `discord-drop` identify those existing workflows.
Record only actual Discord provenance. See
[Media.ts](https://github.com/purduehackers/cms/blob/main/src/collections/Media.ts).

Use the returned media ID in the parent record. A successful Blob upload alone
does not confirm that the media record or parent attachment was saved.
