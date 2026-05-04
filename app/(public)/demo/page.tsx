import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const PROJECTS = [
  {
    title: "Asha — Maternal Health Triage Agent",
    cohort: "Founding Cohort",
    student: "Adaeze Okonkwo",
    blurb:
      "A Swahili + English agent deployed in 12 community clinics across Kenya. Triages maternal health symptoms and routes urgent cases to a human nurse.",
    tags: ["Healthcare", "Multi-lingual", "Tool use"],
    color: "act1",
  },
  {
    title: "Kola — Real-Estate Outreach Pipeline",
    cohort: "Founding Cohort",
    student: "Tunde Bakare",
    blurb:
      "A 3-agent pipeline (research → draft → send) that books property tours for a Lagos brokerage. Closed 14 deals in its first month.",
    tags: ["Sales", "Multi-agent", "Make.com"],
    color: "act2",
  },
  {
    title: "Sefa — Compliance Memo Drafter",
    cohort: "Founding Cohort",
    student: "Amani Mwangi",
    blurb:
      "Drafts compliance memos for a Nairobi fintech. Reads a regulation document, identifies relevant clauses, and produces a structured memo with citations.",
    tags: ["Fintech", "RAG", "Long context"],
    color: "act3",
  },
];

export default function DemoPage() {
  return (
    <main className="bg-cream">
      <section className="bg-brown-deep py-20 text-cream">
        <div className="container">
          <span className="eyebrow">Demo Day Showcase</span>
          <h1 className="mt-3 font-display text-5xl font-semibold md:text-6xl">
            Real projects. Real clients. Real impact.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-cream/70">
            A selection of projects shipped by past Fellowship cohorts.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <Card key={p.title} className="overflow-hidden border-cream-mid hover:shadow-lg transition-shadow">
              <div
                className="h-32 bg-warm-grid"
                style={{
                  backgroundColor:
                    p.color === "act1"
                      ? "var(--act1)"
                      : p.color === "act2"
                        ? "var(--act2)"
                        : "var(--act3)",
                }}
              />
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{p.cohort}</span>
                  <span>·</span>
                  <span>{p.student}</span>
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold text-brown-deep">{p.title}</h3>
                <p className="mt-2 text-sm text-muted">{p.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>
                  ))}
                </div>
                <button className="mt-4 inline-flex items-center gap-1 text-sm text-gold hover:underline">
                  Read case study <ExternalLink className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border-2 border-dashed border-cream-mid p-12 text-center">
          <p className="text-muted">More projects from the current cohort will land here after Demo Day.</p>
        </div>
      </section>
    </main>
  );
}
