# 2-hour parallel agent execution plan (setup)

Goal: run the planned work in parallel using multiple “agents” (workstreams) for an allotted **2 hours** wall-clock time.

## Assumptions / non-goals
- This plan does **not** change product requirements; it only operationalizes the work.
- Each agent has an explicit deliverable and an owner (file/function touched).
- If an agent is blocked (build, missing dependency, missing Prisma model), it reports immediately so others can continue.

## Timebox
- Total: **120 minutes**
- Checkpoints:
  - **T+30m**: each agent reports “working / blocked” + first meaningful change committed or staged.
  - **T+75m**: mid-run build/lint check + integration review.
  - **T+110m**: final fix round for build/lint only.
  - **T+120m**: final `npm run build` + `npm run lint`.

## Agents (run simultaneously)

### Agent 1 — Schema + API (Prisma, auth eligibility, points/tokens/spin)
**Deliverables**
- Ensure Prisma models support:
  - `ageVerified` eligibility state (21+ gating)
  - points/tokens/rewards
  - spin wheel result storage
- Implement/verify API endpoints:
  - `/api/spin`
  - `/api/minigame`
  - `/api/points`
  - `/api/products`
- Confirm types compile.

**Where to work (likely)**
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/app/api/**/route.ts`
- `src/lib/db.ts`, `src/lib/auth.ts`

**Stop criteria**
- Routes compile + Prisma generate succeeds.

---

### Agent 2 — Homepage + Global layout (high-end design, delivery-only UI, SEO basics)
**Deliverables**
- Confirm homepage sections are visually aligned with the high-end boutique theme.
- Ensure delivery-only language is present (remove “stop by and see us”).
- Ensure geo/SEO structured data is present.

**Where to work**
- `src/app/page.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`

**Stop criteria**
- No UI regressions; build unaffected.

---

### Agent 3 — Spin Wheel + Age verification (UI + gating + UX)
**Deliverables**
- Ensure `AgeVerification` correctly gates access to:
  - `/spin` page
  - any first-time “agree 21+” experience
- Ensure `src/components/SpinWheel.tsx` works with `/api/spin`.
- Ensure rewards/points UI updates after spin.

**Where to work**
- `src/components/AgeVerification.tsx`
- `src/components/SpinWheel.tsx`
- `src/app/spin/page.tsx`
- `src/components/**` as needed

**Stop criteria**
- No TS/React runtime errors in build.

---

### Agent 4 — Scraper + Product ingestion (scrape and normalize products)
**Deliverables**
- Ensure `scripts/scrape-products.ts` is a valid TS script (no JSX).
- Implement scraping strategy with fallbacks to the correct source domain(s).
- Normalize product fields to match DB/product schema.

**Where to work**
- `scripts/scrape-products.ts`
- `src/lib/db.ts`
- any ingestion helper scripts

**Stop criteria**
- Scraper runs without syntax/type errors.

---

### Agent 5 — SEO + structured data + sitemap/robots (quality)
**Deliverables**
- Ensure metadata, openGraph, keywords, and structured data exist across key routes.
- Add/verify `sitemap.xml` and `robots.txt` behavior.
- Ensure SEO metadata on `/products`, `/blog`, `/forum`, `/drops`.

**Where to work**
- `src/app/**/page.tsx`
- `src/app/**/route.ts` for SEO endpoints if applicable

**Stop criteria**
- No broken URLs; build succeeds.

---

### Agent 6 — Blog + Forum + AI content constraints (no OpenAI; own LLM)
**Deliverables**
- Ensure `/blog` and `/forum` pages render.
- Ensure AI-generated content routes use the **internal LLM only**.
- Ensure seeded categories/threads exist.

**Where to work**
- `src/app/blog/**`
- `src/app/forum/**`
- `src/app/api/blog/**/route.ts`
- `src/app/api/forum/**/route.ts`

**Stop criteria**
- Routes compile; content endpoints respond.

---

## Integration steps (run at the end of the timebox)
1. Merge/stage all agent changes.
2. Run:
   - `npm run lint`
   - `npm run build`
3. If build fails:
   - assign the failure to the owning agent (based on file paths in error output)
   - only that agent fixes within the remaining time.

## Outputs expected at T+120m
- All required routes compile.
- `npm run build` passes.
- `npm run lint` passes.
- A final push is ready for PR review.

## Notes
- Because tooling in this environment can’t truly spawn concurrent processes as separate humans, this document is the operational “agent roster” and task allocation for parallel human/LLM workstreams.

