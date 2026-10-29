# Databases

- Retrieve the actual database and data-source schema before querying or writing. Database containers, data sources, and views are distinct identifiers.
- Match property names, IDs, and types exactly. Build filters appropriate to text, number, selection, date, people, or relation fields.
- Use AND across independent constraints and OR for alternatives. Paginate before aggregating.
- Create only the requested schema under the intended parent. Inspect title requirements and current API behavior for renaming or deleting properties.

When the connected tool accepts Notion API filters, a status predicate is
`{ "property": "Status", "status": { "equals": "In Progress" } }`.
Combine predicates with `{ "and": [...] }` or `{ "or": [...] }`.
Use `contains` for multi-select/people/relation membership; use numeric
comparisons for numbers and `before`/`after` for dates. The property type
selects the filter object; a `select` filter cannot query a `status` field.

An API sort is `[{ "property": "Created", "direction": "descending" }]`.
Use the connected tool's actual schema if it takes SQL or another query form.
Do not pass these JSON examples to a Markdown-only tool.
