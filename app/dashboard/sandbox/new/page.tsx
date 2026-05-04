import { PageStub } from "@/components/layout/page-stub";

export default function NewSandboxPage() {
  return (
    <PageStub
      title="New Sandbox Project"
      description="Pick a template and name your project."
      features={[
        "Template gallery: Blank Agent, Claude API Starter, LangChain Chain, Make.com Webhook, Anthropic Tools Demo, Prompt Engineering Lab",
        "Each template seeds the editor with starter code + agentConfig",
        "Project saves to SandboxProject table; redirect to /dashboard/sandbox/[id] on create",
      ]}
    />
  );
}
