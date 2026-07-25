import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <LegalPage eyebrow="Our story" title="A more thoughtful Minnesota cannabis experience." intro="High Society MN brings together a curated local catalog, member community, educational journal, rewards, and Bud Seeker discovery tools in one polished 21+ experience.">
      <section><h2>What we are building</h2><p>Our goal is to make product discovery clear, discreet, and useful. Members can browse the current catalog, learn about formats and responsible use, participate in the lounge, and locate nearby licensed dispensaries through Bud Seeker.</p></section>
      <section><h2>Our standards</h2><ul><li>Adults 21+ only, with identity and age verification where required.</li><li>Clear product information without medical promises or pressure.</li><li>Respect for privacy, consent, and responsible consumption.</li><li>Sales, pickup, and delivery only when performed by a properly authorized business and permitted by law.</li></ul></section>
      <section><h2>Independent discovery</h2><p>Bud Seeker uses public map data to help visitors find nearby cannabis retailers. A listing is informational and is not an endorsement, guarantee of licensure, or representation of inventory. Confirm details directly with each retailer.</p></section>
      <section><h2>Contact</h2><p>Questions about the site, catalog, privacy, or accessibility may be sent to <a href="mailto:hello@highsocietymn.com">hello@highsocietymn.com</a>.</p></section>
    </LegalPage>
  );
}
