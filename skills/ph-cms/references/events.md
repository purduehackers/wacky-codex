# Events

- Use the events collection for name, start/end, eventType, location, rich-text description, published, and send/sentAt fields. Check the current collection schema.
- An event needs an explicit end time. Resolve missing times before creation and use America/Indiana/Indianapolis for PH local times.
- Publishing changes public visibility. Setting send to true invokes the real email pipeline; permission to create or publish an event does not imply a send request.
- RSVPs relate to an event. Preserve attendance history by setting unsubscribed when handling an unsubscribe; paginate the full requested attendee set.
- Standalone emails are drafts tied to events. Creating a draft does not send it. On an authorized send, use the correct event or email pipeline and verify its recorded outcome without blindly repeating a timed-out send.

REST list example: `/api/rsvps?where[event][equals]=<event-id>&limit=100&page=1`.
Follow `hasNextPage`; `totalDocs` is a count, not the number returned in this page.
Relationships can return an ID or a populated object depending on `depth`.
For writes, send the related event ID rather than the populated document.

Use `POST /api/emails` to create a draft and `PATCH /api/emails/<id>` to update
it. A draft body contains the event ID, subject, and body; do not set `send`
unless the user requested sending. Read `sentAt` after an uncertain send
before retrying. Updating an event's `published` field does not send mail.
