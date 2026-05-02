# LEEL Ride Development Guide

## Stack

- Web: Next.js, React, TypeScript.
- Backend: NestJS, TypeScript.
- Database: PostgreSQL with PostGIS.
- Cache/jobs: Redis.
- Package manager: npm workspaces.

## First Run

```bash
npm install
cp .env.example .env
npm run db:up
npm run dev:api
npm run dev:web
```

Local URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- API docs: `http://localhost:4000/docs`
- Health: `http://localhost:4000/health`

## Workspaces

```text
apps/api       NestJS backend
apps/web       Next.js web app
packages/shared Shared TypeScript constants and domain types
database/init  Local database bootstrap SQL
docs           Product and development documentation
```

## Development Notes

- The API uses TypeORM `synchronize` only outside production for fast early development.
- Production must use migrations before launch.
- PostGIS is enabled locally for future geospatial driver matching and route intelligence.
- Admin, customer, and driver surfaces currently live inside the same Next.js app for speed.
- Driver access will later be protected by role-based login and device policy.

## Brand

- Product name: LEEL Ride.
- Tagline: Your ride, your control.
- Primary color: `#FFC400`.
- Font: Aptos/Inter-style premium interface stack.

## Next Engineering Steps

1. Add database migrations.
2. Add JWT guards and protected routes.
3. Add seed data for 50 launch vehicles.
4. Add realtime WebSocket gateway for trip status and location.
5. Connect web screens to API endpoints.
6. Add payment provider integration.
7. Add map provider integration.
