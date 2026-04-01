import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Privacy Policy — SonicSaaS",
};

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="April 1, 2026">
      <h2>What We Collect</h2>
      <p>
        When you join our waitlist, we collect your email address. When you use
        the SonicSaaS platform, we collect account information (name, email,
        organization) and device metadata necessary to provide the service
        (device names, firmware versions, connection status, configuration
        snapshots).
      </p>

      <h2>How We Use Your Data</h2>
      <p>
        We use your data solely to provide and improve the SonicSaaS service.
        We do not sell, rent, or share your personal information with third
        parties for marketing purposes.
      </p>

      <h2>Data Storage and Security</h2>
      <p>
        All data is stored on Microsoft Azure infrastructure. Device credentials
        are encrypted at rest using AES-256-GCM. Database connections use TLS.
        We follow security best practices including audit logging, role-based
        access control, and multi-factor authentication.
      </p>

      <h2>Your Rights</h2>
      <ul>
        <li>Request a copy of your data at any time</li>
        <li>Request deletion of your account and associated data</li>
        <li>Opt out of non-essential communications</li>
        <li>Export your data in a standard format</li>
      </ul>
      <p>
        These rights apply regardless of your location. We respect GDPR, CCPA,
        and equivalent privacy regulations.
      </p>

      <h2>Cookies</h2>
      <p>
        The marketing site (sonicsaas.com) does not use tracking cookies. The
        application (app.sonicsaas.com) uses essential session cookies required
        for authentication.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions or data requests, email{" "}
        <a href="mailto:privacy@sonicsaas.com" className="text-sky-400 hover:text-sky-300">
          privacy@sonicsaas.com
        </a>.
      </p>
    </LegalPage>
  );
}
