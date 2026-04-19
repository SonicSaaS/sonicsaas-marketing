"use client";

import { WaitlistForm, useDemoAccess, buildDemoUrl } from "@/components/waitlist-form";
import {
  Shield,
  Server,
  Users,
  CheckCircle,
  Building,
  FileText,
  RefreshCw,
  Ticket,
  Lock,
  Activity,
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

const differentiators = [
  {
    icon: RefreshCw,
    title: "Bidirectional IT Glue Sync",
    description:
      "Devices auto-import from IT Glue. Changes you make in SonicSaaS sync back. Documentation stays accurate without anyone updating it manually.",
  },
  {
    icon: Ticket,
    title: "ConnectWise PSA Integration",
    description:
      "Agreement scanning, company sync, product mapping, automated tickets from fleet events — closes the loop between monitoring and billing.",
  },
  {
    icon: Lock,
    title: "SOC 2-Grade Security",
    description:
      "AES-256-GCM credential encryption — passwords never exposed to clients. 5-role RBAC with team isolation and an immutable audit trail.",
  },
  {
    icon: Activity,
    title: "Documentation Health Score",
    description:
      "One number that tells you exactly how well your IT Glue matches device reality. Catches drift before clients notice.",
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
        <div className="absolute inset-x-0 bottom-0 top-1/3 bg-glow" />
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
          <div className="flex justify-center mb-4">
            <a href={demoHref()} className={btnPrimary}>
              {hasAccess ? "Launch Demo" : "Get Demo Access"}
            </a>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Built for teams who manage SonicWall fleets
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 top-1/3 bg-glow" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 animate-fade-up">
            <span className="inline-block text-xs font-semibold tracking-wide uppercase bg-[var(--brand-muted)] text-[var(--brand)] px-3 py-1 rounded-full mb-4">
              Built for MSPs
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Why MSPs choose SonicSaaS
            </h2>
            <p className="text-base text-[var(--muted-foreground)] leading-relaxed">
              The four things SonicWall NSM, generic RMMs, and PowerShell scripts don&apos;t do.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {differentiators.map((item, i) => (
              <div
                key={item.title}
                className="flex gap-4 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-[var(--brand-muted)] text-[var(--brand)]">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
                className="block animate-fade-up bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 hover:-translate-y-0.5 hover:shadow-md hover:ring-1 hover:ring-[var(--brand)]/20 transition-all group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[var(--brand-muted)] group-hover:bg-[var(--brand)]/15 text-[var(--brand)] mb-4 transition-colors">
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
