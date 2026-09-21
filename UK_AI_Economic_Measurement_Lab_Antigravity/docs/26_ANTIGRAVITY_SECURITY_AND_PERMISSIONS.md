# 26 — Antigravity Security and Permissions

## Principle

Grant the agent the minimum access needed for the current phase.

## Phase 0/1 recommended posture

- Project contains this repository only.
- Non-workspace file access disabled.
- Terminal sandbox enabled where available.
- Prefer project-level permissions over global permissions.
- Review requests for system-wide installation, credential access or writes outside the project.
- Do not paste API keys into prompts or commit them to files.

## Network use

Network/browser access is appropriate for verifying and acquiring public official data. Record authoritative source URLs and access dates. The application should not depend on undocumented browser scraping when a published download/API exists.

## Git safety

- Initialise or use Git from the start.
- Make phase-scoped commits.
- Do not force-push or rewrite shared history without explicit instruction.
- Never commit `.env` secrets, local caches or downloaded sensitive data.

## Deployment safety

Public deployment comes after the validation gate. Preview deployments may be used for browser testing, but prototype status and data limitations must remain visible.
