"use client";

import { useState, useEffect } from "react";

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

export function WaitlistForm({ source = "website" }: { source?: string }) {
  const [email, setEmail] = useState("");
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
    return (
      <div className="text-center">
        <p className="text-[var(--brand)] font-semibold">You&apos;re on the list!</p>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          We&apos;ll be in touch when early access opens.
        </p>
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
          onChange={(e) => setEmail(e.target.value)}
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
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </form>
  );
}
