import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Award } from "lucide-react";
import Link from "next/link";

export default async function QuizzesPage() {
  const quizzes = await db.quiz.findMany({
    where: { isPublished: true },
    include: { week: true, questions: { select: { id: true } } },
    orderBy: { week: { weekNumber: "asc" } },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Quizzes & Exams</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">Test your understanding</h1>
        <p className="mt-1 text-muted">Quizzes track your grasp of each module's core concepts.</p>
      </div>

      <div className="grid gap-3">
        {quizzes.map((q) => (
          <Link key={q.id} href={`/dashboard/quizzes/${q.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <Badge variant={`act${q.week.actNumber}` as any}>Week {q.week.weekNumber}</Badge>
                  <h3 className="mt-1 font-display text-lg font-semibold text-brown-deep">{q.title}</h3>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted">
                    <span>{q.questions.length} questions</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{q.timeLimit} min</span>
                    <span className="inline-flex items-center gap-1"><Award className="h-3 w-3" />Pass {q.passingScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
