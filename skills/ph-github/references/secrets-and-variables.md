# Secrets and variables

- Actions secrets are write-only: list names and metadata, but do not claim to retrieve stored values.
- Use secrets for credentials and variables for non-sensitive configuration. Prefer CLI stdin or secure API bodies over command arguments.
- Resolve repository, environment, or organization scope. Organization visibility and selected-repository access must match the request.
- Verify names, scope, and update metadata without echoing secret values.
