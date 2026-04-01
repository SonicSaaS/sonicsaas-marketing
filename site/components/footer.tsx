export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <p className="text-sm text-[var(--muted-foreground)]">
            &copy; {year} SonicSaaS. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[var(--muted-foreground)]">
            <a href="/privacy" className="hover:text-[var(--foreground)] transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-[var(--foreground)] transition-colors">
              Terms
            </a>
            <a href="/security" className="hover:text-[var(--foreground)] transition-colors">
              Security
            </a>
            <a href="/acceptable-use" className="hover:text-[var(--foreground)] transition-colors">
              Acceptable Use
            </a>
          </div>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]/60">
          Egress IP: connect.sonicsaas.com (20.29.73.179)
        </p>
      </div>
    </footer>
  );
}
