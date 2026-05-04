import { ACTS, CURRICULUM } from "@/lib/curriculum";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Briefcase } from "lucide-react";

export default function CurriculumPage() {
  return (
    <main className="bg-cream">
      {/* Header */}
      <section className="relative overflow-hidden bg-brown-deep py-20 text-cream">
        <div className="absolute inset-0 bg-diamond-grid opacity-50" aria-hidden />
        <div className="container relative">
          <span className="eyebrow">Curriculum · Founding Cohort</span>
          <h1 className="mt-3 font-display text-5xl font-semibold md:text-6xl">
            Ten weeks. Three acts. One transformation.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-cream/70">
            Every week is built around a working deliverable. By Week 10 you'll
            have shipped a production agent and stood on a Demo Day stage.
          </p>
        </div>
      </section>

      {/* Curriculum body */}
      <section className="container py-16">
        {([1, 2, 3] as const).map((act) => (
          <ActSection key={act} actNumber={act} />
        ))}
      </section>
    </main>
  );
}

function ActSection({ actNumber }: { actNumber: 1 | 2 | 3 }) {
  const act = ACTS[actNumber];
  const weeks = CURRICULUM.filter((w) => w.actNumber === actNumber);

  return (
    <div className="mb-20">
      <div className="mb-8 flex items-center gap-4">
        <div
          className="h-12 w-1 rounded-full"
          style={{ backgroundColor: act.cssVar }}
        />
        <div>
          <Badge variant={`act${actNumber}` as any}>Act {actNumber}</Badge>
          <h2 className="mt-2 font-display text-3xl font-semibold text-brown-deep">
            {act.name.split(" — ")[1]}
          </h2>
          <p className="text-muted">{act.subtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        {weeks.map((w) => (
          <Card key={w.weekNumber} className="overflow-hidden border-cream-mid">
            <div className="grid md:grid-cols-[140px_1fr]">
              <div
                className="flex flex-col justify-center px-6 py-6 text-cream"
                style={{ backgroundColor: act.cssVar }}
              >
                <div className="text-xs uppercase tracking-wider opacity-70">Week</div>
                <div className="font-display text-5xl font-semibold leading-none">{w.weekNumber}</div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold text-brown-deep">{w.title}</h3>
                <p className="mt-1 text-sm text-muted">{w.tagline}</p>

                <div className="mt-5">
                  <p className="eyebrow">What you'll come out with</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                    {w.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-md border-l-2 border-gold bg-cream-mid/40 px-4 py-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <p className="text-sm">
                    <span className="font-medium text-brown-deep">Deliverable: </span>
                    <span className="text-foreground">{w.deliverable}</span>
                  </p>
                </div>

                {w.launchBlock && (
                  <div className="mt-3 rounded-md border border-brown-deep/15 bg-brown-deep/[0.04] px-4 py-3">
                    <div className="mb-1.5 flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-brown-deep" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brown-deep/80">
                        Launch Block
                      </span>
                      <Badge variant="deep" className="text-[10px]">Fellowship only</Badge>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium text-brown-deep">{w.launchBlock.title}: </span>
                      <span className="text-foreground/80">{w.launchBlock.description}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
