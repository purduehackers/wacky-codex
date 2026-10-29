# Rollouts

- Inspect plan support, rolling-release configuration, the canary deployment, and current traffic split.
- Advancing a stage moves live traffic. Completing a rollout sends all traffic to the canary; verify health and final routing.
- Removing rollout configuration changes future release behavior.
- Deployment checks have configured definitions and per-deployment runs. Inspect the runs tied to the intended revision.

Stage advancement needs the intended canary deployment and next stage index.
Completing a rollout sends all traffic to the canary; removing rollout
configuration changes how future deployments ship. Verify effective aliases
and traffic after a successful request, since promotion can be asynchronous.
