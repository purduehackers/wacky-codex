# Auto moderation

- Read existing rules before changing keyword, spam, mention-flood, or member-profile protection.
- Match the rule's event and trigger type to the current schema. Actions may block messages, alert a channel, or time out a member.
- Resolve alert-channel IDs and duration units. Preserve unrelated exemptions and actions during an update.
- Use `list_auto_mod_rules`, `get_auto_mod_rule`, `create_auto_mod_rule`, `update_auto_mod_rule`, and `delete_auto_mod_rule`. Removing or disabling a rule removes its protection.
