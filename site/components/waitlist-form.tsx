"use client";

import { useState, useEffect } from "react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.sonicsaas.com";

function getClientContext() {
  return {
    referrer: document.referrer || "",
    utm: window.location.search || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    locale: navigator.language || "",
    screen: `${window.screen.width}x${window.screen.height}`,
    userAgent: navigator.userAgent || "",
  };
}

const demoClicks = new Set<string>();

export function trackDemoClick(page: string) {
  demoClicks.add(page);
}

const FIREWALL_RANGES = ["1–10", "11–50", "51–200", "200+"];

export function WaitlistForm({ source = "website" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [firewallCount, setFirewallCount] = useState("");
  const [showExtras, setShowExtras] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const link = (e.target as HTMLElement).closest("a[href*='/api/auth/guest']");
      if (link) {
        const href = link.getAttribute("href") || "";
        const match = href.match(/callbackUrl=([^&]*)/);
        if (match) trackDemoClick(decodeURIComponent(match[1]));
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;

    setError("");
    setLoading(true);

    try {
      const context = getClientContext();
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          company: company.trim() || undefined,
          firewallCount: firewallCount || undefined,
          ...context,
          triedDemo: demoClicks.size > 0,
          demoPages: Array.from(demoClicks),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Unable to connect. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    const triedDemo = demoClicks.size > 0;
    return (
      <div className="text-center max-w-md mx-auto">
        <div className="text-3xl mb-3">&#10003;</div>
        <p className="text-[var(--brand)] font-semibold text-lg">
          You&apos;re on the list!
        </p>
        <p className="text-sm text-[var(--muted-foreground)] mt-2 mb-5">
          We&apos;re onboarding beta users in batches — expect an invite within
          a couple of weeks.
        </p>
        {!triedDemo && (
          <a
            href={`${APP_URL}/api/auth/guest`}
            className="inline-flex items-center justify-center font-semibold bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-[var(--brand-foreground)] px-5 py-2 rounded-md text-sm transition-colors mb-4"
          >
            Try the Demo While You Wait
          </a>
        )}
        <div className="flex items-center justify-center gap-4 text-sm text-[var(--muted-foreground)]">
          <span>Share:</span>
          <a
            href="https://twitter.com/intent/tweet?text=Just%20signed%20up%20for%20SonicSaaS%20%E2%80%94%20a%20modern%20fleet%20management%20tool%20for%20SonicWall%20firewalls.%20Looks%20promising%20for%20MSPs!%20https%3A%2F%2Fsonicsaas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--foreground)] transition-colors underline"
          >
            Twitter
          </a>
          <a
            href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fsonicsaas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--foreground)] transition-colors underline"
          >
            LinkedIn
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 max-w-md mx-auto">
      <div className="flex gap-2 w-full">
        <input
          type="email"
          required
          placeholder="you@msp.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (!showExtras && e.target.value.length > 0) setShowExtras(true);
          }}
          disabled={loading}
          className="flex-1 bg-[var(--background)] border border-[var(--input)] rounded-md px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--brand)] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-[var(--brand-foreground)] font-semibold px-5 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
        >
          {loading ? "Joining..." : "Get Access"}
        </button>
      </div>
      {showExtras && (
        <div className="flex gap-2 w-full animate-fade-in">
          <input
            type="text"
            placeholder="Company name (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
            className="flex-1 bg-[var(--background)] border border-[var(--input)] rounded-md px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--brand)] transition-colors disabled:opacity-50"
          />
          <select
            value={firewallCount}
            onChange={(e) => setFirewallCount(e.target.value)}
            disabled={loading}
            className="bg-[var(--background)] border border-[var(--input)] rounded-md px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)] transition-colors disabled:opacity-50"
          >
            <option value="">Firewalls?</option>
            {FIREWALL_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </form>
  );
}
