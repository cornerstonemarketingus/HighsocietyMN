# Launch Readiness

This list separates work required before public sales from improvements that can follow launch.

## Current validation status

- [x] High Society MN: TypeScript and targeted lint checks pass; 27 automated tests pass.
- [x] BudSeeker: TypeScript and targeted lint checks pass; 15 automated tests pass.
- [ ] Run fresh production builds in Vercel or a clean local worker before the final release. The current local build runner stalled without compiler output, so it is not being counted as a pass.

## Must complete before taking orders

- [ ] Verify Stripe production keys, webhook signing secret, and allowed checkout domains in High Society MN.
- [ ] Confirm the Neon production connection string is set in Vercel and run a real product, cart, checkout, and order-status smoke test.
- [ ] Publish the current High Society catalog only after stock, prices, product photos, and strain details are confirmed by the shop.
- [ ] Set the production `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and approved email/account flow.
- [ ] Confirm age-gate policy, delivery terms, tax treatment, product claims, and local/state licensing requirements with qualified counsel.
- [ ] Set `OLLAMA_BASE_URL` or the approved hosted model provider for the budtender, then test a customer conversation in production.
- [ ] Configure a monitored production email address for order, customer-support, and sponsor inquiries.
- [ ] Set Vercel cron secrets and test catalog-sync and blog-publish endpoints with a non-public manual trigger.

## BudSeeker operating checklist

- [ ] Add `BUDSEEKER_DATABASE_URL` and the operations access secret to the BudSeeker production project.
- [ ] Schedule the retailer-audit cron and confirm failed source refreshes alert an operator.
- [ ] Validate a sample of RISE, medical, adult-use, and social-equity listings against Minnesota OCM data monthly.
- [ ] Set sponsor pricing, creative specifications, insertion orders, and review rules before accepting paid placements.
- [ ] Keep sponsor labels visible and preserve organic ranking independent of sponsorship.

## Post-launch improvements

- [ ] Add real retailer hours, menus, and inventory integrations where partners provide approved feeds.
- [ ] Add image review tooling for catalog images that fail or render below quality standards.
- [ ] Add customer support analytics, conversion events, and an incident-response runbook.
- [ ] Add accessibility review for keyboard navigation, reduced motion, and screen-reader labels.
- [ ] Add automated visual regression checks for desktop and mobile landing pages.
