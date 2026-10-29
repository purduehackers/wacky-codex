# Users

- CMS user administration requires the connected identity's server-side permission. A discoverable skill does not confer that permission.
- Inspect the role schema and existing user before changing access. Replacing the roles array must retain unrelated roles.
- Use the current CMS invitation/account-creation flow. Handle any temporary password through a secure channel.
- Reducing editorial roles, disabling access, and deleting an account have different effects; choose the one requested and preserve history where appropriate.

PH roles include `admin`, `editor`, `viewer`, `hack_night_dashboard`,
`events_website`, and `wack_hacker`. Specialized roles are additive.
Preserve them when changing an editorial role. Do not infer CMS access from
Discord roles or Wack's former organizer menu.
