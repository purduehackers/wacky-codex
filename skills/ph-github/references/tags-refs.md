# Tags refs

- Resolve the intended commit and exact branch/tag before changing a ref.
- GitHub's create-ref API uses refs/heads/... or refs/tags/...; update/delete endpoints use the corresponding path without refs/.
- A forced ref update rewrites remote history. Do not introduce force as a workaround for a rejected normal push.
- The default branch has additional deletion restrictions. A tag and a release are separate objects.
