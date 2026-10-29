# Integrations

- Inspect installed integrations, products, existing resources, and current billing before provisioning a new resource.
- Use an existing suitable resource when requested; otherwise resolve the desired region/plan and authorization for any paid commitment.
- Connect the returned resource to the intended project and environments. Newly supplied environment variables need a new deployment to affect application execution.
- Deleting a backing resource can destroy its data; disconnecting a project and uninstalling an integration are different operations.

For a new store, resolve the installed integration and product, inspect its
plan, provision the resource, then connect it to the intended project.
Connection can populate environment variables; deploy again before expecting
running code to use them. Deleting a resource destroys the underlying store;
uninstalling an integration is a separate action.
