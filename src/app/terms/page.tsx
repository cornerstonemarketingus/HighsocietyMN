import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" intro="These terms govern use of the High Society MN website, member features, product catalog, Bud Seeker, and related services. By using the site, you agree to them.">
      <section><h2>Eligibility</h2><p>You must be at least 21 years old and legally permitted to access cannabis-related content. You agree to provide accurate information and present valid government-issued identification whenever required. Age-gate confirmation alone does not replace transaction-level verification.</p></section>
      <section><h2>Lawful services only</h2><p>Products, pickup, delivery, promotions, and other regulated activity are available only where authorized and through businesses holding all required licenses or endorsements. No website statement overrides Minnesota law, local requirements, possession limits, or regulator instructions.</p></section>
      <section><h2>Catalog and orders</h2><p>Catalog information, availability, potency, images, pricing, taxes, and service windows may change. An order submission is a request and may be declined or adjusted for inventory, verification, safety, legal, geographic, or compliance reasons. Final product labels and test information control over website descriptions.</p></section>
      <section><h2>Rewards and games</h2><p>Points and tokens are promotional account features with no cash value. They may not be sold, transferred, purchased, or redeemed for cannabis or THC products. Game outcomes do not award cannabis. We may change or discontinue rewards to comply with law or prevent abuse. The email signup wheel is limited to eligible adults and any offer remains subject to applicable law and checkout validation.</p></section>
      <section><h2>No medical advice</h2><p>Product descriptions and AI-generated guidance are educational only. They do not diagnose, treat, cure, or prevent a condition and are not a substitute for advice from a qualified healthcare professional. Do not drive or operate machinery while impaired.</p></section>
      <section><h2>Acceptable use</h2><ul><li>Do not use the service for unlawful resale, diversion, fraud, harassment, scraping abuse, or access by a minor.</li><li>Do not interfere with security, accounts, payments, inventory, or site operation.</li><li>Do not submit unlawful, infringing, misleading, or harmful forum content.</li></ul></section>
      <section><h2>Disclaimers and limitation</h2><p>The site is provided on an “as available” basis to the extent permitted by law. Maps, AI responses, community posts, and third-party links may be incomplete or inaccurate. To the extent permitted by law, High Society MN is not liable for indirect, incidental, special, or consequential loss arising from site use.</p></section>
      <section><h2>Changes and contact</h2><p>We may update these terms by posting a revised date. Continued use after an update means acceptance. Questions may be sent to <a href="mailto:hello@highsocietymn.com">hello@highsocietymn.com</a>. Minnesota law governs these terms except where consumer law requires otherwise.</p></section>
    </LegalPage>
  );
}
