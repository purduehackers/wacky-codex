# Projects

- GitHub Projects v2 use a human-facing project number and GraphQL node IDs for mutations.
- Resolve the project schema, item node ID, field ID, and any single-select option ID before updating a field.
- Adding/removing an issue or PR from a project does not create/delete the underlying issue or PR.
- Use the current typed field value for text, number, date, or selection.
