import { LegalPage } from "@/components/legal-page";
import { siteConfig } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This Privacy Policy explains how Tone collects, uses, and safeguards your information when you use the website, Chrome extension, and related services."
    >
      <>
        <p>
          <strong>Last updated:</strong> May 9, 2026
        </p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to Tone (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
          Tone is a text rewriting tool that helps users improve the tone and
          professionalism of their written communication.
        </p>
        <p>
          We respect your privacy and are committed to protecting your personal
          data. This Privacy Policy explains how we collect, use, and safeguard
          your information when you use our website, Chrome extension, and
          related services (collectively, the &quot;Service&quot;).
        </p>

        <h2>2. Information We Collect</h2>
        <h3>2.1 Account Information</h3>
        <p>When you create an account, we may collect:</p>
        <ul>
          <li>Email address</li>
          <li>Authentication data (via Supabase or OAuth providers)</li>
        </ul>

        <h3>2.2 User Content</h3>
        <p>When you use Tone, we may process:</p>
        <ul>
          <li>Text you input for rewriting</li>
          <li>Generated rewritten text</li>
        </ul>
        <p>
          We <strong>do not store your text permanently</strong> unless
          explicitly stated. Text may be temporarily processed to provide the
          Service.
        </p>

        <h3>2.3 Usage Data</h3>
        <p>We may collect:</p>
        <ul>
          <li>Feature usage (e.g., rewrite requests)</li>
          <li>Device/browser type</li>
          <li>Logs for debugging and performance</li>
        </ul>

        <h3>2.4 Payment Information</h3>
        <p>
          Payments are processed by third-party providers such as Stripe. We do{" "}
          <strong>not</strong> store your full payment details.
        </p>

        <h2>3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and operate the Service</li>
          <li>Process and return rewritten text</li>
          <li>Improve performance and user experience</li>
          <li>Prevent abuse and ensure security</li>
          <li>Process payments and manage subscriptions</li>
        </ul>

        <h2>4. Data Processing and Third Parties</h2>
        <p>We may use trusted third-party services, including:</p>
        <ul>
          <li>Supabase (authentication and database)</li>
          <li>AI providers (to generate rewritten text)</li>
          <li>Stripe (payment processing)</li>
        </ul>
        <p>
          These providers may process data only as necessary to perform their
          functions.
        </p>

        <h2>5. Data Retention</h2>
        <p>We retain personal data only as long as necessary to:</p>
        <ul>
          <li>Provide the Service</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes</li>
        </ul>
        <p>
          User-submitted text is typically processed in real-time and not stored
          long-term unless required for debugging or improvement.
        </p>

        <h2>6. Data Security</h2>
        <p>
          We implement reasonable technical and organizational measures to
          protect your data. However, no system is 100% secure.
        </p>

        <h2>7. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access your data</li>
          <li>Request deletion of your data</li>
          <li>Correct inaccurate data</li>
        </ul>
        <p>
          To exercise these rights, contact us at:{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>
        </p>
        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          users by updating the &quot;Last updated&quot; date.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, you can contact
          us at:
        </p>
        <p>
          Email:{" "}
          <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>
        </p>
      </>
    </LegalPage>
  );
}
