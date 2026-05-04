import { PageStub } from "@/components/layout/page-stub";

export default function AdminSettingsPage() {
  return (
    <PageStub
      title="Settings"
      description="Platform-level configuration available to admins."
      features={[
        "Branding (logo, certificate seal, email template colors)",
        "Default cohort policies (auto-issue certificates, peer review default, etc.)",
        "User roles & permissions",
        "Email sender identity",
      ]}
    />
  );
}
