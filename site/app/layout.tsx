import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSync } from "@/components/theme-sync";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SonicSaaS — Modern Firewall Management for MSPs",
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
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeSync />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
