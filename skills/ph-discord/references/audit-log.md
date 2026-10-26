# Audit log

- Filter the server audit log by actor and action type, using the current Discord action enum rather than guessing numeric codes.
- Report executor, target, reason, changed fields, and time. Paginate by the returned audit-entry cursor.
- Discord retains audit entries for a limited period; an empty bounded result does not establish that an action never occurred.
