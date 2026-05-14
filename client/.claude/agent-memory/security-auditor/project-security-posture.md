---
name: project-security-posture
description: Overall security posture of the helpdesk app as of the 2026-05-14 audit — stack, auth library, key risks
metadata:
  type: project
---

Stack: React + Vite (port 5173) / Express + TypeScript (port 3000) / PostgreSQL + Prisma ORM / Better Auth v1.6.11.

**Why:** Initial full security audit performed 2026-05-14 covering auth, CORS, headers, secrets, authorization.

**How to apply:** Use this as baseline for incremental audits. Re-audit when new routes or AI integration is added.

Key risk areas identified:
- CORS: `app.use(cors())` with no origin restrictions — all origins allowed
- No Helmet.js — zero security headers (CSP, HSTS, X-Frame-Options, etc.)
- Admin seed password `password123` in `.env` — trivially guessable, never rotated
- Better Auth rate limiting only active when `NODE_ENV=production` — disabled in dev/staging if env not set
- No Express body size limit configured (default 100 KB for JSON, but no explicit enforcement)
- `disableSignUp: true` is server-enforced by Better Auth (confirmed in source), not a bypass risk
- Admin plugin endpoints (`/api/auth/admin/*`) are server-side protected by Better Auth `adminMiddleware` checking session role
- Client-side `AdminRoute` check is defence-in-depth only; actual enforcement is server-side via Better Auth
- Better Auth CSRF protection via origin header validation when cookies are present (confirmed in source)
- Session cookies: `httpOnly: true`, `sameSite: lax` by default; `secure` flag only set when HTTPS detected or `NODE_ENV=production`
- `.env` is correctly gitignored and was never committed to git history

See [[vulnerability-inventory]] for the full list of findings.
