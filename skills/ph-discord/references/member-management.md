# Member management

- Resolve an unambiguous member ID and the requested moderation action. Include the user's reason in the audit log.
- A kick removes membership but allows rejoining; a ban prevents rejoining until lifted.
- Deleting recent messages during a ban is an additional destructive option; set it only when requested.
- `timeout_member` takes an absolute `communication_disabled_until` timestamp within 28 days. `clear_timeout` restores communication permissions.
- Discord enforces the token's permissions and role hierarchy; report a denied call accurately.
