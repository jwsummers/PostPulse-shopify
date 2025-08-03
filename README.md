# PostPulse — Shopify Post-Purchase Pulse

A focused Shopify app that asks **one low-friction question** on the **post-purchase page** (“How did you hear about us?”) and stores the response for simple automation and insight.

- **Checkout surface:** `Checkout::PostPurchase::Render`
- **Stack:** Remix (embedded app), Shopify CLI, Prisma + Neon Postgres, Vercel (serverless), Post-purchase UI Extension

---

## ✨ Features (v1)

- One-tap post-purchase micro-survey
- Writes responses to Postgres (Neon) with retry-safe upsert
- Helper routes for quick verification (`/api/db-test`, `/api/last-response`)
- Safe CORS for extension → API calls
- Minimal Admin UI scaffold (Remix, Polaris-ready)

Planned next: CSV export, basic charts, Shopify Flow templates.

---

## 🧰 Tech & Requirements

- **Node:** 20.x recommended (works with Prisma 6)
- **Shopify:** Partner account + **development store**
- **Datastore:** Neon Postgres (Free)
- **Deploy:** Vercel (Hobby)
- **CLI:** `@shopify/cli`, `npm` or `pnpm`

---

## ⚙️ Environment Variables

Create `.env` locally and mirror these in Vercel (same names/values):

```dotenv
# Shopify app
SHOPIFY_API_KEY=<from Partner Dashboard / App setup>
SHOPIFY_API_SECRET=<from Partner Dashboard / App setup>

# App URL (public base URL of your deployed app; no trailing slash)
APP_URL=https://postpulse-yourapp.vercel.app
# (Some scaffolds use SHOPIFY_APP_URL; if your code checks it, add it too)
SHOPIFY_APP_URL=https://postpulse-yourapp.vercel.app

# OAuth scopes (match shopify.app.toml -> [access_scopes])
SCOPES=write_products

# Prisma / Neon
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"

# Session crypto
SESSION_SECRET=<random 32-64 char string>
```
