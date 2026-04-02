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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]" suppressHydrationWarning>
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
