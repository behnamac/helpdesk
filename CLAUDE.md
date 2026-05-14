# Helpdesk - AI-Powered Ticket Management System

## Project Overview

A ticket management system that uses AI to classify, respond to, and route support tickets. See `project-scope.md` for full requirements and `implementation-plan.md` for phased task breakdown.

## Tech Stack

- **Frontend**: React + TypeScript + Vite (port 5173)
- **Backend**: Express + TypeScript + Node.js (port 3000)
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Claude API (Anthropic)
- **Auth**: Database sessions

## Project Structure

```
/client   - React frontend (Vite)
/server   - Express backend
```

## Development

```bash
# Start server
cd server && npm run dev

# Start client
cd client && npm run dev
```

The client proxies `/api/*` requests to the server via Vite config.

## Key Conventions

- Use npm as the package manager
- Use TypeScript throughout
- Use context7 MCP server to fetch up-to-date documentation for libraries
