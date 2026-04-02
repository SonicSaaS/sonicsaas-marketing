import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Security — SonicSaaS",
};

export default function Security() {
  return (
    <LegalPage title="Security" lastUpdated="April 1, 2026">
      <h2>Our Approach</h2>
      <p>
        SonicSaaS manages firewall credentials and fleet operations — we take
        this responsibility seriously. Security is a design constraint on every
        change, not an afterthought.
      </p>

      <h2>Credential Encryption</h2>
      <p>
        All device credentials are encrypted at rest using AES-256-GCM with
        versioned, hex-encoded storage. Credentials are decrypted only at
        request time on the server — they are never exposed to the client
        browser or included in API responses.
      </p>

      <h2>Authentication</h2>
      <ul>
        <li>Database-backed sessions (not JWT)</li>
        <li>TOTP-based multi-factor authentication</li>
        <li>SSO via Microsoft Entra ID</li>
        <li>Role-based access control with team scoping on every query</li>
      </ul>

      <h2>Infrastructure</h2>
      <ul>
        <li>Hosted on Microsoft Azure</li>
        <li>TLS encryption for all connections</li>
        <li>Database connections encrypted in transit</li>
        <li>Network isolation between tenants</li>
      </ul>

      <h2>Audit Logging</h2>
      <p>
        Every mutation — device operations, policy changes, user actions — is
        recorded in an immutable audit log with timestamp, actor, and action
        details. Audit logs are retained for compliance purposes.
      </p>

      <h2>Compliance</h2>
      <p>
        SonicSaaS is designed with SOC 2 Type II controls in mind. We are
        actively working toward formal certification. Our security practices
        include regular dependency auditing, static analysis (Semgrep),
        secret scanning (Gitleaks), and container scanning (Trivy).
      </p>

      <h2>Responsible Disclosure</h2>
      <p>
        If you discover a security vulnerability, please report it to{" "}
        <a href="mailto:security@sonicsaas.com" className="text-sky-400 hover:text-sky-300">
          security@sonicsaas.com
        </a>
        . We will acknowledge receipt within 48 hours and work with you to
        understand and address the issue. We do not pursue legal action against
        good-faith security researchers.
      </p>
    </LegalPage>
  );
}
