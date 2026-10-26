# Media

- Upload through Payload's current REST/multipart or direct Blob flow. Provide useful alt text and preserve the returned media ID.
- Source, batch ID, and Discord provenance are useful for grouping Hack Night or image-drop uploads. Inspect the current field names rather than using the old bot wrapper's snake_case output.
- Filter by source and batch when inspecting a specific upload group.
- Before deleting an asset, check references: pages using it lose their image. Verify the intended records after upload or deletion.
