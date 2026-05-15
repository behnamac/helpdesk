# Helpdesk - AI-Powered Ticket Management System

## Project Overview

A ticket management system that uses AI to classify, respond to, and route support tickets. See `project-scope.md` for full requirements and `implementation-plan.md` for phased task breakdown.

## Tech Stack

- **Frontend**: React + TypeScript + Vite (port 5173)
- **Backend**: Express + TypeScript + Node.js (port 3000)
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Claude API (Anthropic)
- **Auth**: Better Auth with database sessions (admin plugin enabled)
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York style)
- **Forms**: react-hook-form + zod

## Project Structure

```
/client                        - React frontend (Vite)
  src/
    components/
      ui/                      - shadcn/ui primitives (button, input, card, …)
      AdminRoute.tsx           - Redirects non-admins to /
      Navbar.tsx               - Sticky nav with user avatar, sign-out, admin links
      ProtectedRoute.tsx       - Redirects unauthenticated users to /login
    lib/
      auth-client.ts           - Better Auth React client (adminClient plugin)
      utils.ts                 - shadcn cn() helper
    pages/
      HomePage.tsx             - Dashboard (authenticated users)
      LoginPage.tsx            - Email/password login form
      UsersPage.tsx            - User list table (admin only)
    index.css                  - Tailwind v4 + shadcn CSS variables (dark theme)

/server                        - Express backend
  src/
    lib/
      auth.ts                  - Better Auth config (admin plugin, trustedOrigins)
      prisma.ts                - Prisma client singleton
    index.ts                   - Express app entry point
  prisma/
    schema.prisma              - DB schema (User, Session, Account, Verification)
```

## Development

```bash
# Start server
cd server && npm run dev

# Start client
cd client && npm run dev
```

The client proxies `/api/*` requests to the server via Vite config.

## Auth & Roles

- Better Auth handles all auth at `/api/auth/*`
- Sign-up is disabled — users are seeded via `server/prisma/seed.ts`
- User roles: `"admin"` | `"agent"` (stored in `user.role`, default `"agent"`)
- The `admin` Better Auth plugin exposes role in sessions and provides `/api/auth/admin/list-users`
- `AdminRoute` guards any route that requires `role === "admin"`
- Trusted origins configured via `TRUSTED_ORIGINS` env var (comma-separated)

## Key Conventions

- Use npm as the package manager
- Use TypeScript throughout
- Use `@/` path alias for `src/` imports on the client
- Use shadcn/ui components for all UI primitives — add with `npx shadcn@latest add <component>`
- After running `npx shadcn@latest add`, move generated files from `client/@/` to `client/src/` (shadcn resolves `@/` as a literal directory in this setup)
- Use react-hook-form + zod for all form validation
- Use context7 MCP server to fetch up-to-date documentation for libraries

## Testing

- Use the `e2e-test-writer` agent to write Playwright end-to-end tests
- Launch it after implementing any new page, user flow, or significant UI feature
- Tests live in `client/e2e/` and use the Playwright config at `client/playwright.config.ts`
- Always cover the golden path and key edge cases (e.g. auth redirects, role-gated routes, form validation errors)
- Seed users (`admin` and `agent` roles) are available via `server/prisma/seed.ts` — use their credentials in test fixtures
