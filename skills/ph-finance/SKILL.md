---
name: ph-finance
description: Read Purdue Hackers HCB balances, transactions, donations, invoices, and microgrant spending.
---

Use the public HCB v3 API at `https://hcb.hackclub.com/api/v3`.
Organization slug: `purdue-hackers`. No API key is required.

The public API requires Transparency Mode. PH's endpoint returned 404 during
setup; use an authorized signed-in HCB browser session or an export when the
public API is unavailable. Do not interpret 404 as a zero balance or change the
organization's visibility to make the API work.

- Organization/balance: `GET /organizations/purdue-hackers`.
- Transactions: `GET /organizations/purdue-hackers/transactions`.
- Transaction detail: `GET /transactions/<id>`.
- Read the [HCB API docs](https://hcb.hackclub.com/docs/api/v3) for other resources.

Amounts are cents; negative is outflow. Separate pending transactions from
settled ones. Paginate with `page` and `per_page`, and disclose any page/date
bound before presenting a total. Do not count the same payment both as a
donation/invoice and as a settled transaction.

HCB handles PH microgrant reimbursements. Organization-wide reimbursements
usually go through Purdue's BOSO portal; resolve which system the user means.
This API is read-only: no transfers, card issuance, or receipt uploads.
Receipt metadata gives counts/missing status, not files. Link transactions to
`https://hcb.hackclub.com/hcb/<id>` and the ledger to
`https://hcb.hackclub.com/purdue-hackers`.
