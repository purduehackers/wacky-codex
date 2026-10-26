# Donations

Public list: `hcb get /organizations/purdue-hackers/donations --all`.
For private access, use `hcb get /organizations/purdue-hackers/transactions --api v4 --all`
and inspect the returned donation records.

- Read donation amount, status, recurring flag, and permitted donor information. Preserve anonymous donor identity.
- For totals, define the time window and statuses included. Separate pending or in-transit funds from settled funds using current HCB status semantics.
- Break out recurring and one-time amounts when useful. Avoid counting a donation again as an additional ledger inflow.
