/**
 * Curriculum data — the canonical source of truth for the 10-week
 * AI Agent Engineering Fellowship. Used by:
 *   • the public marketing site (/curriculum)
 *   • the student curriculum browser (/dashboard/curriculum)
 *   • the seed script (prisma/seed.ts)
 *
 * Edit this file to update curriculum across the platform.
 */

export type ActNumber = 1 | 2 | 3;

export const ACTS: Record<
  ActNumber,
  { name: string; subtitle: string; cssVar: string; tw: string }
> = {
  1: {
    name: "Act I — Foundation",
    subtitle: "Understand the agent, master the model",
    cssVar: "var(--act1)",
    tw: "act1",
  },
  2: {
    name: "Act II — Build",
    subtitle: "Compose, deploy, and orchestrate real systems",
    cssVar: "var(--act2)",
    tw: "act2",
  },
  3: {
    name: "Act III — Launch",
    subtitle: "Ship to a real client. Stand on the Demo Day stage.",
    cssVar: "var(--act3)",
    tw: "act3",
  },
};

export type LessonSeed = {
  title: string;
  type: "VIDEO" | "LIVE" | "ASYNC_WORKSHOP" | "SANDBOX" | "READING";
  dayLabel: string;
  duration: number; // seconds
};

export type LaunchBlock = {
  /** Short label, e.g. "Pricing your work" */
  title: string;
  /** 1–2 sentences explaining what this block covers. */
  description: string;
};

export type WeekSeed = {
  weekNumber: number;
  actNumber: ActNumber;
  title: string;
  tagline: string;
  /** 2–3 concrete capabilities the student will have by end of week. */
  outcomes: string[];
  /** One sentence describing what they'll ship by the end of the week. */
  deliverable: string;
  /**
   * Optional 45-minute commercial-skills block that runs before each live
   * session. Fellowship-tier only — not shown on the Self-Paced experience.
   * Currently used on weeks 5–10.
   */
  launchBlock?: LaunchBlock;
  lessons: LessonSeed[];
  hasQuiz?: boolean;
  hasLive?: boolean;
};

export const CURRICULUM: WeekSeed[] = [
  {
    weekNumber: 1,
    actNumber: 1,
    title: "Welcome to the Agent Era",
    tagline:
      "Why agents matter, how they differ from chatbots, and what you'll build by Week 10.",
    outcomes: [
      "Articulate what makes an agent fundamentally different from a chatbot",
      "Make your first Claude API call with a clear system prompt and task",
      "Reason about agent design constraints before writing a line of code",
    ],
    deliverable:
      "Your first working Claude integration — a single-purpose agent with a defined task and a clean system prompt.",
    hasQuiz: true,
    hasLive: true,
    lessons: [
      { title: "Orientation: Cohort Kickoff", type: "LIVE", dayLabel: "Day 1 — Mon", duration: 5400 },
      { title: "What Is an AI Agent? A Working Definition", type: "VIDEO", dayLabel: "Day 2 — Tue", duration: 1800 },
      { title: "The Anatomy of Claude: Tools, Context, and Memory", type: "VIDEO", dayLabel: "Day 3 — Wed", duration: 2100 },
      { title: "Workshop: Your First Claude API Call", type: "SANDBOX", dayLabel: "Day 4 — Thu", duration: 3600 },
      { title: "Reading: The Agent Engineer's Mindset", type: "READING", dayLabel: "Day 5 — Fri", duration: 1200 },
    ],
  },
  {
    weekNumber: 2,
    actNumber: 1,
    title: "Prompt Engineering at Production Scale",
    tagline:
      "Move beyond clever prompts — design instruction systems that survive contact with real users.",
    outcomes: [
      "Design system prompts that hold up against unpredictable real-world inputs",
      "Choose between few-shot, chain-of-thought, and structured-output techniques on purpose",
      "Build an evaluation harness that catches regressions before users do",
    ],
    deliverable:
      "A production-ready prompt paired with an eval harness that scores it across a test set.",
    hasLive: true,
    lessons: [
      { title: "The Anatomy of a Production Prompt", type: "VIDEO", dayLabel: "Day 1 — Mon", duration: 2400 },
      { title: "System Prompts vs. User Prompts vs. Tool Definitions", type: "VIDEO", dayLabel: "Day 2 — Tue", duration: 1800 },
      { title: "Live Workshop: Refactoring a Brittle Prompt", type: "LIVE", dayLabel: "Day 3 — Wed", duration: 5400 },
      { title: "Sandbox: Build a Prompt Evaluation Harness", type: "SANDBOX", dayLabel: "Day 4 — Thu", duration: 3600 },
      { title: "Async: Few-Shot, Chain-of-Thought, and When Each Wins", type: "ASYNC_WORKSHOP", dayLabel: "Day 5 — Fri", duration: 2700 },
    ],
  },
  {
    weekNumber: 3,
    actNumber: 1,
    title: "Tools & Tool Use",
    tagline:
      "Give your agent hands. Define tools cleanly, parse arguments, and recover from failure gracefully.",
    outcomes: [
      "Design tool schemas that Claude actually calls correctly the first time",
      "Handle tool failures, retries, and ambiguous arguments without breaking the loop",
      "Compose multi-tool agents that pick the right tool for each subtask",
    ],
    deliverable:
      "A multi-tool research agent that searches, summarizes, and cites sources for any topic you point it at.",
    hasLive: true,
    lessons: [
      { title: "How Tool Use Works Under the Hood", type: "VIDEO", dayLabel: "Day 1 — Mon", duration: 2100 },
      { title: "Designing Tool Schemas Your Agent Will Actually Use", type: "VIDEO", dayLabel: "Day 2 — Tue", duration: 1800 },
      { title: "Live: Building a Multi-Tool Research Agent", type: "LIVE", dayLabel: "Day 3 — Wed", duration: 5400 },
      { title: "Sandbox: Tool Failure Modes & Retry Patterns", type: "SANDBOX", dayLabel: "Day 4 — Thu", duration: 3600 },
      { title: "Reading: The Hidden Cost of Bad Tool Design", type: "READING", dayLabel: "Day 5 — Fri", duration: 1500 },
    ],
  },
  {
    weekNumber: 4,
    actNumber: 1,
    title: "Memory, Context & Retrieval",
    tagline:
      "Agents that remember. RAG, vector stores, and the art of stuffing the right tokens.",
    outcomes: [
      "Build a retrieval-augmented generation system from first principles",
      "Pick embedding models that work for your use case — including African languages",
      "Manage long context windows under real cost and latency constraints",
    ],
    deliverable:
      "A RAG-powered knowledge agent grounded in a domain-specific corpus you assemble yourself.",
    hasQuiz: true,
    hasLive: true,
    lessons: [
      { title: "Context Windows Are a Lie (Sort Of)", type: "VIDEO", dayLabel: "Day 1 — Mon", duration: 2100 },
      { title: "RAG From First Principles", type: "VIDEO", dayLabel: "Day 2 — Tue", duration: 2400 },
      { title: "Live: Building a Knowledge-Grounded Agent", type: "LIVE", dayLabel: "Day 3 — Wed", duration: 5400 },
      { title: "Sandbox: Vector Stores in 60 Lines of Python", type: "SANDBOX", dayLabel: "Day 4 — Thu", duration: 3600 },
      { title: "Async: Choosing Embedding Models for African Languages", type: "ASYNC_WORKSHOP", dayLabel: "Day 5 — Fri", duration: 2700 },
    ],
  },
  {
    weekNumber: 5,
    actNumber: 2,
    title: "Multi-Agent Architectures",
    tagline:
      "Orchestrators, specialists, and supervisors — when one agent isn't enough.",
    outcomes: [
      "Recognize when multi-agent is the right pattern (and when it's pointless complexity)",
      "Implement pipeline, supervisor, and hierarchical patterns from scratch",
      "Handle agent-to-agent handoffs without dropping state or context",
    ],
    deliverable:
      "A 3-agent research → draft → edit pipeline you can run end-to-end on any prompt.",
    launchBlock: {
      title: "Pricing your work as an agent engineer",
      description:
        "How to set hourly and project rates that reflect AI-engineering scarcity, with real benchmarks for African and diaspora builders.",
    },
    hasLive: true,
    lessons: [
      { title: "When You Actually Need Multiple Agents", type: "VIDEO", dayLabel: "Day 1 — Mon", duration: 2100 },
      { title: "Patterns: Pipeline, Network, Supervisor, Hierarchical", type: "VIDEO", dayLabel: "Day 2 — Tue", duration: 2700 },
      { title: "Live: Building a 3-Agent Research → Draft → Edit Pipeline", type: "LIVE", dayLabel: "Day 3 — Wed", duration: 5400 },
      { title: "Sandbox: Agent-to-Agent Handoff in LangGraph", type: "SANDBOX", dayLabel: "Day 4 — Thu", duration: 4200 },
      { title: "Reading: The Coordination Tax", type: "READING", dayLabel: "Day 5 — Fri", duration: 1500 },
    ],
  },
  {
    weekNumber: 6,
    actNumber: 2,
    title: "Workflows & Automation",
    tagline:
      "Glue your agents into the world — Make.com, Zapier, webhooks, and event-driven design.",
    outcomes: [
      "Connect agents to real-world tools through Make.com, Zapier, and raw webhooks",
      "Design event-driven workflows that respond to triggers, not user clicks",
      "Plan for failure modes that only show up in production",
    ],
    deliverable:
      "An end-to-end sales-outreach agent that triggers on real events and writes back to a CRM.",
    launchBlock: {
      title: "Positioning — engineer, consultant, or founder?",
      description:
        "Three career paths, what each pays and costs, and how to pick your first three target clients on purpose.",
    },
    hasLive: true,
    lessons: [
      { title: "The Agent + Workflow Pattern", type: "VIDEO", dayLabel: "Day 1 — Mon", duration: 1800 },
      { title: "Make.com Deep Dive for Agent Engineers", type: "VIDEO", dayLabel: "Day 2 — Tue", duration: 2700 },
      { title: "Live: Building an End-to-End Sales Outreach Agent", type: "LIVE", dayLabel: "Day 3 — Wed", duration: 5400 },
      { title: "Sandbox: Webhooks, Queues, and Async Triggers", type: "SANDBOX", dayLabel: "Day 4 — Thu", duration: 3600 },
      { title: "Async: Designing for Failure in Production Workflows", type: "ASYNC_WORKSHOP", dayLabel: "Day 5 — Fri", duration: 2400 },
    ],
  },
  {
    weekNumber: 7,
    actNumber: 2,
    title: "Evaluation, Safety & Guardrails",
    tagline:
      "How do you know your agent is good? How do you stop it being dangerous?",
    outcomes: [
      "Build eval harnesses that catch quality regressions before users do",
      "Implement guardrails, output filters, and PII scrubbing that actually hold up",
      "Red-team your own agents — and know what to do with the failures you find",
    ],
    deliverable:
      "A guardrail-protected agent shipped with measurable safety and quality metrics.",
    launchBlock: {
      title: "Writing a proposal that closes",
      description:
        "The 5-part agent-project proposal structure, pricing presentation that doesn't get negotiated down, and saying no to the wrong work.",
    },
    hasQuiz: true,
    hasLive: true,
    lessons: [
      { title: "Evals Are the Whole Job", type: "VIDEO", dayLabel: "Day 1 — Mon", duration: 2400 },
      { title: "Building an Eval Harness in Practice", type: "VIDEO", dayLabel: "Day 2 — Tue", duration: 2100 },
      { title: "Live: Red-Teaming Your Own Agent", type: "LIVE", dayLabel: "Day 3 — Wed", duration: 5400 },
      { title: "Sandbox: Guardrails, Output Filters, and PII Scrubbing", type: "SANDBOX", dayLabel: "Day 4 — Thu", duration: 3600 },
      { title: "Reading: The Ethics of Deploying Agents in Africa", type: "READING", dayLabel: "Day 5 — Fri", duration: 1800 },
    ],
  },
  {
    weekNumber: 8,
    actNumber: 3,
    title: "Client Project Kickoff",
    tagline:
      "Real briefs, real stakeholders. You'll be assigned a client and a problem to solve.",
    outcomes: [
      "Scope an agent project against a real client brief without drowning in scope creep",
      "Run discovery interviews like a consultant, not a coder",
      "Communicate technical decisions clearly to non-engineers",
    ],
    deliverable:
      "A working prototype paired with a one-page scoping document signed off by your client.",
    launchBlock: {
      title: "Discovery & scoping that surfaces real budget",
      description:
        "Run a 30-minute discovery call that reveals what the client will actually pay. Write a scope doc they sign — and that kills scope creep before it starts.",
    },
    hasLive: true,
    lessons: [
      { title: "Meet Your Client: Live Brief Reveal", type: "LIVE", dayLabel: "Day 1 — Mon", duration: 5400 },
      { title: "Scoping an Agent Project Without Drowning", type: "VIDEO", dayLabel: "Day 2 — Tue", duration: 2100 },
      { title: "Live: Discovery Interview Practice", type: "LIVE", dayLabel: "Day 3 — Wed", duration: 5400 },
      { title: "Sandbox: Build a Working Prototype", type: "SANDBOX", dayLabel: "Day 4 — Thu", duration: 5400 },
      { title: "Async: Communicating Technical Decisions to Non-Engineers", type: "ASYNC_WORKSHOP", dayLabel: "Day 5 — Fri", duration: 2400 },
    ],
  },
  {
    weekNumber: 9,
    actNumber: 3,
    title: "The 48-Hour Hackathon",
    tagline:
      "Ship a polished v1. Sleep is optional, demos are not.",
    outcomes: [
      "Ship a polished v1 of your client agent under real time pressure",
      "Make architecture decisions in real time without losing the plot",
      "Demo your work live to peers, mentors, and your client",
    ],
    deliverable:
      "A v1 of your client-facing agent, demoed end-to-end on Sunday evening.",
    launchBlock: {
      title: "Pitching what you built",
      description:
        "The Demo Day pitch structure (problem → architecture → impact), story-first technical demos, and reading the room in real time.",
    },
    hasLive: true,
    lessons: [
      { title: "Hackathon Kickoff & Team Pairing", type: "LIVE", dayLabel: "Day 1 — Fri", duration: 1800 },
      { title: "Build Block I: Architecture & Plumbing", type: "SANDBOX", dayLabel: "Day 2 — Sat", duration: 28800 },
      { title: "Build Block II: Polish & Demo Prep", type: "SANDBOX", dayLabel: "Day 3 — Sun", duration: 28800 },
      { title: "Live Demo Showcase", type: "LIVE", dayLabel: "Day 4 — Sun PM", duration: 5400 },
      { title: "Reading: How to Tell the Story of What You Built", type: "READING", dayLabel: "Day 5 — Mon", duration: 1500 },
    ],
  },
  {
    weekNumber: 10,
    actNumber: 3,
    title: "Demo Day & Beyond",
    tagline:
      "Stand on the stage. Walk into a job market that didn't exist 18 months ago.",
    outcomes: [
      "Pitch your agent to an industry panel of recruiters and operators",
      "Position yourself credibly as an agent engineer in the job market",
      "Plan your first six months post-fellowship with concrete next moves",
    ],
    deliverable:
      "A polished Demo Day pitch and a personalized career-launch plan you'll execute against.",
    launchBlock: {
      title: "Post-Fellowship: clients, contracts, content, community",
      description:
        "Your first three clients in 60 days, a weekly content plan that builds authority, contract templates, and what *not* to chase (including patents).",
    },
    hasLive: true,
    lessons: [
      { title: "Final Polish & Mentor Rehearsal", type: "LIVE", dayLabel: "Day 1 — Mon", duration: 5400 },
      { title: "Demo Day: Live Showcase to Industry Panel", type: "LIVE", dayLabel: "Day 2 — Tue", duration: 10800 },
      { title: "Career Workshop: Positioning Yourself as an Agent Engineer", type: "VIDEO", dayLabel: "Day 3 — Wed", duration: 2700 },
      { title: "Async: Open Source, Personal Brand, and the First 6 Months", type: "ASYNC_WORKSHOP", dayLabel: "Day 4 — Thu", duration: 2700 },
      { title: "Closing Ceremony & Certificate Awards", type: "LIVE", dayLabel: "Day 5 — Fri", duration: 3600 },
    ],
  },
];

export const PRICING_TIERS = [
  {
    id: "self_paced",
    name: "Self-Paced",
    price: 350,
    priceLabel: "$350",
    track: "SELF_PACED" as const,
    features: [
      "All 10 weeks of recorded lessons",
      "Sandbox environment",
      "Community forum access",
      "Certificate on 80%+ completion",
      "Lifetime access to course materials",
    ],
    notIncluded: [
      "Live cohort sessions",
      "Client project & Demo Day",
      "1:1 instructor feedback",
    ],
    cta: "Start Self-Paced",
    highlight: false,
  },
  {
    id: "fellowship",
    name: "Fellowship",
    price: 850,
    priceLabel: "$850",
    track: "FELLOWSHIP" as const,
    features: [
      "Everything in Self-Paced",
      "Live weekly cohort sessions",
      "Real client project (Act III)",
      "48-hour hackathon",
      "Demo Day to industry panel",
      "Instructor feedback on all assignments",
      "Job market positioning support",
    ],
    cta: "Apply for Fellowship",
    highlight: true,
    badge: "Most popular",
  },
  {
    id: "scholarship",
    name: "Scholarship",
    price: 0,
    priceLabel: "Free",
    track: "SCHOLARSHIP" as const,
    features: [
      "Full Fellowship experience",
      "Reserved for African & diaspora applicants who demonstrate need + commitment",
      "Application required (motivation + portfolio)",
      "Limited seats per cohort",
    ],
    cta: "Apply for Scholarship",
    highlight: false,
    badge: "Funded",
  },
];

export const PROGRAM_STATS = [
  { value: "10", label: "Weeks" },
  { value: "3", label: "Acts" },
  { value: "Real", label: "Client Projects" },
  { value: "48hr", label: "Hackathon" },
];
