import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Terms of Service — SonicSaaS",
};

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="March 30, 2026">
      <h2>Service Description</h2>
      <p>
        SonicSaaS provides a cloud-based platform for managing SonicWall
        firewall devices. The service includes device monitoring, policy
        management, configuration backup, and fleet operations for managed
        service providers (MSPs).
      </p>

      <h2>Account Responsibilities</h2>
      <p>
        You are responsible for maintaining the security of your account
        credentials, including any API keys or device connection credentials
        stored in the platform. You must notify us immediately of any
        unauthorized access.
      </p>

      <h2>Acceptable Use</h2>
      <p>
        Use of the service is subject to our{" "}
        <a href="/acceptable-use" className="text-sky-400 hover:text-sky-300">
          Acceptable Use Policy
        </a>
        . You may only manage devices that you own or are authorized to manage.
      </p>

      <h2>Service Availability</h2>
      <p>
        We strive to maintain high availability but do not guarantee uninterrupted
        service. SonicSaaS is not a replacement for direct device management in
        emergency situations. Always maintain out-of-band access to critical
        infrastructure.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        SonicSaaS is provided &ldquo;as is&rdquo; without warranties of any kind. We are
        not liable for any damages arising from the use of the service,
        including but not limited to device misconfigurations, network outages,
        or data loss. Our total liability is limited to the fees you paid in the
        12 months preceding the claim.
      </p>

      <h2>Termination</h2>
      <p>
        Either party may terminate the service at any time. Upon termination, we
        will provide a reasonable period to export your data. Device credentials
        are permanently deleted upon account closure.
      </p>

      <h2>Governing Law</h2>
      <p>
        These terms are governed by the laws of the State of Texas, United
        States, without regard to conflict of law provisions.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these terms, email{" "}
        <a href="mailto:legal@sonicsaas.com" className="text-sky-400 hover:text-sky-300">
          legal@sonicsaas.com
        </a>.
      </p>
    </LegalPage>
  );
}
