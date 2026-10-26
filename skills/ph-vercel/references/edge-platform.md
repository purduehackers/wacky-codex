# Edge platform

- Inspect the intended Global Config store and current items before patching. Choose create, update, upsert, or delete according to conflict semantics.
- For PH short links and organizer records, use the specific store IDs and invariants in ph-operations and ph-context.
- Prefer cache invalidation when freshness is the goal; immediate deletion has different storage and performance effects.
- Read feature-flag environment/variant configuration before changing it. Revoking config tokens or SDK keys interrupts their consumers.
