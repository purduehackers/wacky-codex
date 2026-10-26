---
name: ph-finance
description: Read Purdue Hackers HCB balances, transactions, donations, invoices, and microgrant spending.
---

Use the harness's `hcb` CLI (`~/.local/bin/hcb`, or
`bun "$HOME/.config/purduehackers/cli/hcb/index.ts"`). Organization slug:
`purdue-hackers`. Output is JSON; errors go to stderr with a nonzero exit code.

```sh
hcb get /organizations/purdue-hackers
hcb get /user/organizations --api v4
hcb get /organizations/purdue-hackers/transactions --api v4 --all
```

The default public v3 API needs no key. Authenticated v4 reads use the caller's
`HCB_TOKEN` environment variable, never a command argument. Use an authorized
HCB OAuth access token; token issuance and refresh remain with the caller.
For restricted tokens, request `restricted organizations:read ledgers:read`
and `receipts:read` when needed. Scope and organization membership both apply.

The public API requires Transparency Mode. PH's endpoint returned 404 during
setup; use authenticated v4, an authorized HCB browser session, or an export
when the public API is unavailable. Do not interpret 404 as a zero balance or change the
organization's visibility to make the API work.

- Organization/balance: `GET /organizations/purdue-hackers`.
- Transactions: `/organizations/purdue-hackers/transactions` in either API.
- Transaction detail: `/transactions/<id>` in either API.
- The v4 organization list is `/user/organizations` and returns an array.
- [Public API docs](https://hcb.hackclub.com/docs/api/v3) and
  [implemented v4 routes](https://github.com/hackclub/hcb/blob/main/config/routes.rb).

Amounts are cents; negative is outflow. Separate pending transactions from
settled ones. Use `--all` for complete lists: v3 uses page numbers, v4 uses
`has_more` and `after` cursors. Quote paths containing query filters. Without
`--all`, the CLI returns one upstream response. Pagination failures emit no
partial result; disclose date/filter bounds before presenting a total.
Do not count the same payment both as a
donation/invoice and as a settled transaction.

HCB handles PH microgrant reimbursements. Organization-wide reimbursements
usually go through Purdue's BOSO portal; resolve which system the user means.
The CLI is read-only: no transfers, card issuance, or receipt uploads.
Public receipt metadata gives counts/missing status. Authorized v4 receipt
endpoints can expose attachment URLs; treat them as private. Link transactions to
`https://hcb.hackclub.com/hcb/<id>` and the ledger to
`https://hcb.hackclub.com/purdue-hackers`.

Read only the relevant topic below. Use the CLI with the appropriate API version.

- [Card charges](references/card-charges.md): List Hack Club Bank card charges with optional cardholder filter for microgrant spend tracking.
- [Donations](references/donations.md): List Hack Club Bank donations and total them over a date range for fundraising reporting.
- [Invoices](references/invoices.md): List Hack Club Bank invoices and surface outstanding (unpaid) ones for sponsor follow-ups.
- [Receipts](references/receipts.md): Check missing receipts and inspect authorized receipt metadata.
- [Transactions](references/transactions.md): List, inspect, and search Hack Club Bank transactions by memo, amount, or date range.
- [Transfers](references/transfers.md): View Hack Club Bank inter-org transfers (disbursements between HCB organizations).
