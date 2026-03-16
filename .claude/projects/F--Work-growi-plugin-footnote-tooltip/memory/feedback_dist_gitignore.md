---
name: dist directory must be committed
description: Growi plugins use dist/ for distribution, so it must NOT be in .gitignore
type: feedback
---

Do not add `dist/` to `.gitignore` in Growi plugin projects.

**Why:** Growi plugins distribute their built output via `dist/` directory — it needs to be committed to the repository for the plugin to work.

**How to apply:** When creating `.gitignore` for Growi plugin projects, only ignore `node_modules/`, not `dist/`.
