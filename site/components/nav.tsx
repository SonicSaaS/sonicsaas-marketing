import Link from "next/link";
import { Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.sonicsaas.com";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <Link href="/" className="flex items-center">
        <Shield className="h-6 w-6 text-[var(--brand)]" />
        <span className="ml-2 text-xl font-semibold">SonicSaaS</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <a
          href="https://docs.sonicsaas.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          Docs
        </a>
        <a
          href="https://app.sonicsaas.com/api/v1/swagger"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          API
        </a>
        <a
          href="https://status.sonicsaas.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          Status
        </a>
        <a
          href={APP_URL}
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          Sign In
        </a>
        <a
          href="#waitlist"
          className="text-sm font-semibold bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-[var(--brand-foreground)] px-4 py-2 rounded-md transition-colors"
        >
          Request Access
        </a>
      </div>
    </nav>
  );
}
