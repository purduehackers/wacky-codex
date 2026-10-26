# Invites

- Resolve the destination channel and inspect relevant existing invitations.
- Set expiration, use count, and temporary membership deliberately; a permanent invite is a different request from a single-use invite.
- Temporary invites can remove users who disconnect without receiving a role.
- Return the full invite URL after creation. Revoking an invite invalidates that code for everyone holding it.
