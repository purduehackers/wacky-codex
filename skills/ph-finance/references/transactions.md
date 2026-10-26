# Transactions

- Page the requested time range and inspect signed cents, memo, type, pending flag, and receipt summary.
- Negative amounts are outflows. Signed comparisons reverse the intuitive expense threshold: amounts <= -100 cents are outflows of at least $1.
- Search by memo, amount, and date without treating a bounded scan as exhaustive.
- Link the underlying transaction and state pending/settled distinctions in reconciliations.
