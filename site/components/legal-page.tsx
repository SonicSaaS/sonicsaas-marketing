export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-10">
        Last updated: {lastUpdated}
      </p>
      <div className="prose max-w-none [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:text-[var(--muted-foreground)] [&_p]:leading-relaxed [&_li]:text-[var(--muted-foreground)] [&_ul]:space-y-2 [&_a]:text-[var(--brand)] [&_a]:hover:underline">
        {children}
      </div>
    </article>
  );
}
