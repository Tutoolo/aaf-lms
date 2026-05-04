import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { FINANCE_ROLES, hasRole } from "@/lib/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fullPrice, recognizedRevenue, outstandingBalance, formatUSD } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

export default async function PaymentsPage() {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/login");
  if (!hasRole(session.user.role, FINANCE_ROLES)) redirect("/admin");

  const enrollments = await db.enrollment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
      cohort: { select: { name: true } },
    },
    orderBy: [{ enrolledAt: "desc" }],
  });

  // Aggregate
  const totalRecognized = enrollments.reduce(
    (sum, e) => sum + recognizedRevenue(e.track, e.paymentStatus),
    0,
  );
  const totalOutstanding = enrollments.reduce(
    (sum, e) => sum + outstandingBalance(e.track, e.paymentStatus),
    0,
  );
  const refundedCount = enrollments.filter((e) => e.paymentStatus === "REFUNDED").length;
  const refundedAmount = enrollments
    .filter((e) => e.paymentStatus === "REFUNDED")
    .reduce((sum, e) => sum + fullPrice(e.track), 0);

  const byTrack = (track: "SELF_PACED" | "FELLOWSHIP" | "SCHOLARSHIP") =>
    enrollments.filter((e) => e.track === track);

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Finance</span>
        <h1 className="mt-2 font-display text-4xl font-semibold text-brown-deep">Payments</h1>
        <p className="mt-1 text-muted">
          Revenue, outstanding balances, and refunds across all enrollments.
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={TrendingUp}
          label="Recognized revenue"
          value={formatUSD(totalRecognized)}
          sub={`${enrollments.filter((e) => e.paymentStatus !== "UNPAID" && e.paymentStatus !== "WAIVED" && e.paymentStatus !== "REFUNDED").length} paying enrollments`}
          tone="gold"
        />
        <Stat
          icon={AlertCircle}
          label="Outstanding"
          value={formatUSD(totalOutstanding)}
          sub={`${enrollments.filter((e) => e.paymentStatus === "UNPAID" || e.paymentStatus === "PARTIAL").length} pending`}
          tone="terra"
        />
        <Stat
          icon={CheckCircle2}
          label="Scholarships waived"
          value={byTrack("SCHOLARSHIP").length.toString()}
          sub={`${formatUSD(byTrack("SCHOLARSHIP").length * fullPrice("FELLOWSHIP"))} value`}
          tone="default"
        />
        <Stat
          icon={CreditCard}
          label="Refunds"
          value={refundedCount.toString()}
          sub={refundedAmount > 0 ? `${formatUSD(refundedAmount)} refunded` : "None this period"}
          tone="default"
        />
      </div>

      {/* Revenue by track */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">By track</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <TrackTile label="Self-Paced ($350)" enrollments={byTrack("SELF_PACED")} />
            <TrackTile label="Fellowship ($850)" enrollments={byTrack("FELLOWSHIP")} highlight />
            <TrackTile label="Scholarship (Free)" enrollments={byTrack("SCHOLARSHIP")} />
          </div>
        </CardContent>
      </Card>

      {/* Per-enrollment table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All enrollments</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-cream-mid bg-cream-mid/30">
              <tr className="text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Track</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Recognized</th>
                <th className="px-6 py-3">Outstanding</th>
                <th className="px-6 py-3">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e.id} className="border-b border-cream-mid">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={e.user.avatar ?? undefined} alt={e.user.name} />
                        <AvatarFallback>{e.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-brown-deep">{e.user.name}</div>
                        <div className="text-xs text-muted">{e.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {e.track.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-3">
                    <PaymentStatusBadge status={e.paymentStatus} />
                  </td>
                  <td className="px-6 py-3 font-medium text-brown-deep">
                    {formatUSD(recognizedRevenue(e.track, e.paymentStatus))}
                  </td>
                  <td className="px-6 py-3 text-terra">
                    {outstandingBalance(e.track, e.paymentStatus) > 0
                      ? formatUSD(outstandingBalance(e.track, e.paymentStatus))
                      : "—"}
                  </td>
                  <td className="px-6 py-3 text-xs text-muted">{formatDate(e.enrolledAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="text-xs text-muted">
        Stripe is currently in mock mode — set STRIPE_SECRET_KEY in .env.local to enable real
        checkout, webhooks, and refund actions.
      </p>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
  tone: "gold" | "terra" | "default";
}) {
  const iconClass =
    tone === "gold" ? "text-gold" : tone === "terra" ? "text-terra" : "text-brown-deep";
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className={`h-5 w-5 ${iconClass}`} />
        <div className="mt-3 font-display text-3xl font-semibold text-brown-deep">{value}</div>
        <div className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</div>
        <div className="mt-1 text-xs text-muted">{sub}</div>
      </CardContent>
    </Card>
  );
}

function TrackTile({
  label,
  enrollments,
  highlight,
}: {
  label: string;
  enrollments: any[];
  highlight?: boolean;
}) {
  const recognized = enrollments.reduce(
    (sum, e) => sum + recognizedRevenue(e.track, e.paymentStatus),
    0,
  );
  return (
    <div
      className={`rounded-lg border p-4 ${highlight ? "border-gold bg-gold-pale/40" : "border-cream-mid"}`}
    >
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold text-brown-deep">
        {formatUSD(recognized)}
      </div>
      <div className="mt-1 text-xs text-muted">
        {enrollments.length} {enrollments.length === 1 ? "enrollment" : "enrollments"}
      </div>
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: "UNPAID" | "PARTIAL" | "PAID" | "REFUNDED" | "WAIVED" }) {
  const variant: Record<typeof status, "success" | "warning" | "secondary" | "destructive" | "outline"> = {
    PAID: "success",
    PARTIAL: "warning",
    UNPAID: "destructive",
    REFUNDED: "outline",
    WAIVED: "secondary",
  };
  return (
    <Badge variant={variant[status] as any} className="text-[10px]">
      {status}
    </Badge>
  );
}
