"use client";

import { WaitlistForm, useDemoAccess, buildDemoUrl } from "@/components/waitlist-form";
import {
  Shield,
  Server,
  Users,
  CheckCircle,
  Building,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Server,
    title: "Fleet Dashboard",
    description:
      "See every firewall's status, firmware, and connection health at a glance.",
    demoPath: "/dashboard",
  },
  {
    icon: Shield,
    title: "Security Checks",
    description:
      "Find weak spots — outdated firmware, missing licenses, risky local accounts.",
    demoPath: "/dashboard/security",
  },
  {
    icon: Users,
    title: "Team Access",
    description:
      "Invite your team, control who sees what, keep credentials locked down.",
    demoPath: "/dashboard/team",
  },
  {
    icon: CheckCircle,
    title: "Health Scores",
    description:
      "One number per firewall that tells you if something needs attention.",
    demoPath: "/dashboard/compliance",
  },
  {
    icon: Building,
    title: "Multi-Tenant",
    description:
      "Separate environments for each client, all from one login.",
    demoPath: "/dashboard/companies",
  },
  {
    icon: FileText,
    title: "Activity Log",
    description:
      "Every action recorded — who did what, when, and to which firewall.",
    demoPath: "/dashboard/logs",
  },
];

const btnPrimary =
  "inline-flex items-center justify-center font-semibold bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-[var(--brand-foreground)] px-6 py-3 rounded-lg text-sm transition-colors w-full sm:w-auto";

export default function Home() {
  const { hasAccess, demoToken } = useDemoAccess();

  function demoHref(callbackUrl?: string) {
    if (hasAccess && demoToken) return buildDemoUrl(demoToken, callbackUrl);
    return "#waitlist";
  }

  return (
    <>
      {/* Hero */}
      <section className="relative text-center px-6 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
        <div className="relative max-w-3xl mx-auto animate-fade-up">
          <span className="inline-block text-xs font-semibold tracking-wide uppercase bg-[var(--brand-muted)] text-[var(--brand)] px-3 py-1 rounded-full mb-6">
            Early Access
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Manage every SonicWall firewall{" "}
            <span className="text-[var(--brand)]">in one place</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10 leading-relaxed">
            See the health of your entire fleet, spot problems before clients
            call, and stop logging into firewalls one at a time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <a href={demoHref()} className={btnPrimary}>
              {hasAccess ? "Launch Demo" : "Get Demo Access"}
            </a>
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center font-semibold border border-[var(--border)] hover:bg-[var(--secondary)] px-6 py-3 rounded-lg text-sm transition-colors w-full sm:w-auto"
            >
              Join the Waitlist
            </a>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Built for MSPs who manage SonicWall fleets
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-20 bg-[var(--secondary)] bg-noise overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <a
                key={feature.title}
                href={demoHref(feature.demoPath)}
                className="block animate-fade-up bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 hover:-translate-y-0.5 hover:shadow-md transition-all group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[var(--brand-muted)] text-[var(--brand)] mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--brand)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {feature.description}
                </p>
                <span className="inline-block mt-3 text-xs font-semibold text-[var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity">
                  {hasAccess ? "Try in demo" : "Join waitlist to try"} &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Callout */}
      <section className="relative px-6 py-20 bg-[var(--primary)] text-[var(--primary-foreground)] overflow-hidden">
        <div className="absolute inset-0 bg-glow" />
        <div className="relative max-w-2xl mx-auto text-center animate-fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            See it for yourself
          </h2>
          <p className="text-[var(--primary-foreground)]/70 mb-8">
            {hasAccess
              ? "Your demo is ready. Jump in and explore."
              : "Fill out the form below to unlock a full demo with sample data."}
          </p>
          <a
            href={demoHref()}
            className="inline-flex items-center justify-center font-semibold bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-[var(--brand-foreground)] px-8 py-3 rounded-lg text-sm transition-colors"
          >
            {hasAccess ? "Launch Demo" : "Get Demo Access"}
          </a>
        </div>
      </section>

      {/* Bottom CTA */}
      <section id="waitlist" className="text-center px-6 pt-20 pb-40 scroll-mt-32">
        <div className="max-w-2xl mx-auto animate-fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to stop managing firewalls one at a time?
          </h2>
          {hasAccess ? (
            <div className="mb-8">
              <a href={demoHref()} className={btnPrimary}>
                Launch Demo
              </a>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--muted-foreground)] mb-6">
                Fill out the form to unlock demo access and join the waitlist:
              </p>
              <WaitlistForm source="bottom-cta" />
            </>
          )}
        </div>
      </section>
    </>
  );
}
