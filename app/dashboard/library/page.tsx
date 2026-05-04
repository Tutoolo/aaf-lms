import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Github, Wrench, FileText, Link as LinkIcon, Star } from "lucide-react";

const TYPE_ICON = {
  PDF: FileText,
  LINK: LinkIcon,
  GITHUB: Github,
  TOOL: Wrench,
  TEMPLATE: BookOpen,
  VIDEO: BookOpen,
} as const;

export default async function LibraryPage() {
  const resources = await db.resource.findMany({
    include: { week: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Library</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">Resources & Tools</h1>
        <p className="mt-1 text-muted">Everything referenced in the curriculum, plus instructor-curated extras.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => {
          const Icon = TYPE_ICON[r.type] ?? BookOpen;
          return (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-cream-mid p-2">
                      <Icon className="h-4 w-4 text-brown-deep" />
                    </div>
                    {r.isFeatured && (
                      <Star className="h-4 w-4 fill-gold text-gold" />
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-brown-deep">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted">{r.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    {r.week && <Badge variant={`act${r.week.actNumber}` as any} className="text-[10px]">Week {r.week.weekNumber}</Badge>}
                    <ExternalLink className="h-3 w-3 text-muted transition-colors group-hover:text-gold" />
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
