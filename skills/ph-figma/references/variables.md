# Variables

- Read collections, modes, variable types, and local versus published values before editing tokens.
- Preserve mode-specific values and aliases. Types include color, number, string, and boolean; use the current tool's representation.
- Bulk edits can create, update, and delete multiple records. Keep the operation scoped to the requested collections/variables and verify the result.

REST variable types are `COLOR`, `FLOAT`, `STRING`, and `BOOLEAN`.
Values are keyed by mode ID; collection IDs, mode IDs, and variable IDs are
separate. Preserve alias references instead of replacing them with resolved
colors or numbers. Local variables include unpublished edits; published
library values can lag behind them.
