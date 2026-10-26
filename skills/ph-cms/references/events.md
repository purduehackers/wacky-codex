# Events

- Use the events collection for name, start/end, eventType, location, rich-text description, published, and send/sentAt fields. Check the current collection schema.
- An event needs an explicit end time. Resolve missing times before creation and use America/Indiana/Indianapolis for PH local times.
- Publishing changes public visibility. Setting send to true invokes the real email pipeline; permission to create or publish an event does not imply a send request.
- RSVPs relate to an event. Preserve attendance history by setting unsubscribed when handling an unsubscribe; paginate the full requested attendee set.
- Standalone emails are drafts tied to events. Creating a draft does not send it. On an authorized send, use the correct event or email pipeline and verify its recorded outcome without blindly repeating a timed-out send.
