import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function StudentsPage() {
  const students = await db.user.findMany({
    where: { role: "STUDENT" },
    include: {
      enrollments: { include: { cohort: true } },
      _count: { select: { progress: true, submissions: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Students</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">Roster</h1>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-cream-mid bg-cream-mid/30">
              <tr className="text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Track</th>
                <th className="px-6 py-3">Cohort</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const enr = s.enrollments[0];
                return (
                  <tr key={s.id} className="border-b border-cream-mid">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={s.avatar ?? undefined} alt={s.name} />
                          <AvatarFallback>{s.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-brown-deep">{s.name}</div>
                          <div className="text-xs text-muted">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">{enr && <Badge variant="secondary">{enr.track}</Badge>}</td>
                    <td className="px-6 py-3 text-muted">{enr?.cohort.name ?? "—"}</td>
                    <td className="px-6 py-3">{s._count.progress} lessons</td>
                    <td className="px-6 py-3">{s._count.submissions}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
