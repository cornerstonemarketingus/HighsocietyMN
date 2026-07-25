import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Minnesota Cannabis Compliance" };

export default function CompliancePage() {
  return (
    <LegalPage eyebrow="21+ · Minnesota" title="Cannabis Compliance" intro="High Society MN is designed to support lawful adult access, accurate disclosures, responsible use, and licensed cannabis activity in Minnesota. This page is a public-facing policy, not legal advice.">
      <section><h2>Age and identity</h2><p>Cannabis content and regulated products are for adults 21+. Government-issued identification and any additional eligibility checks must be completed before a regulated transaction, pickup, delivery, or transfer. We do not knowingly serve minors or visibly intoxicated persons.</p></section>
      <section><h2>Licensing and lawful sale</h2><p>Cannabis may be sold, delivered, or otherwise commercially distributed only by businesses holding the licenses and endorsements required for that activity. Product testing, packaging, labeling, tracking, transaction limits, delivery procedures, and local requirements apply as required by Minnesota law.</p></section>
      <section><h2>No gifting or donation workaround</h2><p>This site does not facilitate “donation,” membership-fee, merchandise, token, or other payment structures intended to disguise a cannabis sale. Minnesota permits limited genuine personal gifts between adults 21+ when there is no remuneration, but separately prohibits a seller of goods or services from using cannabis as a sample or promotional gift. Any personal transfer is independent of High Society MN and must comply with all current limits and restrictions.</p></section>
      <section><h2>Rewards</h2><p>Site points and game tokens are free promotional features, have no cash value, cannot be purchased or transferred, and are not redeemable for cannabis or THC products. No purchase is required to use an eligible free-play feature. Cannabis is not awarded as a prize.</p></section>
      <section><h2>Responsible use</h2><ul><li>Keep cannabis secured, in its compliant packaging, and away from children and pets.</li><li>Do not drive, operate machinery, or perform dangerous activities while impaired.</li><li>Do not transport cannabis across state lines or use it where prohibited.</li><li>Follow product labels and seek professional medical advice for health questions.</li></ul></section>
      <section><h2>Questions or concerns</h2><p>Report a product, age-access, privacy, or compliance concern to <a href="mailto:hello@highsocietymn.com">hello@highsocietymn.com</a>. Regulatory information is available from the <a href="https://mn.gov/ocm/" target="_blank" rel="noreferrer">Minnesota Office of Cannabis Management</a> and the <a href="https://www.revisor.mn.gov/statutes/cite/342/full" target="_blank" rel="noreferrer">Minnesota Revisor of Statutes</a>.</p></section>
    </LegalPage>
  );
}
