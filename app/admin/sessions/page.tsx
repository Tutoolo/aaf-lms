import { PageStub } from "@/components/layout/page-stub";

export default function AdminSessionsPage() {
  return (
    <PageStub
      title="Live Session Manager"
      description="Schedule, run, and review live cohort sessions."
      features={[
        "Schedule: title, week, date/time, agenda (bullet list)",
        "Auto-create 100ms / Daily room via API + invite link",
        "Email students via Resend",
        "Start session button (opens classroom as instructor)",
        "Recordings list: duration, download, publish-to-lesson toggle",
        "Per-session attendance report",
      ]}
    />
  );
}
