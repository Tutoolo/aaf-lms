import { PageStub } from "@/components/layout/page-stub";

export default function AdminLibraryPage() {
  return (
    <PageStub
      title="Library Management"
      description="Curate the resource hub students see in /dashboard/library."
      features={[
        "Add resources: title, type, URL, description, week binding",
        "Pin featured resources to the top",
        "Review student-suggested resources (approval queue)",
        "Bulk import from CSV",
      ]}
    />
  );
}
