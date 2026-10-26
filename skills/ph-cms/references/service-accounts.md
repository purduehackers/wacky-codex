# Service accounts

- Service accounts are API-key identities for integrations, with a name, roles, and revoked flag. Read current roles from the CMS schema.
- Provisioning an identity and issuing its secret are separate steps. Use the authorized admin/key flow, store the key securely, and never echo it.
- Revocation preserves the identity's history while disabling its key. Prefer it when the request is to revoke access.
- The CMS REST service-account key and Payload MCP key are different credentials; creating one does not enable the other.
