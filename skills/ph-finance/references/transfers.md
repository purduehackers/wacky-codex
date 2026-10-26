# Transfers

Public list: `hcb get /organizations/purdue-hackers/transfers --all`.
For private access, inspect transfer records in
`hcb get /organizations/purdue-hackers/transactions --api v4 --all`.

- These records describe disbursements between HCB organizations, with sender, recipient, amount, status, memo, and date.
- Card charges and ordinary reimbursements belong in their own records, not the inter-organization transfer list.
- This skill is read-only. Inspecting a transfer does not initiate or cancel one.
