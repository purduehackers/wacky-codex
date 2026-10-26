# Sending domains

- Inspect existing sending-domain configuration before onboarding a domain or subdomain.
- Obtain the provider's required DNS records, compare existing SPF/DKIM/DMARC values, and apply the intended changes without duplicating SPF policies.
- Read back domain verification after DNS propagation before reporting that sending is ready.
- Removing a sending domain interrupts every application using it. Identify those dependencies when preparing the removal.
