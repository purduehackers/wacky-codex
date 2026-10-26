# Card charges

Public list: `hcb get /organizations/purdue-hackers/card_charges --all`.
For private access, use `hcb get /organizations/purdue-hackers/transactions --api v4 --all`
and inspect the returned card-charge records.

- Read merchant memo, cardholder, signed amount in cents, pending status, and receipt summary.
- For microgrant spend, resolve the recipient and filter their card charges. State the date and pagination bounds; do not imply that a partial page is lifetime spend.
- Keep pending charges separate from settled expenses. Missing receipt metadata is a follow-up item, not access to the receipt file.
