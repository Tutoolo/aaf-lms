import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Plus } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

export default async function SandboxPage() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const projects = await db.sandboxProject.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Sandbox</span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">My Sandbox Projects</h1>
          <p className="mt-1 text-muted">Your persistent lab for prototyping agents.</p>
        </div>
        <Link
          href="/dashboard/sandbox/new"
          className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-medium text-brown-deep hover:bg-gold-light"
        >
          <Plus className="h-4 w-4" /> New project
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Link key={p.id} href={`/dashboard/sandbox/${p.id}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <Code2 className="h-5 w-5 text-gold" />
                  <Badge variant="secondary" className="text-[10px]">{p.language}</Badge>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-brown-deep">{p.title}</h3>
                <p className="mt-1 text-xs text-muted">Updated {formatDateTime(p.updatedAt)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-xs text-muted">
        Templates: Blank Agent · Claude API Starter · LangChain Chain · Make.com Webhook · Anthropic Tools Demo · Prompt Engineering Lab
      </p>
    </div>
  );
}
