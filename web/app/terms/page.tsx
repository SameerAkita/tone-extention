import { LegalPage } from "@/components/legal-page";
import { siteConfig } from "@/lib/site";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These terms describe what customers receive when subscribing to Tone and the rules for using the service."
    >
      <>
        <p>
          Tone is a digital subscription service that provides access to a
          browser extension and AI-assisted rewriting features for business
          Japanese.
        </p>

        <h2>Service Access</h2>
        <p>
          After signup and successful payment, customers receive access to Tone
          immediately through their account and supported extension features.
        </p>

        <h2>Subscription Billing</h2>
        <p>
          Paid plans renew automatically on the billing interval selected at
          checkout unless canceled before the next renewal date.
        </p>

        <h2>Acceptable Use</h2>
        <p>
          Customers may not use the service for unlawful activity, abuse,
          reverse engineering, or actions that interfere with normal operation.
        </p>

        <h2>Service Changes</h2>
        <p>
          We may update pricing, features, or plan structure from time to time.
          Material changes will be reflected on the website before they apply to
          new purchases.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
        </p>
      </>
    </LegalPage>
  );
}
