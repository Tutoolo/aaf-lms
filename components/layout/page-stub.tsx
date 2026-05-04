import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PageStubProps {
  title: string;
  description: string;
  /** What this module will eventually contain — shown as a checklist. */
  features: string[];
  /** Optional roadmap note shown in muted text. */
  note?: string;
}

export function PageStub({ title, description, features, note }: PageStubProps) {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Module</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">{description}</p>
      </div>

      <Card className="border-2 border-dashed border-gold/30">
        <CardContent className="p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-gold-pale p-2">
              <Construction className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-brown-deep">
                Scaffold ready, build pending
              </h2>
              <p className="text-xs text-muted">
                Routing, layout, and data model in place. Module-specific UI ships in a follow-up session.
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {note && (
            <p className="mt-6 border-t border-cream-mid pt-4 text-xs italic text-muted">
              {note}
            </p>
          )}
          <div className="mt-6 text-xs text-muted">
            <Link href="/dashboard" className="text-gold hover:underline">
              ← Back to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
