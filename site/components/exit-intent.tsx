"use client";

import { useState, useEffect, useCallback } from "react";
import { WaitlistForm } from "@/components/waitlist-form";
import { X } from "lucide-react";

const STORAGE_KEY = "sonicsaas-exit-shown";

export function ExitIntent() {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(true);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY < 0) show();
    }

    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    return () =>
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setVisible(false)}
      />
      <div className="relative bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-fade-up">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
          Before you go&hellip;
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] text-center mb-6">
          Join the waitlist and be first to manage your entire SonicWall fleet
          from a single dashboard. Free during beta.
        </p>
        <WaitlistForm source="exit-intent" />
      </div>
    </div>
  );
}
