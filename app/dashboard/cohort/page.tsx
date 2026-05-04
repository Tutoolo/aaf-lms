import { PageStub } from "@/components/layout/page-stub";

export default function CohortPage() {
  return (
    <PageStub
      title="My Cohort"
      description="See who else is in your cohort, what week everyone is on, and where you stand on the leaderboard."
      features={[
        "Cohort roster with avatars + active status",
        "This-week activity feed (lessons completed, projects shared, forum posts)",
        "Cohort leaderboard (engagement score, not grades)",
        "Direct message a cohort mate",
        "Pinned cohort announcements from the instructor",
      ]}
    />
  );
}
