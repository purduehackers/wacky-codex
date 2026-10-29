# Metrics

- Discover the metrics/datasets currently available in the PH project; do not assume a legacy custom-metrics API is enabled.
- Inspect units and type before choosing aggregation: counts, distributions, gauges, and unique sets answer different questions.
- Bound the window and group/filter by relevant tags. Keep percentile and average interpretations distinct.

Legacy custom metrics use MRI identifiers such as
`c:custom/page_views@none` or `d:custom/response_time@millisecond`.
Types are counter (`c`), distribution (`d`), gauge (`g`), and set (`s`).
These are not span names. Discover the available dataset before choosing
metrics versus span queries; do not claim legacy metrics exist in every project.
