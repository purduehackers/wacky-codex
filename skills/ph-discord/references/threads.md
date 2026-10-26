# Threads

- `list_threads` returns active guild threads. `list_archived_threads` takes a channel and visibility; paginate with archive timestamps, or thread IDs for joined-private threads.
- Use `create_thread` for standalone public/private threads or `create_thread_from_message` for a reply thread. Select the supported auto-archive duration.
- Threads cannot contain other threads. Archiving hides a thread from active lists while preserving its content.
- Deleting a thread removes its messages. Locking, archiving, and deleting are separate operations.
