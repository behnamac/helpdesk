---
name: auth-architecture
description: Better Auth v1.6.11 session/cookie/CSRF/rate-limit defaults confirmed from source inspection during 2026-05-14 audit
metadata:
  type: project
---

**Confirmed from Better Auth dist source (node_modules), 2026-05-14:**

- Password hashing: `node:crypto scrypt` (Node.js native, secure)
- Session cookie flags: `httpOnly: true`, `sameSite: "lax"`, `secure` flag only added when protocol is HTTPS or `NODE_ENV=production`
- CSRF protection: origin header validation on all non-GET/OPTIONS/HEAD requests that include cookies — enforced by `originCheckMiddleware` in Better Auth. `trustedOrigins` env var used correctly.
- Rate limiting: `enabled: options.rateLimit?.enabled ?? isProduction` — disabled unless `NODE_ENV=production`. Default window=10s, max=100 requests, in-memory storage. Auth paths (sign-in, sign-up, change-password) are rate-limited.
- Admin plugin routes (`/api/auth/admin/*`): protected by `adminMiddleware` which calls `getSessionFromCtx` and throws 401 if no session; then `hasPermission` checks `session.user.role` against `defaultRoles` (admin role has full permissions). Server-side enforcement is real, not just client-side.
- `disableSignUp: true` throws `BAD_REQUEST` at the `signUpEmail` route handler — server-enforced.
- Impersonation endpoint (`/admin/impersonate-user`) is available but requires admin role.

**Why:** These were verified by reading Better Auth dist source to avoid assumptions about library behavior.

**How to apply:** When assessing auth-related risk, trust these defaults. Flag any config that overrides them (e.g., `skipCSRFCheck`, `disableOriginCheck`).
