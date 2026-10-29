# Pages

- Resolve the intended parent: a page for a subpage or the actual data source for a database row.
- Inspect the schema before setting properties. Resolve people and relation IDs from real records.
- Use Notion-flavored Markdown through the provider where supported. Targeted edits should preserve unrelated content.
- Clearing a property, replacing a page body, and archiving a page are distinct operations; use the requested one and verify the returned page.

For tools that accept raw Notion property objects:

| Type     | Value                                              |
| -------- | -------------------------------------------------- |
| Title    | `{ "title": [{ "text": { "content": "Name" } }] }` |
| Select   | `{ "select": { "name": "Option" } }`               |
| Status   | `{ "status": { "name": "In Progress" } }`          |
| Date     | `{ "date": { "start": "2026-10-29" } }`            |
| People   | `{ "people": [{ "id": "user-id" }] }`              |
| Relation | `{ "relation": [{ "id": "page-id" }] }`            |

Clear a select with `{ "select": null }` and rich text with
`{ "rich_text": [] }`. These are API shapes, not interchangeable with the
provider's simplified property inputs. Inspect its schema before writing.
