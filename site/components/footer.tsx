export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <p className="text-sm text-[var(--muted-foreground)]">
            &copy; {year} SonicSaaS. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-[var(--muted-foreground)]">
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
            <a href="https://docs.sonicsaas.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">
              Docs
            </a>
            <a href="https://app.sonicsaas.com/api/v1/swagger" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">
              API Docs
            </a>
            <a href="https://status.sonicsaas.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
