# Actions

- Resolve repository, workflow, branch/ref, and run. Inspect job and step output for a concrete failure rather than relying on a summary badge.
- Status and conclusion are different: a completed run can succeed, fail, or be canceled.
- A manual dispatch requires workflow_dispatch support plus the intended ref and inputs. Reruns can repeat external side effects.
- Artifacts belong to a specific run and may expire; verify the requested artifact and report access limitations.
