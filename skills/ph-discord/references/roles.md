# Roles

- Resolve both member and role IDs. A person can have several roles, so adding/removing one must preserve the others.
- Inspect hierarchy and bot permissions before creation, reassignment, or position changes. Role position affects authority.
- Name, color, hoist, mentionability, and permissions are independent settings; change only requested values.
- Deleting a role removes it from every member. Integration-managed roles have provider restrictions.
