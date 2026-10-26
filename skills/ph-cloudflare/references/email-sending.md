# Email sending

- Use the connected Cloudflare sending capability only for an explicitly requested transactional message from a verified sending domain.
- Resolve the exact sender, recipients, subject, and body from the authorized request or reviewed draft before sending. Event/RSVP blasts use the CMS pipeline.
- Inspect permanent bounces even in a successful response. Accepted or queued is not delivered; retain the provider message ID and report the actual status.
