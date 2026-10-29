# Hack nights

- The hack-night-sessions collection uses title, ISO date, host, rich-text description, and published.
- The host group contains preferred_name and discord_id. On updates, preserve the other host field when changing one.
- Use Lexical rich text in REST writes. Publishing affects the Hack Night dashboard.
- Upload photos through the media collection first. Read the current session relationship fields before attaching returned IDs; verify the dashboard or admin record.

The REST host shape is `host: { preferred_name: "Name", discord_id: "123..." }`.
Keep the Discord ID a string. Wack's `host_preferred_name` and `host_discord_id`
were wrapper inputs, not top-level REST fields. Read existing image arrays
before adding photos so an update does not replace earlier uploads.
