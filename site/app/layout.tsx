import type { Metadata } from "next";
import Script from "next/script";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSync } from "@/components/theme-sync";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";


const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SonicSaaS — Modern SonicWall Fleet Management",
  description:
    "Manage every SonicWall firewall in one place. See fleet health, spot problems, and stop logging into firewalls one at a time.",
  metadataBase: new URL("https://sonicsaas.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sonicsaas.com",
    siteName: "SonicSaaS",
    title: "SonicSaaS — Modern SonicWall Fleet Management for MSPs",
    description:
      "The only fleet management platform built for MSPs who manage SonicWall firewalls. Fleet dashboard, security audits, bidirectional IT Glue sync, ConnectWise integration, and SOC 2-grade audit trails.",
  },
  twitter: {
    card: "summary",
    title: "SonicSaaS — Modern SonicWall Fleet Management for MSPs",
    description:
      "The only fleet management platform built for MSPs who manage SonicWall firewalls. Fleet dashboard, security audits, bidirectional IT Glue sync, ConnectWise integration, and SOC 2-grade audit trails.",
  },
  alternates: {
    canonical: "https://sonicsaas.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://sonicsaas.com/#organization",
                  name: "SonicSaaS",
                  url: "https://sonicsaas.com",
                  description:
                    "Cloud-based SonicWall firewall fleet management platform for Managed Service Providers.",
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://sonicsaas.com/#application",
                  name: "SonicSaaS",
                  description:
                    "The only fleet management platform built for MSPs who manage SonicWall firewalls. Bidirectional IT Glue and ConnectWise sync, SOC 2-grade security, and documentation health scoring — all from one dashboard.",
                  url: "https://sonicsaas.com",
                  applicationCategory: "BusinessApplication",
                  applicationSubCategory: "Network Management",
                  operatingSystem: "Web",
                  featureList:
                    "Fleet Dashboard, Security Checks, Health Scores, Multi-Tenant, Team Access, Activity Log, Bidirectional IT Glue Sync, ConnectWise PSA Integration, Config Extraction, Documentation Health Scoring, Credential Governance, Immutable Audit Trail",
                  audience: {
                    "@type": "BusinessAudience",
                    audienceType: "Managed Service Providers",
                  },
                  provider: {
                    "@id": "https://sonicsaas.com/#organization",
                  },
                  offers: {
                    "@type": "Offer",
                    availability: "https://schema.org/PreOrder",
                    description: "Early access — join the waitlist",
                  },
                },
              ],
            }),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeSync />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>

        {/* Cloudflare Turnstile (CAPTCHA) */}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
          strategy="lazyOnload"
        />

        {/* Cloudflare Web Analytics */}
        {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
