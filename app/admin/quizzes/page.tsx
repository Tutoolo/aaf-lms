import { PageStub } from "@/components/layout/page-stub";

export default function AdminQuizzesPage() {
  return (
    <PageStub
      title="Quiz Builder"
      description="Create and analyze quizzes."
      features={[
        "Quiz settings: title, week, time limit, pass score, max attempts, feedback mode",
        "Question editor: form changes per type (MCQ adds option adder, Code Fill gets expected output)",
        "Reorder questions (drag-and-drop)",
        "Preview as student",
        "Per-question analytics: % correct, time spent, common wrong answer",
      ]}
    />
  );
}
