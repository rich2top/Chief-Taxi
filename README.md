# LEEL Ride Platform

**LEEL Ride** is a web-first EV taxi operations platform for Abuja.

Tagline: **Your ride, your control.**

## Apps

- `apps/api` - NestJS backend for auth, bookings, dispatch, trips, safety, fleet, and payments.
- `apps/web` - Next.js web app for the admin dashboard, customer PWA, and driver console.
- `packages/shared` - Shared brand constants, roles, ride classes, and trip status types.

## Recommended Start Order

1. Build backend foundation.
2. Build admin web app.
3. Build driver console.
4. Build customer web/PWA.
5. Add payments, realtime tracking, and safety workflows.
6. Later build Android/iOS apps on the same backend.

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev:api
npm run dev:web
```

Default local URLs:

- Web app: `http://localhost:3000`
- API: `http://localhost:4000`
- API health: `http://localhost:4000/health`

## Documentation

- Product blueprint: `docs/LEEL_Ride_Platform_Documentation.docx`
- Development guide: `docs/DEVELOPMENT.md`

## Brand Direction

- Name: LEEL Ride
- Tagline: Your ride, your control.
- Primary color: Taxi yellow `#FFC400`
- Text color: Graphite ink `#0B1020`
- Background: Clean stone `#F5F6F8`
- Accent: Route blue `#2F6BFF`
- Font: Aptos/Inter-style premium interface stack
