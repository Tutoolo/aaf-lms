"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, AlertCircle, Trophy, ArrowRight } from "lucide-react";

type Flash = { kind: "success" | "error"; message: string } | null;

export function Grader({
  submissionId,
  assignmentId,
  passingScore,
  weekNumber,
  initial,
  nextUngradedId,
}: {
  submissionId: string;
  assignmentId: string;
  passingScore: number;
  weekNumber: number;
  initial: { grade: number | null; feedback: string; needsRevision: boolean };
  nextUngradedId: string | null;
}) {
  const router = useRouter();
  const [grade, setGrade] = useState<string>(initial.grade?.toString() ?? "");
  const [feedback, setFeedback] = useState(initial.feedback);
  const [needsRevision, setNeedsRevision] = useState(initial.needsRevision);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<Flash>(null);
  const [awarded, setAwarded] = useState<{ name: string; points: number } | null>(null);

  async function save(thenAdvance: boolean) {
    const g = grade === "" ? null : parseFloat(grade);
    if (g !== null && (isNaN(g) || g < 0 || g > 100)) {
      setFlash({ kind: "error", message: "Grade must be a number between 0 and 100." });
      return;
    }
    setBusy(true);
    setFlash(null);
    setAwarded(null);

    const res = await fetch(`/api/admin/submissions/${submissionId}/grade`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ grade: g, feedback, needsRevision }),
    });
    setBusy(false);

    if (res.ok) {
      const j = await res.json();
      setFlash({ kind: "success", message: "Grade saved." });
      if (j.award?.awarded) {
        setAwarded({ name: j.award.badgeName, points: j.award.pointsEarned });
      }
      router.refresh();

      if (thenAdvance && nextUngradedId) {
        setTimeout(() => {
          router.push(`/admin/assignments/${assignmentId}/submissions/${nextUngradedId}`);
        }, 600);
      }
    } else {
      const j = await res.json().catch(() => ({}));
      setFlash({ kind: "error", message: j.error ?? "Could not save." });
    }
  }

  const passing = grade !== "" && parseFloat(grade) >= passingScore;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Grade</CardTitle>
        <CardDescription>
          Pass at <span className="font-medium text-brown-deep">{passingScore}%</span>. A passing
          grade auto-awards the Week {weekNumber} milestone badge.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="grade">Score (0–100)</Label>
          <div className="flex items-center gap-3">
            <Input
              id="grade"
              type="number"
              min={0}
              max={100}
              step={1}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-32"
            />
            <span className="text-sm text-muted">
              {grade === ""
                ? "Leave blank to clear grade"
                : passing
                  ? "✓ Passing"
                  : "Below passing threshold"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback">Written feedback</Label>
          <Textarea
            id="feedback"
            rows={8}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What worked? What would you push them to improve next time?"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-md border border-cream-mid bg-cream-mid/20 p-3 text-sm">
          <input
            type="checkbox"
            checked={needsRevision}
            onChange={(e) => setNeedsRevision(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-gold"
          />
          <span>
            <span className="font-medium text-brown-deep">Request revision</span>
            <span className="block text-xs text-muted">
              Student can edit and re-submit. Useful when the work is on track but not yet
              passing.
            </span>
          </span>
        </label>

        {flash && <FlashLine flash={flash} />}

        {awarded && (
          <div className="flex items-start gap-2 rounded-md border border-gold bg-gold-pale px-3 py-2 text-sm">
            <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>
              <span className="font-medium text-brown-deep">Badge awarded:</span> {awarded.name} —
              +{awarded.points} XP
            </span>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => save(false)} disabled={busy}>
            {busy ? "Saving…" : "Save grade"}
          </Button>
          {nextUngradedId && (
            <Button onClick={() => save(true)} disabled={busy}>
              {busy ? "Saving…" : "Save & next ungraded"} <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FlashLine({ flash }: { flash: { kind: "success" | "error"; message: string } }) {
  const Icon = flash.kind === "success" ? Check : AlertCircle;
  const cls =
    flash.kind === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-terra/40 bg-terra/10 text-terra";
  return (
    <div className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{flash.message}</span>
    </div>
  );
}
