# Environments

- Read existing wait timers, reviewers, protection rules, and allowed deployment branches before changing an environment.
- Resolve reviewer User/Team IDs and the current schema for branch-policy options.
- Removing protection or deleting an environment changes deployment behavior. Preserve unrelated controls and verify the effective configuration.

API reviewers have `{ type: "User" | "Team", id: <numeric-id> }` shapes.
Keep deployment branch policy separate from branch protection: environment
restrictions decide which refs can deploy, while branch protection controls
changes to the ref itself. Use the provider's current policy schema rather
than assuming both restriction modes can be enabled together.
