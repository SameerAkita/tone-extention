import { LegalPage } from "@/components/legal-page";
import { siteConfig } from "@/lib/site";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These Terms of Service explain the rules for using Tone, including subscriptions, acceptable use, payments, and limitations."
    >
      <>
        <p>
          <strong>Last updated:</strong> May 9, 2026
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Tone (&quot;we&quot;, &quot;our&quot;, or
          &quot;us&quot;), including our website, Chrome extension, and related
          services (the &quot;Service&quot;), you agree to be bound by these
          Terms of Service.
        </p>
        <p>If you do not agree, you may not use the Service.</p>

        <h2>2. Description of Service</h2>
        <p>
          Tone is a tool that rewrites and enhances user-provided text to
          improve tone, clarity, and professionalism.
        </p>
        <p>
          We reserve the right to modify, suspend, or discontinue the Service
          at any time without notice.
        </p>

        <h2>3. Eligibility</h2>
        <p>
          You must be at least 18 years old (or the age of majority in your
          jurisdiction) to use the Service.
        </p>

        <h2>4. User Accounts</h2>
        <p>You are responsible for:</p>
        <ul>
          <li>Maintaining the confidentiality of your account</li>
          <li>All activity under your account</li>
        </ul>
        <p>
          You agree to provide accurate and complete information when creating
          an account.
        </p>

        <h2>5. Acceptable Use</h2>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Violate any laws or regulations</li>
          <li>Generate or distribute harmful, abusive, or illegal content</li>
          <li>Infringe on intellectual property rights</li>
          <li>Attempt to reverse engineer, exploit, or disrupt the Service</li>
          <li>Use the Service for spam or deceptive practices</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these rules.
        </p>

        <h2>6. User Content</h2>
        <p>You retain ownership of the text you submit (&quot;User Content&quot;).</p>
        <p>
          By using the Service, you grant us a limited, non-exclusive license
          to process your content solely to provide the Service.
        </p>
        <p>We do not claim ownership of your content.</p>

        <h2>7. AI-Generated Content Disclaimer</h2>
        <p>Tone uses artificial intelligence to generate rewritten text.</p>
        <p>We do not guarantee:</p>
        <ul>
          <li>Accuracy</li>
          <li>Reliability</li>
          <li>Suitability for any specific purpose</li>
        </ul>
        <p>
          You are solely responsible for reviewing and approving all generated
          content before use.
        </p>

        <h2>8. Payments and Subscriptions</h2>
        <h3>8.1 Billing</h3>
        <p>Certain features require a paid subscription.</p>
        <p>
          Payments are processed through third-party providers such as Stripe.
        </p>

        <h3>8.2 Subscription Terms</h3>
        <ul>
          <li>Subscriptions may be billed monthly or annually</li>
          <li>You authorize recurring charges unless canceled</li>
        </ul>

        <h3>8.3 Cancellation</h3>
        <p>You may cancel your subscription at any time.</p>
        <p>
          Your subscription will remain active until the end of the billing
          period.
        </p>

        <h2>9. Refund Policy</h2>
        <p>
          All payments are <strong>non-refundable</strong>, except where
          required by applicable law.
        </p>
        <p>We do not provide refunds for:</p>
        <ul>
          <li>Partial billing periods</li>
          <li>Unused time</li>
          <li>Accidental purchases</li>
        </ul>
        <p>
          You are responsible for canceling your subscription before the next
          billing cycle.
        </p>

        <h2>10. Intellectual Property</h2>
        <p>
          All rights, title, and interest in the Service (excluding User
          Content) are owned by Tone.
        </p>
        <p>
          You may not copy, modify, distribute, or create derivative works
          without permission.
        </p>

        <h2>11. Termination</h2>
        <p>
          We may suspend or terminate your access to the Service at any time if
          you violate these Terms.
        </p>
        <p>You may stop using the Service at any time.</p>

        <h2>12. Disclaimer of Warranties</h2>
        <p>The Service is provided &quot;as is&quot; and &quot;as available.&quot;</p>
        <p>We make no warranties regarding:</p>
        <ul>
          <li>Availability</li>
          <li>Accuracy</li>
          <li>Performance</li>
        </ul>
        <p>Use of the Service is at your own risk.</p>

        <h2>13. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Tone shall not be liable for:</p>
        <ul>
          <li>Indirect, incidental, or consequential damages</li>
          <li>Loss of data, profits, or business opportunities</li>
        </ul>
        <p>
          Our total liability shall not exceed the amount you paid us in the
          past 12 months.
        </p>

        <h2>14. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Tone from any claims,
          damages, or liabilities arising from:
        </p>
        <ul>
          <li>Your use of the Service</li>
          <li>Your violation of these Terms</li>
        </ul>

        <h2>15. Changes to These Terms</h2>
        <p>We may update these Terms from time to time.</p>
        <p>
          Continued use of the Service constitutes acceptance of the updated
          Terms.
        </p>

        <h2>16. Governing Law</h2>
        <p>
          These Terms shall be governed by the laws of Japan,
          without regard to conflict of law principles.
        </p>

        <h2>17. Contact</h2>
        <p>If you have any questions, contact us at:</p>
        <p>
          Email:{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>
        </p>
      </>
    </LegalPage>
  );
}
