import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Privacy" title="Privacy Policy" intro="This policy explains what information High Society MN collects, why it is used, and the choices available to visitors and members.">
      <section><h2>Information we collect</h2><ul><li>Account details such as name, email, password hash, age-verification status, and optional profile information.</li><li>Order, cart, reward, referral, forum, newsletter, and customer-service activity.</li><li>Technical information such as IP address, browser type, device information, timestamps, and security logs.</li><li>Messages sent to Bud Seeker&apos;s Ollama guide.</li></ul></section>
      <section><h2>Location data</h2><p>Bud Seeker asks your browser for permission before reading location. Coordinates are sent to our nearby-search endpoint to locate mapped dispensaries. High Society MN does not need to save precise coordinates to your member profile for this feature to work.</p></section>
      <section><h2>How information is used</h2><p>We use information to provide accounts and orders, secure the service, show nearby retailers, operate rewards and community features, respond to requests, send consented communications, meet legal obligations, and improve site performance.</p></section>
      <section><h2>Service providers</h2><p>Infrastructure and data may be processed by providers supporting hosting, database storage, authentication, payments, mapping, email, analytics, and security. Checkout payment information is handled by the payment provider rather than stored as full card numbers by this application. AI guide prompts are sent to the configured Ollama service to generate a response.</p></section>
      <section><h2>Cookies and local storage</h2><p>The site uses cookies or browser storage for sessions, age-gate state, cart behavior, security, and saved promotional codes. Blocking these technologies may prevent features from working.</p></section>
      <section><h2>Sharing and retention</h2><p>We do not sell personal information. Information may be shared with service providers, regulators, law enforcement, professional advisers, or transaction counterparties when reasonably necessary and legally permitted. Records are retained only as long as needed for the purposes described, legal obligations, disputes, fraud prevention, and security.</p></section>
      <section><h2>Your choices</h2><p>You may unsubscribe through an email message, deny browser location access, or request access, correction, or deletion by emailing <a href="mailto:hello@highsocietymn.com">hello@highsocietymn.com</a>. Some records may be retained where legally required. The service is not directed to anyone under 21.</p></section>
      <section><h2>Security and changes</h2><p>We use reasonable administrative and technical safeguards, but no online system is risk-free. Material updates will be posted here with a new effective date.</p></section>
    </LegalPage>
  );
}
