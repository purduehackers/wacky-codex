---
name: ph-shopping
description: Compare equipment for Purdue Hackers and maintain the existing shared wishlist cart.
---

Use native search or SerpApi MCP. Preserve requested features when comparing
alternatives, verify current price/availability, and retain product URLs and
ASINs from the source. A cart entry is a wishlist item, never a purchase.

The shared cart lives in the existing Turso database, using the copied
`TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`. Load them in a temporary Bun script:
`bun --env-file "$HOME/.config/purduehackers/.env.local" <script.ts>`.
Use the official `@libsql/client` with environment credentials and parameterized
SQL; install it in a temporary working directory if needed. Do not create a new
database, run migrations, or alter unrelated tables.

- `shopping_carts`: `id`, `created_at`, `updated_at`; the shared ID is `global`.
- `shopping_cart_items`: `id` (UUID), `cart_id`, `asin`, `title`, `price` (USD),
  `quantity`, `added_at`. Unique key: `(cart_id, asin)`.
- Scope every item query/mutation to `cart_id = 'global'` and cart metadata to
  `id = 'global'`. List by `added_at`.
- Use `client.batch(statements, 'write')` for each mutation and its cart timestamp
  update. Add creates the cart if absent, then inserts the item or atomically
  increments the existing quantity on the unique key. Do not read quantity and
  write it back outside the transaction.
- Quantity must be a nonnegative integer; zero removes that item. Unknown prices
  need resolution before insertion. Remove by ASIN within the shared cart;
  never replace the whole item table to remove one item.
- Clear only when the user explicitly requests clearing the shared cart. Read
  back changes. Subtotal is `sum(price * quantity)`, excluding tax/shipping.
