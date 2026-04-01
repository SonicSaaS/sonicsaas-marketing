import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Acceptable Use Policy — SonicSaaS",
};

export default function AcceptableUse() {
  return (
    <LegalPage title="Acceptable Use Policy" lastUpdated="March 30, 2026">
      <h2>Authorized Use</h2>
      <p>
        SonicSaaS is intended for managing SonicWall firewall devices that you
        own or are contractually authorized to manage on behalf of your clients.
        You must have proper authorization before adding any device to the
        platform.
      </p>

      <h2>Prohibited Activities</h2>
      <ul>
        <li>Adding or managing devices without authorization from the device owner</li>
        <li>Attempting to access other tenants&apos; data or devices</li>
        <li>Using the platform to conduct denial-of-service attacks or other malicious activities</li>
        <li>Reverse engineering, decompiling, or attempting to extract source code from the service</li>
        <li>Sharing account credentials or API keys with unauthorized parties</li>
        <li>Using automated tools to scrape or overload the platform</li>
      </ul>

      <h2>Account Suspension</h2>
      <p>
        We reserve the right to suspend or terminate accounts that violate this
        policy. Where possible, we will notify you before taking action and
        provide an opportunity to address the issue. Immediate suspension may
        occur in cases of active security threats.
      </p>

      <h2>Reporting Violations</h2>
      <p>
        If you believe someone is violating this policy, please contact{" "}
        <a href="mailto:abuse@sonicsaas.com" className="text-sky-400 hover:text-sky-300">
          abuse@sonicsaas.com
        </a>.
      </p>
    </LegalPage>
  );
}
