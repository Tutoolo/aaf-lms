import { PageStub } from "@/components/layout/page-stub";

export default function ProgressPage() {
  return (
    <PageStub
      title="Progress Report"
      description="Visualize your journey across all 10 weeks."
      features={[
        "Overall progress ring (% of all lessons)",
        "Act-by-act completion bars (color-coded)",
        "Week-by-week heatmap calendar (GitHub-style contributions)",
        "Lesson completion timeline",
        "Assignment grades chart (per week bar chart, Recharts)",
        "Quiz performance tracker with score history",
        "Streak stats: current, longest, total active days",
        "Estimated completion date based on current pace",
        "Status: On Track / Behind / Ahead with actionable suggestion",
        "Downloadable PDF progress summary (Puppeteer)",
      ]}
    />
  );
}
