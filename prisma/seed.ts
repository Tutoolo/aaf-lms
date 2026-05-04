/**
 * Seed script — populates a fresh database with demo data:
 *   • 1 admin, 1 instructor, 5 students
 *   • 1 active cohort: "Founding Cohort — October 2025"
 *   • 1 course with all 10 weeks (titles + taglines from lib/curriculum.ts)
 *   • Lessons per week (mix of types)
 *   • 3 quizzes (Weeks 1, 4, 7)
 *   • 5 library resources
 *   • 2 forum threads with replies
 *   • 1 sandbox project per student
 *   • Enrollments + varied progress so the dashboard feels alive
 *
 * Run with:  npm run db:seed
 */

import { PrismaClient, Role, CohortStatus, Track, EnrollmentStatus, PaymentStatus, LessonType, LiveSessionStatus, SubmissionType, QuestionType, ProgressStatus, ResourceType, BadgeCategory, BadgeRarity } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CURRICULUM } from "../lib/curriculum";

const prisma = new PrismaClient();

async function hash(pw: string) {
  return bcrypt.hash(pw, 10);
}

async function main() {
  console.log("🌱  Seeding Fellowship Platform…");

  // ─── Wipe (idempotent) ────────────────────────────
  await prisma.notification.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.forumReply.deleteMany();
  await prisma.forumThread.deleteMany();
  await prisma.sandboxProject.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.liveSession.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.week.deleteMany();
  await prisma.course.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.cohort.deleteMany();

  // ─── Cohort ───────────────────────────────────────
  const cohort = await prisma.cohort.create({
    data: {
      name: "Founding Cohort — October 2025",
      startDate: new Date("2025-10-06"),
      endDate: new Date("2025-12-12"),
      status: CohortStatus.ACTIVE,
      maxStudents: 30,
      pricingTier: "standard",
    },
  });
  console.log(`✓ Cohort: ${cohort.name}`);

  // ─── Users ────────────────────────────────────────
  const password = await hash("fellowship2025");

  const admin = await prisma.user.create({
    data: {
      name: "Ada Admin",
      email: "admin@fellowship.local",
      password,
      role: Role.ADMIN,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      bio: "Platform administrator.",
    },
  });

  const instructor = await prisma.user.create({
    data: {
      name: "Kwame Asante",
      email: "instructor@fellowship.local",
      password,
      role: Role.INSTRUCTOR,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      bio: "Lead instructor — built agent systems at Anthropic, ex-Google Brain.",
      linkedIn: "https://linkedin.com/in/example",
    },
  });

  const cpc = await prisma.user.create({
    data: {
      name: "Nadia Touré",
      email: "cpc@fellowship.local",
      password,
      role: Role.CHIEF_PROGRAM_COORDINATOR,
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
      bio: "Chief Program Coordinator — owns curriculum standards and certificate issuance across cohorts.",
    },
  });

  const coordinator = await prisma.user.create({
    data: {
      name: "Dapo Adesina",
      email: "coordinator@fellowship.local",
      password,
      role: Role.COHORT_COORDINATOR,
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=200&fit=crop&crop=face",
      bio: "Cohort Coordinator — runs day-to-day operations for the Founding Cohort.",
    },
  });

  const studentSeeds = [
    { name: "Adaeze Okonkwo", email: "adaeze@fellowship.local", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face" },
    { name: "Tunde Bakare", email: "tunde@fellowship.local", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face" },
    { name: "Amani Mwangi", email: "amani@fellowship.local", avatar: "https://images.unsplash.com/photo-1557555187-23d685287bc3?w=200&h=200&fit=crop&crop=face" },
    { name: "Kojo Mensah", email: "kojo@fellowship.local", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face" },
    { name: "Zanele Dlamini", email: "zanele@fellowship.local", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  ];

  const students = await Promise.all(
    studentSeeds.map((s) =>
      prisma.user.create({
        data: {
          name: s.name,
          email: s.email,
          password,
          role: Role.STUDENT,
          avatar: s.avatar,
          cohortId: cohort.id,
          bio: `Aspiring agent engineer based in ${s.name.split(" ")[0]}'s home country.`,
        },
      }),
    ),
  );
  console.log(`✓ Users: 1 admin, 1 CPC, 1 coordinator, 1 instructor, ${students.length} students`);

  // ─── Enrollments — varied tracks + payment statuses for realistic dashboards
  const enrollmentPlans = [
    // Adaeze: paid Fellowship in full
    { track: Track.FELLOWSHIP, payment: PaymentStatus.PAID },
    // Tunde: paid Fellowship via 2-installment, 1 paid so far
    { track: Track.FELLOWSHIP, payment: PaymentStatus.PARTIAL },
    // Amani: scholarship — waived
    { track: Track.SCHOLARSHIP, payment: PaymentStatus.WAIVED },
    // Kojo: paid Self-Paced
    { track: Track.SELF_PACED, payment: PaymentStatus.PAID },
    // Zanele: enrolled in Fellowship but payment still pending
    { track: Track.FELLOWSHIP, payment: PaymentStatus.UNPAID },
  ] as const;

  await Promise.all(
    students.map((s, i) =>
      prisma.enrollment.create({
        data: {
          userId: s.id,
          cohortId: cohort.id,
          track: enrollmentPlans[i].track,
          status:
            enrollmentPlans[i].payment === PaymentStatus.UNPAID
              ? EnrollmentStatus.PENDING
              : EnrollmentStatus.ACTIVE,
          paymentStatus: enrollmentPlans[i].payment,
          scholarshipApproved:
            enrollmentPlans[i].track === Track.SCHOLARSHIP ? true : null,
          motivation:
            enrollmentPlans[i].track === Track.SCHOLARSHIP
              ? "I'm a self-taught engineer in Nairobi who built a Swahili FAQ bot for our family clinic. The Fellowship would let me go deep on production agent design and bring those skills back to East African healthcare."
              : null,
        },
      }),
    ),
  );

  // ─── Course + Weeks + Lessons ─────────────────────
  const course = await prisma.course.create({
    data: {
      title: "AI Agent Engineering Fellowship",
      slug: "agent-engineering-fellowship",
      description:
        "A 10-week cohort program that takes you from your first Claude API call to standing on a Demo Day stage with a real client project.",
      actNumber: 0, // course-level — acts live on weeks
    },
  });

  const weeks = [];
  for (const w of CURRICULUM) {
    const week = await prisma.week.create({
      data: {
        courseId: course.id,
        weekNumber: w.weekNumber,
        title: w.title,
        tagline: w.tagline,
        actNumber: w.actNumber,
        isPublished: w.weekNumber <= 4, // first 4 weeks released
        releaseDate: new Date(2025, 9, 6 + (w.weekNumber - 1) * 7),
        createdById: instructor.id,
      },
    });
    weeks.push(week);

    // Lessons
    for (const [i, l] of w.lessons.entries()) {
      await prisma.lesson.create({
        data: {
          weekId: week.id,
          title: l.title,
          type: l.type as LessonType,
          dayLabel: l.dayLabel,
          duration: l.duration,
          order: i,
          isPublished: w.weekNumber <= 4,
          muxPlaybackId: l.type === "VIDEO" ? `demo-${week.id}-${i}` : null,
          transcript:
            l.type === "VIDEO"
              ? "Welcome to this lesson. In this session we'll cover…"
              : null,
          body:
            l.type === "READING"
              ? "## Why this matters\n\nGreat agents start with great engineers. This reading walks through…"
              : null,
          createdById: instructor.id,
        },
      });
    }

    // Live session for weeks marked hasLive
    if (w.hasLive) {
      const liveLesson = w.lessons.find((l) => l.type === "LIVE");
      await prisma.liveSession.create({
        data: {
          weekId: week.id,
          title: liveLesson?.title ?? `Week ${w.weekNumber} Live Session`,
          scheduledAt: new Date(2025, 9, 8 + (w.weekNumber - 1) * 7, 18, 0),
          durationMin: 90,
          agenda:
            "• Welcome & energy check\n• Concept walk-through\n• Live demo & build along\n• Breakout exercise\n• Q&A and close",
          status:
            w.weekNumber <= 2
              ? LiveSessionStatus.ENDED
              : w.weekNumber === 3
                ? LiveSessionStatus.SCHEDULED
                : LiveSessionStatus.SCHEDULED,
          recordingUrl:
            w.weekNumber <= 2 ? `https://stream.mux.com/demo-week-${w.weekNumber}.m3u8` : null,
        },
      });
    }

    // Assignment per week
    await prisma.assignment.create({
      data: {
        weekId: week.id,
        title: `Week ${w.weekNumber} Assignment: ${w.title}`,
        description: `Apply this week's concepts. ${w.tagline}\n\nDeliverable: a short writeup + working sandbox project.`,
        dueDate: new Date(2025, 9, 13 + (w.weekNumber - 1) * 7),
        submissionType: SubmissionType.URL,
        isPublished: w.weekNumber <= 4,
        createdById: instructor.id,
      },
    });

    // Quiz on weeks 1, 4, 7
    if (w.hasQuiz) {
      const quiz = await prisma.quiz.create({
        data: {
          weekId: week.id,
          title: `Week ${w.weekNumber} Quiz: ${w.title}`,
          timeLimit: 20,
          passingScore: 70,
          attempts: 3,
          isPublished: true,
        },
      });
      await prisma.question.createMany({
        data: [
          {
            quizId: quiz.id,
            text: `Which of the following best distinguishes an "agent" from a chatbot?`,
            type: QuestionType.MCQ,
            options: [
              { id: "a", text: "It uses GPT-4 instead of GPT-3.5" },
              { id: "b", text: "It can take actions in the world via tools" },
              { id: "c", text: "It runs locally rather than in the cloud" },
              { id: "d", text: "It has a conversational UI" },
            ],
            correctAnswer: "b",
            explanation:
              "Agents are defined by their ability to act — to call tools, take real-world actions, and operate in a loop until a goal is met.",
            order: 0,
          },
          {
            quizId: quiz.id,
            text: "True or false: A well-designed system prompt can fully replace tool definitions.",
            type: QuestionType.TRUE_FALSE,
            options: null,
            correctAnswer: "false",
            explanation:
              "System prompts shape behaviour, but tools give the agent capabilities. They are complementary, not interchangeable.",
            order: 1,
          },
          {
            quizId: quiz.id,
            text: "Briefly: name one production failure mode of bad tool design.",
            type: QuestionType.SHORT_ANSWER,
            options: null,
            correctAnswer: "infinite loops, hallucinated arguments, unclear errors",
            explanation:
              "Common failures include the agent retrying a broken tool forever, inventing arguments that don't match the schema, and surfacing opaque errors back to the user.",
            order: 2,
          },
        ],
      });
    }
  }
  console.log(`✓ Course + ${weeks.length} weeks + lessons + sessions + assignments + 3 quizzes`);

  // ─── Library Resources ────────────────────────────
  const resources = [
    {
      title: "Anthropic Tool Use Documentation",
      type: ResourceType.LINK,
      url: "https://docs.anthropic.com/claude/docs/tool-use",
      description: "Official guide to building agents with Claude tool use.",
      isFeatured: true,
      weekId: weeks[2].id,
    },
    {
      title: "LangChain Agent Templates (GitHub)",
      type: ResourceType.GITHUB,
      url: "https://github.com/langchain-ai/langgraph",
      description: "Reference implementations for common agent patterns.",
      isFeatured: true,
      weekId: weeks[4].id,
    },
    {
      title: "Make.com — No-Code Workflow Builder",
      type: ResourceType.TOOL,
      url: "https://make.com",
      description: "Visual workflow tool used heavily in Week 6.",
      weekId: weeks[5].id,
    },
    {
      title: "Prompt Eval Harness Template",
      type: ResourceType.TEMPLATE,
      url: "https://github.com/example/prompt-eval-template",
      description: "Starter repo for building your own eval harness.",
      weekId: weeks[6].id,
    },
    {
      title: "The Ethics of Deploying Agents in Africa (PDF)",
      type: ResourceType.PDF,
      url: "/resources/ethics-africa.pdf",
      description: "Required reading for Week 7.",
      weekId: weeks[6].id,
    },
  ];
  await prisma.resource.createMany({
    data: resources.map((r) => ({ ...r, createdById: instructor.id })),
  });

  // ─── Forum threads ────────────────────────────────
  const thread1 = await prisma.forumThread.create({
    data: {
      userId: students[0].id,
      weekId: weeks[2].id,
      channel: "week-3-help",
      title: "My tool keeps returning 'Invalid arguments' — what am I doing wrong?",
      body: "Hey all — I'm working on the multi-tool research agent and Claude keeps calling my `search_web` tool with garbled args. Anyone else seen this?",
      tags: ["tool-use", "debugging"],
    },
  });
  await prisma.forumReply.create({
    data: {
      threadId: thread1.id,
      userId: instructor.id,
      body: "Classic schema issue. Check that your `description` field on each parameter is *very* explicit about format. Claude reads those and they steer how it constructs args. Drop the schema in the thread and we can debug live.",
      isInstructorReply: true,
      isOfficialAnswer: true,
      upvotes: 4,
    },
  });

  const thread2 = await prisma.forumThread.create({
    data: {
      userId: students[2].id,
      channel: "show-and-tell",
      title: "Built a Swahili-language customer service agent over the weekend!",
      body: "Used Claude + a small RAG store of local FAQs. It speaks Swahili natively and gracefully falls back to English. Demo coming on Friday.",
      tags: ["showcase", "rag"],
      isPinned: true,
    },
  });
  await prisma.forumReply.create({
    data: {
      threadId: thread2.id,
      userId: students[1].id,
      body: "This is sick 🔥 how did you handle code-switching between Swahili and English?",
      upvotes: 2,
    },
  });

  // ─── Sandbox projects (one per student) ───────────
  for (const s of students) {
    await prisma.sandboxProject.create({
      data: {
        userId: s.id,
        title: `${s.name.split(" ")[0]}'s First Agent`,
        language: "python",
        code: `# ${s.name.split(" ")[0]}'s first agent\nimport anthropic\n\nclient = anthropic.Anthropic()\n\nresponse = client.messages.create(\n    model="claude-sonnet-4-6",\n    max_tokens=1024,\n    system="You are a helpful assistant for the AI Agent Engineering Fellowship.",\n    messages=[{"role": "user", "content": "Hello!"}],\n)\n\nprint(response.content[0].text)\n`,
        agentConfig: {
          name: "Hello Agent",
          systemPrompt: "You are a helpful assistant for the AI Agent Engineering Fellowship.",
          tools: [],
          model: "claude-sonnet-4-6",
        },
        isPublic: false,
      },
    });
  }

  // ─── Progress (varied — students at different stages) ─
  const allLessons = await prisma.lesson.findMany({ orderBy: [{ week: { weekNumber: "asc" } }, { order: "asc" }] });
  for (const [i, s] of students.entries()) {
    // Each student is at a different stage: 60%, 45%, 30%, 20%, 10%
    const completionPct = [0.6, 0.45, 0.3, 0.2, 0.1][i];
    const completedCount = Math.floor(allLessons.length * completionPct);
    for (let j = 0; j < completedCount; j++) {
      const lesson = allLessons[j];
      await prisma.progress.upsert({
        where: { userId_lessonId: { userId: s.id, lessonId: lesson.id } },
        create: {
          userId: s.id,
          weekId: lesson.weekId,
          lessonId: lesson.id,
          status: ProgressStatus.COMPLETE,
          watchedSeconds: lesson.duration,
          completedAt: new Date(Date.now() - (completedCount - j) * 86400000),
        },
        update: {},
      });
    }
    // One in-progress lesson
    if (completedCount < allLessons.length) {
      const next = allLessons[completedCount];
      await prisma.progress.upsert({
        where: { userId_lessonId: { userId: s.id, lessonId: next.id } },
        create: {
          userId: s.id,
          weekId: next.weekId,
          lessonId: next.id,
          status: ProgressStatus.IN_PROGRESS,
          watchedSeconds: Math.floor(next.duration * 0.4),
        },
        update: {},
      });
    }
  }

  // ─── Demo submissions ─────────────────────────────
  // Seed a mix of states so the grading queue feels real:
  //  • Adaeze: graded high on Weeks 1–4 (passing)
  //  • Tunde:  graded on 1–3, awaiting grade on Week 4
  //  • Amani:  awaiting grade on Weeks 1–3
  //  • Kojo:   draft on Week 1, nothing else
  //  • Zanele: nothing yet
  const allAssignments = await prisma.assignment.findMany({
    include: { week: true },
    orderBy: { week: { weekNumber: "asc" } },
  });
  const submissionPlan: Array<{
    student: typeof students[number];
    upToWeek: number;
    gradedThroughWeek: number;
  }> = [
    { student: students[0], upToWeek: 4, gradedThroughWeek: 4 },
    { student: students[1], upToWeek: 4, gradedThroughWeek: 3 },
    { student: students[2], upToWeek: 3, gradedThroughWeek: 0 },
    { student: students[3], upToWeek: 1, gradedThroughWeek: 0 }, // Kojo will be a draft below
    { student: students[4], upToWeek: 0, gradedThroughWeek: 0 },
  ];

  for (const plan of submissionPlan) {
    for (const a of allAssignments) {
      if (a.week.weekNumber > plan.upToWeek) continue;
      const isKojoDraft =
        plan.student.id === students[3].id && a.week.weekNumber === 1;
      const isGraded = a.week.weekNumber <= plan.gradedThroughWeek;
      const grade = isGraded
        ? Math.floor(78 + Math.random() * 18) // 78–95
        : null;

      await prisma.submission.create({
        data: {
          assignmentId: a.id,
          userId: plan.student.id,
          content:
            a.submissionType === "URL"
              ? null
              : `Submission from ${plan.student.name} for ${a.title}.\n\nKey takeaway: ${a.week.tagline}`,
          fileUrl:
            a.submissionType === "URL"
              ? `https://github.com/${plan.student.name.toLowerCase().split(" ")[0]}/week-${a.week.weekNumber}-deliverable`
              : null,
          isDraft: isKojoDraft,
          grade,
          feedback: isGraded
            ? "Solid work — clean structure and clear reasoning. Push further on edge cases next time."
            : null,
          gradedAt: isGraded ? new Date(Date.now() - Math.random() * 10 * 86400000) : null,
          submittedAt: new Date(
            Date.now() - (plan.upToWeek - a.week.weekNumber + 1) * 4 * 86400000,
          ),
        },
      });
    }
  }
  console.log(`✓ Submissions seeded across the cohort`);

  // ─── Badges ───────────────────────────────────────
  const badgeSeeds = [
    // Milestone — one per week, common rarity, gold treatment via app code
    { slug: "first-agent",    name: "First Agent",         description: "Built your first working Claude integration.", icon: "Sparkles",      category: BadgeCategory.MILESTONE, rarity: BadgeRarity.COMMON, criteria: "Complete the Week 1 deliverable.",  points: 10, weekNumber: 1 },
    { slug: "prompt-master",  name: "Prompt Master",       description: "Shipped a production prompt + eval harness.",  icon: "ScrollText",    category: BadgeCategory.MILESTONE, rarity: BadgeRarity.COMMON, criteria: "Complete the Week 2 deliverable.",  points: 10, weekNumber: 2 },
    { slug: "tool-user",      name: "Tool User",           description: "Built a multi-tool research agent.",           icon: "Wrench",        category: BadgeCategory.MILESTONE, rarity: BadgeRarity.COMMON, criteria: "Complete the Week 3 deliverable.",  points: 10, weekNumber: 3 },
    { slug: "rag-engineer",   name: "RAG Engineer",        description: "Shipped a knowledge-grounded agent.",          icon: "Database",      category: BadgeCategory.MILESTONE, rarity: BadgeRarity.RARE,   criteria: "Complete the Week 4 deliverable.",  points: 20, weekNumber: 4 },
    { slug: "architect",      name: "Multi-Agent Architect", description: "Got a 3-agent pipeline running end-to-end.", icon: "Network",       category: BadgeCategory.MILESTONE, rarity: BadgeRarity.RARE,   criteria: "Complete the Week 5 deliverable.",  points: 20, weekNumber: 5 },
    { slug: "automator",      name: "Automator",           description: "Deployed an event-driven agent workflow.",     icon: "Workflow",      category: BadgeCategory.MILESTONE, rarity: BadgeRarity.COMMON, criteria: "Complete the Week 6 deliverable.",  points: 10, weekNumber: 6 },
    { slug: "guardian",       name: "Guardian",            description: "Built measurable guardrails into your agent.", icon: "Shield",        category: BadgeCategory.MILESTONE, rarity: BadgeRarity.RARE,   criteria: "Complete the Week 7 deliverable.",  points: 20, weekNumber: 7 },

    // Engagement
    { slug: "streak-7",       name: "Streak Starter",      description: "Active 7 consecutive days.",                   icon: "Flame",         category: BadgeCategory.ENGAGEMENT, rarity: BadgeRarity.COMMON, criteria: "Open the platform 7 days in a row.", points: 5,  weekNumber: null },
    { slug: "quiz-ace",       name: "Quiz Ace",            description: "Scored 100% on any quiz.",                     icon: "Target",        category: BadgeCategory.ENGAGEMENT, rarity: BadgeRarity.RARE,   criteria: "Score 100% on any quiz.",            points: 15, weekNumber: null },

    // Community
    { slug: "first-share",    name: "Show & Tell",         description: "Posted your first project in #show-and-tell.", icon: "Megaphone",     category: BadgeCategory.COMMUNITY, rarity: BadgeRarity.COMMON, criteria: "Post in #show-and-tell.",            points: 5,  weekNumber: null },
    { slug: "helper",         name: "Helper",              description: "Answered 5 forum questions.",                  icon: "HandHelping",   category: BadgeCategory.COMMUNITY, rarity: BadgeRarity.COMMON, criteria: "Reply to 5 different forum threads.", points: 10, weekNumber: null },
    { slug: "official-answer", name: "Official Answer",    description: "An instructor pinned your reply as canonical.", icon: "Pin",          category: BadgeCategory.COMMUNITY, rarity: BadgeRarity.RARE,   criteria: "Get your reply pinned by an instructor.", points: 20, weekNumber: null },

    // Deliverable — legendary tier, the prestige set
    { slug: "hackathon",      name: "Hackathon Survivor",  description: "Shipped a v1 in the 48-hour hackathon.",       icon: "Zap",           category: BadgeCategory.DELIVERABLE, rarity: BadgeRarity.LEGENDARY, criteria: "Complete Week 9's hackathon.", points: 50, weekNumber: 9 },
    { slug: "demo-day",       name: "Demo Day Speaker",    description: "Pitched your project on the Demo Day stage.",  icon: "Mic",           category: BadgeCategory.DELIVERABLE, rarity: BadgeRarity.LEGENDARY, criteria: "Present at Demo Day.",        points: 50, weekNumber: 10 },
    { slug: "graduate",       name: "Fellowship Graduate", description: "Earned the Fellowship completion certificate.", icon: "GraduationCap", category: BadgeCategory.DELIVERABLE, rarity: BadgeRarity.LEGENDARY, criteria: "Complete the Fellowship.",     points: 100, weekNumber: 10 },
  ];
  await prisma.badge.createMany({ data: badgeSeeds });
  const allBadges = await prisma.badge.findMany();
  const bySlug = (s: string) => allBadges.find((b) => b.slug === s)!;

  // Award badges to demo students based on their progress level.
  // Roughly: more progress → more milestone badges + occasional engagement/community ones.
  const awards: Array<{ student: typeof students[number]; slugs: string[] }> = [
    { student: students[0], slugs: ["first-agent", "prompt-master", "tool-user", "rag-engineer", "architect", "streak-7", "quiz-ace", "first-share"] }, // Adaeze (60%)
    { student: students[1], slugs: ["first-agent", "prompt-master", "tool-user", "rag-engineer", "streak-7", "first-share"] },                          // Tunde (45%)
    { student: students[2], slugs: ["first-agent", "prompt-master", "tool-user", "first-share", "helper"] },                                            // Amani (30%)
    { student: students[3], slugs: ["first-agent", "prompt-master", "streak-7"] },                                                                       // Kojo (20%)
    { student: students[4], slugs: ["first-agent"] },                                                                                                    // Zanele (10%)
  ];

  for (const { student, slugs } of awards) {
    let totalXp = 0;
    for (const slug of slugs) {
      const badge = bySlug(slug);
      await prisma.userBadge.create({
        data: { userId: student.id, badgeId: badge.id, earnedAt: new Date(Date.now() - Math.random() * 30 * 86400000) },
      });
      totalXp += badge.points;
    }
    await prisma.user.update({ where: { id: student.id }, data: { xp: totalXp } });
  }
  console.log(`✓ Badges: ${badgeSeeds.length} seeded, awards distributed across cohort`);

  // ─── Notifications ────────────────────────────────
  await prisma.notification.createMany({
    data: students.flatMap((s) => [
      {
        userId: s.id,
        type: "ANNOUNCEMENT" as const,
        message: "Welcome to the Fellowship! Week 1 is live — start with the orientation video.",
        link: "/dashboard",
      },
      {
        userId: s.id,
        type: "LIVE_SESSION_REMINDER" as const,
        message: "Live session 'Building a Multi-Tool Research Agent' starts in 30 minutes.",
        link: "/dashboard/live",
      },
    ]),
  });

  console.log("\n✅  Seed complete.");
  console.log("\n   Login credentials (password: fellowship2025):");
  console.log("     • admin@fellowship.local        (ADMIN)");
  console.log("     • cpc@fellowship.local          (CHIEF_PROGRAM_COORDINATOR)");
  console.log("     • coordinator@fellowship.local  (COHORT_COORDINATOR)");
  console.log("     • instructor@fellowship.local   (INSTRUCTOR)");
  console.log("     • adaeze@fellowship.local      (STUDENT — 60% complete)");
  console.log("     • tunde@fellowship.local       (STUDENT — 45% complete)");
  console.log("     • amani@fellowship.local       (STUDENT — 30% complete)");
  console.log("     • kojo@fellowship.local        (STUDENT — 20% complete)");
  console.log("     • zanele@fellowship.local      (STUDENT — 10% complete)\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
