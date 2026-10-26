# Webhooks

- Use `list_webhooks` for one channel or `list_guild_webhooks` for the whole guild before adding, moving, or removing integrations.
- MCP results contain webhook metadata and exclude secret URLs and tokens. Manage those credentials through Discord's integration settings.
- Edit only requested name, avatar, or destination fields.
- Deleting a webhook interrupts every consumer using its URL. Verify the intended integration before removal.
