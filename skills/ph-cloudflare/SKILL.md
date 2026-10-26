---
name: ph-cloudflare
description: Manage Purdue Hackers DNS, inbound email routing, verified destinations, and transactional sending.
---

Use Cloudflare MCP in the PH account. Resolve account and zone IDs from the connected provider; do not infer zone IDs from domain names.

Inbound forwarding and outbound sending are separate systems. If a mail failure is ambiguous, determine which direction is affected.

Read the affected DNS/routing state and preserve unrelated records. Use the provider's current schemas and actual permissions.

Read only the relevant topic below. These are PH workflows; discover the connected
provider's current tools and input schemas instead of assuming a tool name.

- [Destination addresses](references/destination-addresses.md): Manage the account's verified Email Routing destinations.
- [Dns records](references/dns-records.md): Read and change DNS records on a Cloudflare zone.
- [Email routing](references/email-routing.md): Manage where inbound mail for a domain is forwarded.
- [Email sending](references/email-sending.md): Send a one-off transactional email from a verified domain.
- [Sending domains](references/sending-domains.md): Onboard and inspect domains authorized to send mail.
