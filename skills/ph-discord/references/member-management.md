# Member management

- Resolve an unambiguous member ID and the requested moderation action. Include the user's reason in the audit log.
- A kick removes membership but allows rejoining; a ban prevents rejoining until lifted.
- Deleting recent messages during a ban is an additional destructive option; set it only when requested.
- Use the current schema for timeout duration and limits. Clearing a timeout restores communication permissions.
- Honor the MCP's disabled destructive actions and Discord role hierarchy. Do not enable additional powers to complete a denied call.
