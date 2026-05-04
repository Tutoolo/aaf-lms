import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { integrationStatus } from "@/lib/integrations";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function DeveloperAdminPage() {
  const status = integrationStatus();

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Developer</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">System health</h1>
        <p className="mt-1 text-muted">
          Integration mode reflects the env-var keys present at boot. Mock = stub
          implementation. Live = real SDK calls.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Integrations</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(status).map(([name, mode]) => {
              const live = mode === "live";
              const Icon = live ? CheckCircle2 : AlertCircle;
              return (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border border-cream-mid p-4"
                >
                  <div>
                    <div className="font-medium capitalize text-brown-deep">{name}</div>
                    <div className="mt-1 text-xs text-muted">
                      {live ? "Real SDK active" : "Stub running — set keys to enable"}
                    </div>
                  </div>
                  <Badge variant={live ? "success" : "outline"} className="gap-1">
                    <Icon className="h-3 w-3" />
                    {mode}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Coming in this module</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• API key management — view/regenerate Mux, Anthropic, Stripe, 100ms keys</li>
            <li>• Sandbox configuration — Judge0 endpoint, Anthropic proxy rate limits, package whitelist</li>
            <li>• Feature flags — toggle Sandbox / Live / Peer Review / Auto-Cert per cohort</li>
            <li>• System health — integration ping tests, error log viewer, websocket count</li>
            <li>• Database tools — run seed, full backup (pg_dump), migration history</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
