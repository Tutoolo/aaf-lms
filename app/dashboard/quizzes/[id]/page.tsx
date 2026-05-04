import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageStub } from "@/components/layout/page-stub";

export default async function QuizDetail({ params }: { params: { id: string } }) {
  const q = await db.quiz.findUnique({
    where: { id: params.id },
    include: { week: true, questions: true },
  });
  if (!q) notFound();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Badge variant={`act${q.week.actNumber}` as any}>Week {q.week.weekNumber}</Badge>
          <h1 className="mt-2 font-display text-3xl font-semibold text-brown-deep">{q.title}</h1>
          <p className="mt-2 text-sm text-muted">
            {q.questions.length} questions · {q.timeLimit} min · Pass {q.passingScore}% · {q.attempts} attempts allowed
          </p>
        </CardContent>
      </Card>

      <PageStub
        title="Quiz Player"
        description="Full-screen quiz experience with timer, flagging, navigator, and per-question feedback."
        features={[
          "Full-screen focus mode (sidebar hides)",
          "Timer countdown with auto-submit on expiry",
          "Question types: MCQ, True/False, Code Fill (Monaco + Judge0), Short Answer",
          "Flag-for-review + question navigator panel",
          "Submit confirmation with unanswered count",
          "Results page: per-question feedback, retry, recommendations",
          "Exam mode: full-screen lock, tab-switch warning, no copy-paste",
        ]}
      />
    </div>
  );
}
