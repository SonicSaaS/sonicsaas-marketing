import { Users, Shield, Lock, CreditCard } from "lucide-react";

const indicators = [
  { icon: Users, label: "Built by MSPs, for MSPs" },
  { icon: Shield, label: "SOC 2 controls in progress" },
  { icon: Lock, label: "AES-256-GCM encryption" },
  { icon: CreditCard, label: "No credit card required" },
];

export function TrustStrip() {
  return (
    <section className="px-6 py-10 border-b border-[var(--border)]">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {indicators.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]"
          >
            <item.icon className="h-4 w-4 text-[var(--brand)]" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
