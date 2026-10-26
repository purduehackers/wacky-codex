# Membership

- A bot invite link lets a person join voluntarily; it does not directly enroll them through user OAuth.
- Resolve the landing channel and requested expiration/use limit, then return the full invitation URL.
- Use `create_invite` for voluntary joining and `kick_member` for membership removal. `ban_member` also prevents rejoining.
- Resolve the exact user before removing access and preserve the distinction between the person's account and their PH membership.
