# Issue management

- Resolve numeric issue IDs and inspect the current issue before resolving, ignoring, assigning, or deleting.
- Immediate resolution, next-release resolution, and resolution tied to a commit/release have different meanings.
- Ignore rules can be time- or count-bound. Preserve the intended window and explain the resulting suppression.
- Bulk operations require an exact issue set. Use tag distributions to investigate impact rather than silently changing unrelated issues.

For API-shaped status details, next-release resolution uses
`{ "inNextRelease": true }`; commit resolution uses
`{ "inCommit": { "commit": "sha", "repository": "org/repo" } }`.
Ignore examples are `{ "ignoreDuration": 30 }` (minutes) and
`{ "ignoreWindow": 60, "ignoreCount": 100 }` (count within minutes).
Map these to the connected tool's schema. Assignments may identify a user or
`team:<team-slug>`; resolve the target before applying a bulk change.
