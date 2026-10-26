# Receipts

- HCB receipt work covers HCB card charges and microgrant reimbursements. PH organization-wide reimbursement receipts generally follow the BOSO/#receipts workflow.
- The public API exposes receipt count/missing status, not file bytes or receipt download URLs.
- List the transaction, date, amount, memo, and HCB link when identifying missing receipts.
- For authorized v4 reads, use `hcb get '/receipts?transaction_id=<id>' --api v4`. Attachment URLs, when returned, are private account data.
- Use an authorized HCB UI session if the token lacks access. Never claim a receipt was uploaded based only on metadata.
