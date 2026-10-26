# Dns records

- Resolve the domain to the PH account and zone before reading or changing records. Filter by record name and type.
- Read the existing record. Check whether the selected API operation patches fields or replaces the whole record; preserve unrelated values on replacement.
- MX priorities and proxy settings are record-type-specific. Use the current provider schema for supported types.
- MX, SPF, DKIM, and DMARC affect domain-wide mail. Keep one SPF policy per DNS name and extend that policy when authorizing another sender.
