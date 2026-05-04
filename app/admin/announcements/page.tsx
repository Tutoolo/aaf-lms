import { PageStub } from "@/components/layout/page-stub";

export default function AnnouncementsPage() {
  return (
    <PageStub
      title="Announcements"
      description="Broadcast to your cohort or individual students."
      features={[
        "Create cohort-wide or individual announcements",
        "Show in student dashboard banner + notification bell",
        "Optionally email all enrolled students via Resend",
        "Schedule announcements (e.g. 'send Monday morning')",
      ]}
    />
  );
}
