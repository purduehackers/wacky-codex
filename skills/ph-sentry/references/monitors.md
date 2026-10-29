# Monitors

- Inspect the cron monitor schedule, timezone, status, and recent check-ins.
- A missed check-in, reported error, timeout, and still-running job are different conditions.
- Read units for grace margin and maximum runtime before changing them.
- Changing a monitor changes detection, not the actual job schedule; verify both systems when fixing a scheduled task.

`checkin_margin` and `max_runtime` use minutes. A crontab such as `0 * * * *`
and an interval schedule are different representations. Preserve the schedule's
timezone; changing a grace margin should not change cadence or timezone.
