"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_TIERS } from "@/lib/curriculum";
import { Check, ChevronRight } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

function ApplyInner() {
  const params = useSearchParams();
  const initialTrack =
    (params.get("track") as "self_paced" | "fellowship" | "scholarship") ?? "fellowship";
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [track, setTrack] = useState(initialTrack);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [diaspora, setDiaspora] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const tier = PRICING_TIERS.find((t) => t.id === track)!;
  const isScholarship = track === "scholarship";
  const finalPrice = diaspora && tier.price > 0 ? Math.round(tier.price * 0.5) : tier.price;

  async function submit() {
    setSubmitting(true);
    // POST to /api/enrollments — stubbed for the foundation scaffold
    const res = await fetch("/api/enrollments/apply", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ track, name, email, country, diaspora, motivation }),
    });
    setSubmitting(false);
    if (res.ok) {
      const j = await res.json();
      // For paid tracks, would redirect to Stripe checkout; mock returns a URL
      if (j.checkoutUrl) {
        window.location.href = j.checkoutUrl;
      } else {
        setStep(4);
      }
    } else {
      alert("Could not submit. Please try again.");
    }
  }

  return (
    <main className="bg-cream py-12">
      <div className="container max-w-3xl">
        <div className="mb-8">
          <span className="eyebrow">Application</span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">
            Join the next cohort
          </h1>
          <p className="mt-2 text-muted">
            Takes about 5 minutes. Review within 48 hours.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-10 flex items-center gap-3 text-sm">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  step >= n ? "bg-gold text-brown-deep" : "bg-cream-mid text-muted"
                }`}
              >
                {step > n ? <Check className="h-4 w-4" /> : n}
              </div>
              <span className={step >= n ? "text-brown-deep" : "text-muted"}>
                {["Track", "About you", "Submit"][n - 1]}
              </span>
              {n < 3 && <ChevronRight className="h-4 w-4 text-muted" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card className="border-cream-mid">
            <CardContent className="space-y-4 p-8">
              <h2 className="font-display text-2xl text-brown-deep">Choose your track</h2>
              <div className="grid gap-3">
                {PRICING_TIERS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTrack(t.id as any)}
                    className={`rounded-lg border-2 p-4 text-left transition-colors ${
                      track === t.id
                        ? "border-gold bg-gold-pale"
                        : "border-cream-mid hover:border-gold/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-display text-lg font-semibold text-brown-deep">
                        {t.name}
                      </div>
                      <div className="font-display text-2xl text-brown-deep">{t.priceLabel}</div>
                    </div>
                    <p className="mt-1 text-sm text-muted">{t.features[0]}</p>
                  </button>
                ))}
              </div>
              <Button onClick={() => setStep(2)} className="w-full">Continue</Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-cream-mid">
            <CardContent className="space-y-4 p-8">
              <h2 className="font-display text-2xl text-brown-deep">About you</h2>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country of residence</Label>
                <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Nigeria, Ghana, UK" />
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-cream-mid bg-cream-mid/20 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={diaspora}
                  onChange={(e) => setDiaspora(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-gold"
                />
                <span>
                  I'm based in Africa or am a member of the African diaspora.
                  <span className="block text-xs text-muted">Applies a 50% discount on paid tracks.</span>
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                <Button onClick={() => setStep(3)} className="flex-1" disabled={!name || !email}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-cream-mid">
            <CardContent className="space-y-6 p-8">
              <h2 className="font-display text-2xl text-brown-deep">
                {isScholarship ? "Tell us why" : "Almost there"}
              </h2>

              {isScholarship && (
                <div className="space-y-2">
                  <Label htmlFor="motivation">
                    Why does this fellowship matter to you? (300+ words recommended)
                  </Label>
                  <textarea
                    id="motivation"
                    rows={8}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full rounded-md border border-input bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              )}

              <div className="rounded-lg bg-cream-mid/40 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Track</span>
                  <Badge>{tier.name}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted">Price</span>
                  <span className="font-medium text-brown-deep">
                    {tier.price === 0 ? "Free (application)" : `$${finalPrice}`}
                    {diaspora && tier.price > 0 && (
                      <span className="ml-2 text-xs text-gold">(diaspora 50% off)</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                <Button onClick={submit} className="flex-1" disabled={submitting}>
                  {submitting
                    ? "Submitting…"
                    : tier.price === 0
                      ? "Submit application"
                      : "Continue to payment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="border-2 border-gold">
            <CardContent className="space-y-4 p-12 text-center">
              <Check className="mx-auto h-12 w-12 text-gold" />
              <h2 className="font-display text-3xl text-brown-deep">Application received</h2>
              <p className="text-muted">
                You'll hear from us within 48 hours. Check{" "}
                <span className="text-brown-deep">{email}</span> for confirmation.
              </p>
              <Button onClick={() => router.push("/")} variant="outline">Back to home</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="container py-24 text-center text-muted">Loading…</div>}>
      <ApplyInner />
    </Suspense>
  );
}
