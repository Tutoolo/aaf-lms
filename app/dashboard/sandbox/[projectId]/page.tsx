import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageStub } from "@/components/layout/page-stub";

export default async function SandboxEditor({ params }: { params: { projectId: string } }) {
  const project = await db.sandboxProject.findUnique({ where: { id: params.projectId } });
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Badge variant="secondary">{project.language}</Badge>
          <h1 className="mt-2 font-display text-3xl font-semibold text-brown-deep">{project.title}</h1>
          <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-brown-deep p-4 font-mono text-xs text-cream">
{project.code}
          </pre>
        </CardContent>
      </Card>

      <PageStub
        title="Sandbox 3-Panel Editor"
        description="Persistent personal lab for building and testing agents."
        features={[
          "Left panel: file tree + project settings + env var injector (encrypted)",
          "Center: Monaco code editor (Python/JS/JSON/YAML syntax highlight)",
          "Right: output / agent response panel + console (stdout, stderr, API logs)",
          "Run code via Judge0 API (lib/integrations/judge0.ts)",
          "Test Agent button → streamed Anthropic response (lib/integrations/anthropic.ts)",
          "Auto-save every 30 seconds + share-link export to .zip",
          "Floating 'Ask AI' coding tutor with student code as context",
          "Instructor review mode: line comments, fork project for demo",
        ]}
      />
    </div>
  );
}
