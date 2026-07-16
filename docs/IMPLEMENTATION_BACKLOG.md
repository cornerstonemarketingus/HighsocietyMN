# Implementation Backlog - Phase Zero Output

Date: 2026-07-15
Branch: feature/high-society-platform-rebuild

This backlog is intentionally scoped from current repository findings and ranked by risk.

## Critical

1. Server-side order integrity validation
   - Issue: `POST /api/orders` accepts client-provided item prices and totals.
   - Risk: Price tampering and financial loss.
   - Scope: Recompute totals server-side from product IDs and quantities; reject mismatches.

2. Age-gate enforcement architecture
   - Issue: Age gate is client-only `sessionStorage` and not server-enforced.
   - Risk: Easy bypass; compliance and legal exposure for protected flows.
   - Scope: Add first-party cookie + middleware/server checks for protected cannabis routes/actions.

3. Spin abuse controls and identity policy
   - Issue: Spin route behavior allows non-auth path and lacks explicit anti-abuse controls.
   - Risk: Reward abuse, coupon farming, inconsistent account state.
   - Scope: Enforce user/session policy, add throttling, add campaign-level constraints.

4. Lint baseline broken
   - Issue: `npm run lint` fails due command mismatch.
   - Risk: No reliable static analysis gate.
   - Scope: Fix lint script for Next 16 toolchain and verify locally/CI.

## High

1. Test baseline absent
   - Issue: No `test` script and no first-party test files.
   - Risk: Regressions during milestone work.
   - Scope: Introduce test runner (unit + API integration smoke) and CI command.

2. Env configuration drift
   - Issue: Missing documented vars used by code (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `LLM_BASE_URL`, `LLM_MODEL`).
   - Risk: Broken auth/AI behavior across environments.
   - Scope: Update `.env.example` and add startup validation.

3. Registration age capture mismatch
   - Issue: Register page submits `ageVerified: false` despite 21+ checkbox UI.
   - Risk: Users cannot satisfy downstream spin eligibility; data inconsistency.
   - Scope: Correct form wiring and validation semantics.

4. Missing route/link integrity
   - Issue: `/terms` linked but missing; Stripe success URL points to `/orders/[id]` route not present.
   - Risk: Broken UX and checkout completion confusion.
   - Scope: Add missing routes or update URLs consistently.

5. AI auto-publish without review stage
   - Issue: Blog generation route immediately publishes content.
   - Risk: Compliance and quality failure.
   - Scope: Move to draft/review-required workflow.

## Medium

1. Cart and checkout UX not integrated end-to-end
   - Issue: Pages are largely placeholder while APIs exist.
   - Scope: Connect cart state, summary, and payment initiation flow.

2. Forum category filter mismatch
   - Issue: Links pass category query but page does not apply filter.
   - Scope: Implement `searchParams` parsing and filtered queries.

3. Duplicate drop-schedule logic
   - Issue: Date logic repeated across component/API/page.
   - Scope: Extract shared drop schedule utility.

4. Design token fragmentation
   - Issue: Repeated hardcoded palette and spacing.
   - Scope: Introduce centralized design tokens with gradual adoption.

5. No analytics event taxonomy implementation
   - Issue: Required product events are not instrumented.
   - Scope: Define event schema and minimal event capture pipeline.

## Low

1. Copy/experience inconsistencies
   - Delivery-only statements conflict with store pickup language in some surfaces.

2. Seed script local defaults
   - Hardcoded admin seed credentials are acceptable for local dev but should be clearly gated/documented.

3. Color/brand inconsistency
   - Blue accents and amber accents mixed in key nav/brand surfaces; move toward unified premium system.

## Existing Systems To Reuse (Do Not Rewrite)

- Auth.js + Prisma adapter core session/auth stack
- Prisma schema baseline models for commerce/blog/forum/rewards primitives
- API route structure under `src/app/api`
- Shared UI primitives in `src/components/ui`
- Admin route scaffolding and role-protection middleware

## Smallest Safe First Implementation Task (Recommended)

Task: Repair and lock the quality baseline without changing product behavior.

Deliverables:

1. Fix `npm run lint` command compatibility for current Next.js version.
2. Add explicit scripts for:
   - `typecheck` (`tsc --noEmit`)
   - `test` (initial runner scaffold, may include placeholder smoke test)
3. Add CI-ready verification command (e.g., `npm run verify` chaining lint/typecheck/test/build where appropriate).
4. Update docs with exact local/CI commands.

Why this first:

- Lowest-risk, high-leverage foundation for all subsequent milestones.
- Enables safe incremental delivery and objective regression checks before touching age-gate/spin/auth hardening.

## Deferred (Explicitly Not Started in Phase Zero)

- Weed Seeker SaaS map/search/business profiles
- Community moderation system expansion
- AI editorial workflow overhaul
- Rewards ledger redesign
- Subscription monetization
