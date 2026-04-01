import { Link, BarChart3, Wrench } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Link,
    title: "Connect your firewalls",
    description:
      "Add your SonicWall credentials once. SonicSaaS pulls status, firmware, and config data automatically.",
  },
  {
    number: "2",
    icon: BarChart3,
    title: "See fleet health at a glance",
    description:
      "One dashboard shows every firewall across every client — health scores, alerts, and firmware status.",
  },
  {
    number: "3",
    icon: Wrench,
    title: "Spot and fix issues first",
    description:
      "Catch outdated firmware, expired licenses, and risky configs before your clients even notice.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-14">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative text-center animate-fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[var(--brand-muted)] text-[var(--brand)] mx-auto mb-5">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)] mb-2">
                Step {step.number}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
