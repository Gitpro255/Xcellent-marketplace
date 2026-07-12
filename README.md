# Xcellent

A real, working marketplace: Next.js 14 (App Router) + PostgreSQL (Prisma) + Resend (email verification) + Paystack (payments).

## What's actually real here

- **Auth** — signup with hashed passwords (bcrypt), email verification with a 6-digit code sent via Resend, sessions stored as signed JWT cookies (`jose`).
- **Database** — every product, order, order item, review and payout is a real Postgres row via Prisma. No mock data in the app itself (seed data is separate, see below).
- **Payments** — checkout re-prices the cart server-side (never trusts client-sent prices), creates a `PENDING` order, and starts a real Paystack transaction. A webhook (`/api/webhooks/paystack`) verifies the payment directly with Paystack's API and only then marks the order paid and decrements stock.
- **Bank transfer / cash on delivery** — treated as "awaiting shipment" immediately, since there's no gateway round-trip. In a real deployment you'd want a manual "confirm transfer received" step for bank transfers before you ship.

## 1. Install

```bash
npm install
```

## 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Free Postgres from [Neon](https://neon.tech) or [Supabase](https://supabase.com), or a local Postgres install |
| `SESSION_SECRET` | Run `openssl rand -base64 32` |
| `RESEND_API_KEY` | [resend.com](https://resend.com) — free tier is enough to start |
| `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | [Paystack dashboard](https://dashboard.paystack.com/#/settings/developer) — use the **test** keys while building |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally |

## 3. Set up the database

```bash
npx prisma migrate dev --name init
npm run seed
```

This creates all the tables and seeds 7 Nigerian sellers with 14 products across categories (Home & Craft, Electronics, Accessories, Food, Wellness, Outdoors, Apparel). It also creates:

- A demo **buyer**: `demo@example.com` / `password123`
- Demo **sellers**, e.g. `timber@example.com` / `password123` (see `prisma/seed.ts` for the full list)

Both are pre-verified so you can log straight in without going through the email step.

## 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 5. Test a real payment

Paystack test cards (with test keys configured):

- Card: `4084 0840 8408 4081`, any future expiry, CVV `408`, PIN `0000`, OTP `123456`

## 6. Wire up the Paystack webhook (for local testing)

Paystack needs to reach your webhook over the internet. Use the Paystack CLI or a tunnel:

```bash
npx paystack-cli listen --forward-to localhost:3000/api/webhooks/paystack
```

Or in production, set the webhook URL in the Paystack dashboard to:
`https://yourdomain.com/api/webhooks/paystack`

## Project structure

```
src/
  app/
    page.tsx                 # Landing/gate screen (signup, login, guest)
    (auth)/signup, login, verify/
    (site)/                  # Everything with the header+footer chrome
      browse/, product/[id]/, cart/, checkout/, orders/, seller/
      info/, contact/, terms/, privacy/
    api/
      auth/                  # register, verify, login, logout, me
      products/               # list/create, [id]
      seller/                 # this seller's products & incoming orders
      orders/                 # this buyer's order history
      checkout/                # creates order + starts Paystack transaction
      webhooks/paystack/       # confirms payment, decrements stock
  lib/                        # prisma client, auth/session helpers, email, paystack
  components/                 # Header, Footer, cart context, theme toggle, etc.
prisma/
  schema.prisma
  seed.ts
```

## What's still worth doing before a real launch

- **Reviews & disputes UI** — the data model supports them (`Review`, `Dispute`), but there's no UI to submit a review or open a dispute yet.
- **Seller payouts** — the `Payout` model exists but nothing runs the actual payout job. Paystack Transfers (or Paystack Subaccounts, which split each payment automatically) is the natural next step so sellers get paid without you manually wiring money.
- **Image uploads** — products use an emoji + color placeholder instead of real photos. Add S3 or Cloudflare R2 + a signed upload flow when you're ready for real product photography.
- **Rate limiting** on `/api/auth/*` to slow down brute-force login/signup attempts.
- **Admin tooling** for resolving disputes and moderating listings — there's a `Role.ADMIN` in the schema but no admin UI yet.
