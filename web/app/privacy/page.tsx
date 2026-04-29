import { LegalPage } from "@/components/legal-page";
import { siteConfig } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This page explains what information Tone collects, how it is used, and how customers can contact support."
    >
      <>
        <p>
          Tone provides a browser-based writing assistance service for business
          Japanese. We collect the information needed to create accounts,
          provide subscription access, and operate the service.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>Account details such as email address and authentication data.</li>
          <li>Subscription and billing status associated with your account.</li>
          <li>Usage information needed to operate the extension and service.</li>
          <li>Text submitted for rewriting while the service is being used.</li>
        </ul>

        <h2>How We Use Information</h2>
        <ul>
          <li>To authenticate users and provide access to paid features.</li>
          <li>To process subscriptions, renewals, and customer support requests.</li>
          <li>To improve reliability, prevent abuse, and maintain security.</li>
        </ul>

        <h2>Billing Providers</h2>
        <p>
          Subscription payments are processed by Stripe. We do not store full
          payment card details on this website.
        </p>

        <h2>Data Retention</h2>
        <p>
          We keep account and subscription records for as long as needed to
          provide the service, comply with legal obligations, and resolve
          disputes.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy-related questions, contact{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
        </p>
      </>
    </LegalPage>
  );
}
