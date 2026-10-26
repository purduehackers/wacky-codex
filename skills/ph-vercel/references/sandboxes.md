# Sandboxes

- Use Vercel Sandbox when remote ephemeral compute is needed; use native Codex execution/worktrees for ordinary local coding.
- Resolve sandbox ownership and timeout before extending, stopping, or running commands. Sandboxes consume billable compute.
- Follow asynchronous command status and logs to completion before reporting success.
- Snapshots are separate retained artifacts; deleting one does not stop a running sandbox.
