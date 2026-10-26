# Email routing

- Inspect both address-specific rules and the catch-all to explain where inbound mail goes.
- Forward only to verified destinations. Preserve the complete intended matcher and destination list when replacing a rule.
- Enabling routing can replace existing MX records; disabling it stops forwarding. Identify the existing mail provider and the requested consequence before changing either.
- A drop catch-all discards messages for unmatched addresses. Deleting a specific rule may make its traffic fall through to that catch-all.
