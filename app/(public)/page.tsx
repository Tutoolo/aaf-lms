import Link from "next/link";
import { ACTS, CURRICULUM, PRICING_TIERS, PROGRAM_STATS } from "@/lib/curriculum";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Award, Users, Rocket } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brown-deep text-cream">
        <div className="absolute inset-0 bg-diamond-grid opacity-50" aria-hidden />
        <div className="container relative grid gap-12 py-24 md:grid-cols-2 md:py-32">
          <div className="flex flex-col justify-center">
            <span className="eyebrow">AI Agent Engineering Fellowship</span>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight md:text-6xl">
              Become the engineer who builds the
              <span className="text-gold"> agents the world needs.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream/80">
              A 10-week cohort program for African and diaspora learners. Three
              acts, real client projects, and a Demo Day stage waiting at the end.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/apply">
                  Apply for next cohort <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-cream/40 text-cream hover:bg-cream/10" asChild>
                <Link href="/curriculum">See the curriculum</Link>
              </Button>
            </div>

            {/* Stats bar */}
            <div className="mt-16 grid grid-cols-2 gap-6 border-t border-cream/10 pt-8 sm:grid-cols-4">
              {PROGRAM_STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-semibold text-gold">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider text-cream/60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — visual quote */}
          <div className="hidden md:flex md:items-center md:justify-center">
            <div className="relative max-w-sm rounded-2xl border border-gold/30 bg-brown-mid p-8 shadow-2xl">
              <div className="absolute -top-3 left-8 rounded-full bg-gold px-3 py-1 text-xs font-medium text-brown-deep">
                From a graduate
              </div>
              <p className="font-display text-2xl italic text-cream">
                "I walked in writing prompts. I walked out shipping a 4-agent
                pipeline that landed me my first AI engineering role."
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm text-cream/70">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gold to-terra" />
                <div>
                  <div className="font-medium text-cream">Adaeze O.</div>
                  <div className="text-xs">Founding Cohort, Lagos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3 Acts ────────────────────────────────────── */}
      <section className="container py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">The structure</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-brown-deep md:text-5xl">
            Three acts. Ten weeks. One real project at the end.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {([1, 2, 3] as const).map((n) => {
            const act = ACTS[n];
            const weeks = CURRICULUM.filter((w) => w.actNumber === n);
            return (
              <Card key={n} className="overflow-hidden border-cream-mid">
                <div className="h-2 w-full" style={{ backgroundColor: act.cssVar }} />
                <CardContent className="p-8">
                  <Badge variant={`act${n}` as any}>Act {n}</Badge>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-brown-deep">
                    {act.name.split(" — ")[1]}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{act.subtitle}</p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {weeks.map((w) => (
                      <li key={w.weekNumber} className="flex items-start gap-2">
                        <span className="text-gold">·</span>
                        <span>
                          <span className="font-medium">Week {w.weekNumber}:</span>{" "}
                          {w.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/curriculum">
              See the full week-by-week curriculum <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ─── What you'll get ──────────────────────────── */}
      <section className="bg-cream-mid/30 py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">What you'll come out with</span>
            <h2 className="mt-3 font-display text-4xl font-semibold text-brown-deep">
              Not a certificate. A portfolio.
            </h2>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "A working 4-agent system",
                body: "By Week 5 you'll have built a multi-agent pipeline that researches, drafts, edits, and ships.",
              },
              {
                icon: Users,
                title: "A real client project",
                body: "Act III pairs you with an African business solving a real problem. Your work goes to production.",
              },
              {
                icon: Rocket,
                title: "A Demo Day stage",
                body: "Pitch to industry panel and recruiters. Past graduates landed roles within 8 weeks of Demo Day.",
              },
              {
                icon: Award,
                title: "A verified certificate",
                body: "Every certificate has a public verification page and a LinkedIn 'Add to profile' link.",
              },
              {
                icon: Sparkles,
                title: "A working sandbox",
                body: "Persistent personal lab where you'll prototype agents from Day 1 — all sandboxes stay live for 12 months.",
              },
              {
                icon: Users,
                title: "A community for life",
                body: "Cohort Slack stays active. Past cohorts hire from current cohorts. Diaspora ecosystem, real connections.",
              },
            ].map((b) => (
              <div key={b.title} className="rounded-xl border border-cream-mid bg-white p-6">
                <b.icon className="h-6 w-6 text-gold" />
                <h3 className="mt-4 font-display text-xl font-semibold text-brown-deep">{b.title}</h3>
                <p className="mt-2 text-sm text-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────── */}
      <section id="pricing" className="container py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Tracks</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-brown-deep">
            Three ways to join the fellowship.
          </h2>
          <p className="mt-4 text-muted">
            African & diaspora applicants pay 50% — a discount applied automatically at checkout.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.id}
              className={
                tier.highlight
                  ? "relative border-2 border-gold shadow-xl"
                  : "border-cream-mid"
              }
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-xs font-medium text-brown-deep">
                  {tier.badge}
                </div>
              )}
              <CardContent className="p-8">
                <h3 className="font-display text-2xl font-semibold text-brown-deep">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-semibold text-brown-deep">{tier.priceLabel}</span>
                  {tier.price > 0 && <span className="text-sm text-muted">USD</span>}
                </div>
                <ul className="mt-6 space-y-2 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-gold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={tier.highlight ? "default" : "outline"}
                  asChild
                >
                  <Link href={`/apply?track=${tier.id}`}>{tier.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Instructor ──────────────────────────────── */}
      <section className="bg-brown-deep py-24 text-cream">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="eyebrow">Your instructor</span>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Built agents at Anthropic. Now teaching them at home.
            </h2>
            <p className="mt-4 text-cream/70">
              Kwame Asante led production agent systems at Anthropic before
              moving back to Accra to start the Fellowship. Every lesson is
              built from real production lessons — not hypotheticals.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/30 bg-brown-mid p-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold to-terra" />
              <div>
                <div className="font-display text-xl text-cream">Kwame Asante</div>
                <div className="text-sm text-cream/60">Lead Instructor · ex-Anthropic</div>
              </div>
            </div>
            <p className="mt-6 text-sm italic text-cream/80">
              "The next 5 years of African tech will be defined by who can build
              with agents. This program is my answer to that bet."
            </p>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────── */}
      <section className="container py-24">
        <div className="rounded-3xl border-2 border-gold bg-cream-mid/30 p-12 text-center">
          <h2 className="font-display text-4xl font-semibold text-brown-deep md:text-5xl">
            Demo Day is in 10 weeks.
          </h2>
          <p className="mt-4 text-lg text-muted">
            The next cohort fills fast. Apply today — review takes 48 hours.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/apply">Apply now <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
