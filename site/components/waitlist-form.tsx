"use client";

import { useState, useEffect, useSyncExternalStore, useCallback, useRef } from "react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.sonicsaas.com";

// ---------------------------------------------------------------------------
// Demo access store (localStorage-backed, reactive across components)
// ---------------------------------------------------------------------------

type DemoAccess = { hasAccess: boolean; demoToken: string | null; email: string | null };

const STORAGE_KEY = "sonicsaas_demo_access";

function readAccess(): DemoAccess {
  if (typeof window === "undefined") return { hasAccess: false, demoToken: null, email: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { hasAccess: false, demoToken: null, email: null };
    const parsed = JSON.parse(raw);
    return { hasAccess: true, demoToken: parsed.demoToken, email: parsed.email };
  } catch {
    return { hasAccess: false, demoToken: null, email: null };
  }
}

let accessSnapshot = readAccess();
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return accessSnapshot;
}

function getServerSnapshot(): DemoAccess {
  return { hasAccess: false, demoToken: null, email: null };
}

function grantAccess(email: string, demoToken: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, demoToken }));
  accessSnapshot = { hasAccess: true, demoToken, email };
  listeners.forEach((cb) => cb());
  window.dispatchEvent(new Event("demo-access-granted"));
}

export function useDemoAccess(): DemoAccess {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function buildDemoUrl(token: string, callbackUrl?: string): string {
  const params = new URLSearchParams({ demoToken: token });
  if (callbackUrl) params.set("callbackUrl", callbackUrl);
  return `${APP_URL}/api/auth/guest?${params}`;
}

// ---------------------------------------------------------------------------
// Client context collection
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Form constants
// ---------------------------------------------------------------------------

const FIREWALL_RANGES = ["1–10", "11–50", "51–200", "200+"];

const ROLES = [
  "IT Manager",
  "MSP Owner/Partner",
  "NOC/SOC Engineer",
  "vCIO/vCISO",
  "Other",
];

const CLIENT_COUNTS = ["1–5", "6–20", "21–50", "50+"];

const CURRENT_APPROACHES = [
  "Manual login to each firewall",
  "SonicWall NSM",
  "GMS/CSC",
  "Scripts/API",
  "Other",
];

const PAIN_POINTS = [
  "No single pane of glass",
  "Firmware management",
  "Security compliance",
  "Client reporting",
  "Credential management",
];

const REFERRAL_SOURCES = [
  "Reddit",
  "Google search",
  "Social media",
  "Word of mouth",
  "SonicWall community",
  "Other",
];

const TRICK_OPTIONS = ["Red", "Blue", "Orange", "Green", "Purple"];

const SNARKY_MESSAGES = [
  "Hmm, that doesn't seem right. Read the question one more time!",
  "We believe in you. The answer is literally in the question.",
  "Okay here's a hint: it rhymes with 'orange.' Wait\u2026",
  "At this point we're genuinely concerned. The. Color. Of. An. Orange.",
  "We're going to need you to put down the keyboard and go look at an orange.",
];

// ---------------------------------------------------------------------------
// Shared classes
// ---------------------------------------------------------------------------

const selectClass =
  "w-full bg-[var(--background)] border border-[var(--input)] rounded-md px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--brand)] transition-colors disabled:opacity-50";

// ---------------------------------------------------------------------------
// Turnstile widget
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
    };
  }
}

function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey || !containerRef.current) return;

    function tryRender() {
      if (!window.turnstile || !containerRef.current) return;
      if (widgetIdRef.current !== null) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        theme: "auto",
        size: "flexible",
      });
    }

    if (window.turnstile) {
      tryRender();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          tryRender();
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [onVerify]);

  return <div ref={containerRef} />;
}

// ---------------------------------------------------------------------------
// WaitlistForm
// ---------------------------------------------------------------------------

export function WaitlistForm({ source = "website" }: { source?: string }) {
  // Tier 1
  const [email, setEmail] = useState("");
  // Tier 2
  const [company, setCompany] = useState("");
  const [firewallCount, setFirewallCount] = useState("");
  const [showTier2, setShowTier2] = useState(false);
  // Tier 3
  const [role, setRole] = useState("");
  const [clientCount, setClientCount] = useState("");
  const [currentApproach, setCurrentApproach] = useState("");
  const [biggestPainPoint, setBiggestPainPoint] = useState("");
  const [heardAbout, setHeardAbout] = useState("");
  const [trickAnswer, setTrickAnswer] = useState("");
  const [showTier3, setShowTier3] = useState(false);

  // Trick question state
  const [trickAttempts, setTrickAttempts] = useState(0);
  const [trickError, setTrickError] = useState("");

  // Turnstile
  const [turnstileToken, setTurnstileToken] = useState("");

  // Form state
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Show Tier 3 once email has content and Tier 2 is visible
  useEffect(() => {
    if (showTier2 && email.length > 0) {
      const timer = setTimeout(() => setShowTier3(true), 400);
      return () => clearTimeout(timer);
    }
  }, [showTier2, email]);

  // Track demo link clicks
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

  const onTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;

    // Trick question gate
    if (trickAnswer !== "Orange") {
      const attempt = trickAttempts + 1;
      setTrickAttempts(attempt);
      const msgIndex = Math.min(attempt - 1, SNARKY_MESSAGES.length - 1);
      setTrickError(SNARKY_MESSAGES[msgIndex]);
      return;
    }
    setTrickError("");

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
          role: role || undefined,
          clientCount: clientCount || undefined,
          currentApproach: currentApproach || undefined,
          biggestPainPoint: biggestPainPoint || undefined,
          heardAbout: heardAbout || undefined,
          trickAttempts,
          turnstileToken: turnstileToken || undefined,
          ...context,
          triedDemo: demoClicks.size > 0,
          demoPages: Array.from(demoClicks),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        if (data.demoToken) {
          grantAccess(email.trim().toLowerCase(), data.demoToken);
        }
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
    const { demoToken } = readAccess();
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
        <a
            href={demoToken ? buildDemoUrl(demoToken) : `${APP_URL}/api/auth/guest`}
            className="inline-flex items-center justify-center font-semibold bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-[var(--brand-foreground)] px-5 py-2 rounded-md text-sm transition-colors mb-4"
          >
            Launch the Demo
          </a>
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
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 max-w-md mx-auto">
      {/* Tier 1: Email + submit */}
      <div className="flex gap-2 w-full">
        <input
          type="email"
          required
          placeholder="you@msp.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (!showTier2 && e.target.value.length > 0) setShowTier2(true);
          }}
          disabled={loading}
          className="flex-1 bg-[var(--background)] border border-[var(--input)] rounded-md px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--brand)] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-[var(--brand-foreground)] font-semibold px-5 py-2 rounded-md text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Joining..." : "Get Demo Access"}
        </button>
      </div>

      {/* Tier 2: Company + firewall count */}
      {showTier2 && (
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

      {/* Tier 3: Qualification fields + trick question */}
      {showTier3 && (
        <div className="w-full space-y-2 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading} className={selectClass}>
              <option value="">Your role</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={clientCount} onChange={(e) => setClientCount(e.target.value)} disabled={loading} className={selectClass}>
              <option value="">Clients managed</option>
              {CLIENT_COUNTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={currentApproach} onChange={(e) => setCurrentApproach(e.target.value)} disabled={loading} className={selectClass}>
              <option value="">How do you manage firewalls?</option>
              {CURRENT_APPROACHES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={biggestPainPoint} onChange={(e) => setBiggestPainPoint(e.target.value)} disabled={loading} className={selectClass}>
              <option value="">Biggest pain point</option>
              {PAIN_POINTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={heardAbout} onChange={(e) => setHeardAbout(e.target.value)} disabled={loading} className={selectClass}>
              <option value="">How&apos;d you hear about us?</option>
              {REFERRAL_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {/* Trick question - intentionally looks like every other dropdown */}
            <div>
              <select
                value={trickAnswer}
                onChange={(e) => { setTrickAnswer(e.target.value); setTrickError(""); }}
                disabled={loading}
                className={`${selectClass}${trickError ? " border-red-500" : ""}`}
              >
                <option value="">What color is an orange?</option>
                {TRICK_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              {trickError && (
                <p className="text-xs text-red-500 mt-1 animate-fade-in">{trickError}</p>
              )}
            </div>
          </div>

          {/* Turnstile CAPTCHA */}
          <TurnstileWidget onVerify={onTurnstileVerify} />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
