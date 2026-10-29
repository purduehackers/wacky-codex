# Service accounts

- Service accounts are API-key identities for integrations, with a name, roles, and revoked flag. Read current roles from the CMS schema.
- Provisioning an identity and issuing its secret are separate steps. Use the authorized admin/key flow, store the key securely, and never echo it.
- Revocation preserves the identity's history while disabling its key. Prefer it when the request is to revoke access.
- The CMS REST service-account key and Payload MCP key are different credentials; creating one does not enable the other.

The role set used by PH includes `admin`, `editor`, `viewer`,
`hack_night_dashboard`, `events_website`, and `wack_hacker`; confirm against the
current CMS schema. A roles update replaces the array. Read the existing set
before adding or removing one role. Creating a record does not mint its key;
use the CMS admin key flow separately.
