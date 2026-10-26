# Deployments

- Resolve team, project, deployment ID/URL, Git revision, and target environment before acting.
- Inspect build events and runtime behavior separately. Provider acceptance of a deployment operation is not completion.
- Check rolling-release state before promote/rollback. Follow traffic/alias state until the requested revision is serving and verify the affected URL.
- Cancel only a cancelable deployment. Deleting a deployment is separate from moving production traffic.
