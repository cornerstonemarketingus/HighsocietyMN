# Repository Audit - High Society MN

Date: 2026-07-15
Branch: feature/high-society-platform-rebuild
Scope: Phase Zero only (audit, documentation, health checks)

## 1) Current Technology Stack

- Framework: Next.js 16.2.10 (App Router)
- Runtime/UI: React 19.2.4, TypeScript 5, Tailwind CSS v4
- Authentication: Auth.js (next-auth v5 beta) with Prisma adapter, Credentials + Google providers
- Database: PostgreSQL via Prisma 7.8.0 (`@prisma/adapter-pg`, `pg`)
- Payments: Stripe (`stripe`, `@stripe/stripe-js`)
- Validation: Zod
- Content/AI: Internal OpenAI-compatible endpoint via `LLM_BASE_URL` in API routes
- Deployment: Vercel (`vercel.json`, Next.js build)

## 2) Architecture Snapshot

- Router mode: App Router only (`src/app`), no `src/pages` router present.
- API style: Route handlers under `src/app/api/**/route.ts`.
- Data access: Shared Prisma client in `src/lib/db.ts`.
- Auth/session: Shared in `src/lib/auth.ts`, route protection via `src/proxy.ts`.
- Styling: Utility-first Tailwind usage + custom CSS in `src/app/globals.css`.
- UI reuse: `src/components/ui/*` and domain-level components.

## 3) Route Map

### App routes

- `/`
- `/login`, `/register`
- `/products`, `/products/[slug]`
- `/cart`, `/checkout`
- `/drops`
- `/spin`
- `/blog`, `/blog/[slug]`
- `/forum`, `/forum/new`, `/forum/[slug]`
- `/admin`, `/admin/products`, `/admin/orders`, `/admin/customers`, `/admin/blog`

### API routes

- `/api/auth/[...nextauth]`, `/api/auth/register`
- `/api/products`, `/api/cart`, `/api/orders`
- `/api/stripe/checkout`, `/api/stripe/webhook`
- `/api/blog`, `/api/blog/generate`
- `/api/forum/threads`, `/api/forum/threads/[id]/posts`
- `/api/newsletter/subscribe`
- `/api/spin`, `/api/points`, `/api/minigame`
- `/api/chat`, `/api/drops`

### Route protection currently enforced

- `/admin/**`: authenticated + role `ADMIN` or `STAFF`
- `/checkout/**`, `/orders/**`: authenticated

## 4) Database Models (Current)

Defined in `prisma/schema.prisma`:

- Auth/session: `User`, `Account`, `Session`, `VerificationToken`
- Catalog/commerce: `Category`, `Product`, `CartItem`, `Order`, `OrderItem`, `Review`
- Rewards/spin: `PointTransaction`, `TokenTransaction`, `SpinResult`
- Content/community: `BlogPost`, `ForumCategory`, `ForumThread`, `ForumPost`
- Marketing/events: `NewsletterSubscriber`, `DropEvent`

Migration state:

- Prisma migrations directory is configured but no migration files currently exist.
- Schema application appears to rely on `prisma db push`.

## 5) Existing Feature Inventory

### High Society storefront

- Homepage and premium-style sections are implemented.
- Product listing and product detail pages are implemented.
- Cart and checkout pages exist but are mostly placeholder UI in current state.

### Authentication

- Credentials login and Google OAuth are configured.
- Registration API and pages exist.
- Role-aware session augmentation is implemented.

### Age verification

- Client-side modal exists (`AgeVerification` component) and is mounted globally.
- Current persistence uses `sessionStorage` only.

### Newsletter / lead capture

- Newsletter signup UI and API are implemented.
- Subscriber record + generated discount code are persisted.

### Spin/rewards/minigame

- Spin page, spin UI component, and spin API exist.
- Points/tokens APIs and minigame token loop exist.

### Blog and AI generation

- Public blog index and detail pages exist.
- Admin blog page and generate form exist.
- AI generation route exists and calls internal LLM-compatible endpoint.

### Forum

- Forum list, thread detail, create thread page, and post APIs exist.

### Admin

- Admin dashboard + products/orders/customers/blog modules exist.

### Weed Seeker

- No dedicated Weed Seeker route group or business directory model exists yet.
- One embedded map iframe appears on homepage as a marketing section, not SaaS discovery.

### Email integration

- No provider abstraction for transactional email currently implemented.
- Newsletter API stores data but does not send provider-backed emails.

### Analytics

- No formal analytics provider/event taxonomy instrumentation found.

## 6) Broken or Incomplete Features

- Lint command is broken (`npm run lint` fails due CLI mismatch with current script).
- No test script or first-party test suite is configured.
- Registration age confirmation is not wired to submitted `ageVerified` value.
- Age gate is client-only and not enforced by cookie/server checks.
- Spin eligibility depends on `ageVerified` and `phone`, but registration currently submits `ageVerified: false`.
- Cart page is UI-only empty state while cart API is implemented.
- Checkout page is mostly static placeholder and not wired to live cart/Stripe flow.
- Checkout success URL targets `/orders/[id]` page, but no such app route exists.
- Forum category links include query param, but forum page does not read `searchParams` for filtering.
- `/terms` links are present, but no matching route found.

## 7) Duplicate or Overlapping Logic

- Drop schedule computation duplicated in multiple places (`DropTimer`, `VaultDoors`, drops page/API).
- Product query/filter logic duplicated between products page and products API.
- Styling tokens are not centralized; direct color literals are repeated across pages/components.

## 8) Security and Compliance Concerns

- Age gate uses `sessionStorage` instead of server-readable cookie; easy to bypass and non-persistent across sessions.
- Registration endpoint accepts `ageVerified` from client and is currently out of sync with UI state.
- `POST /api/orders` trusts client-submitted item pricing/totals; server-side recomputation/validation is incomplete.
- Spin API allows unauthenticated usage path (no strict identity requirement), creating abuse risk.
- Spin/newsletter/minigame routes do not show explicit rate-limiting or anti-automation controls.
- Seed script contains hardcoded default admin credentials intended for local setup.
- AI blog generator auto-publishes posts without review/approval workflow.

## 9) Environment Variable Audit

### Declared in `.env.example`

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Referenced in code but missing from `.env.example`

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `LLM_BASE_URL`
- `LLM_MODEL`

## 10) Technical Debt Summary

- No migrations history despite evolving schema.
- Mixed maturity: some backend APIs are real, while core UX surfaces remain placeholder.
- Missing formal test baseline and CI quality gates.
- Inconsistent domain language (delivery-only vs store pickup text in different flows).
- No centralized feature-flag/settings framework for age gate/spin campaigns.

## 11) Recommended Architecture (Reconciled, Not Rewrite)

Adopt incremental modularization around existing code:

- Keep App Router as foundation.
- Introduce `features/*` modules gradually for auth, age-gate, spin, forum, publishing.
- Keep shared primitives in `components/ui/*`, with design tokens extracted from current hardcoded values.
- Introduce server-side policy layer for authz/rate limits/input validation.
- Add provider abstractions for AI generation and email delivery before major expansion.
- Add Weed Seeker as a new bounded module (routes, DB models, services) after stability milestone.

## 12) Files/Areas That Should Remain Untouched Initially

Until stability tasks are complete, avoid sweeping refactors in:

- `src/lib/db.ts` (core DB client initialization)
- `src/lib/auth.ts` and `src/types/next-auth.d.ts` (session/auth contract)
- `prisma/schema.prisma` (except migration-scoped changes)
- `src/app/api/auth/[...nextauth]/route.ts` (Auth.js handler wiring)

These should only be changed with explicit, scoped objectives and tests.

## 13) Build, Lint, Type, Test Health

Executed:

- `npm run lint` -> failed (invalid Next lint invocation behavior with current script)
- `npx tsc --noEmit` -> passed
- `npm test` -> failed (missing script)
- `npm run build` -> passed

## 14) Proposed Implementation Sequence (Phase-Aligned)

1. Stability baseline
   - Fix lint script and add CI-safe quality scripts.
   - Introduce test runner scaffold and first smoke tests.
   - Document env vars and add startup validation.
2. Security hardening of existing flows
   - Server-enforced age gate policy and cookie strategy.
   - Tighten order pricing validation and spin anti-abuse constraints.
3. UX consistency and production readiness
   - Wire cart/checkout to real data paths.
   - Resolve broken links/routes (`/terms`, `/orders/[id]` behavior).
4. Design system consolidation
   - Tokenize spacing/color/typography and standardize shared components.
5. Feature milestones
   - Age/auth refinement -> spin system hardening -> Weed Seeker foundation -> forum expansion -> AI publishing workflow -> rewards ledger -> monetization.
