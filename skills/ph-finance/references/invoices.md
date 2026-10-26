# Invoices

Public list: `hcb get /organizations/purdue-hackers/invoices --all`.
Private list: `hcb get '/invoices?organization_id=purdue-hackers' --api v4 --all`.
HCB currently rejects restricted OAuth tokens on this endpoint; use an authorized
HCB UI session or export if access is denied. Ledger transactions alone do not list unpaid invoices.

- Read sponsor/customer, amount, status, due date, paid date, and memo.
- Paginate before identifying all outstanding invoices. Exclude paid and voided invoices and distinguish overdue from not-yet-due.
- Report invoice evidence and links; a request to inspect balances does not authorize sending reminders or issuing invoices.
