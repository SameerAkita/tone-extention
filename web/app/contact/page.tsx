import { LegalPage } from "@/components/legal-page";
import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      description="Customers can use the information below for support, billing, privacy, and account questions."
    >
      <>
        <h2>Support Email</h2>
        <p>
          Contact us at{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
        </p>

        <h2>Support Topics</h2>
        <ul>
          <li>Account access and login issues</li>
          <li>Subscription billing and cancellation questions</li>
          <li>Refund reviews</li>
          <li>Privacy and data requests</li>
        </ul>

        <h2>Availability</h2>
        <p>
          We aim to respond to customer support messages as quickly as possible
          during normal business operations.
        </p>
      </>
    </LegalPage>
  );
}
