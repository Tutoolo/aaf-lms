# The Fellowship Platform

A production-grade Learning Management System purpose-built for the **AI Agent Engineering Fellowship** — a 10-week cohort program for African and diaspora learners.

This repo is a **foundation scaffold** of the full system described in the project brief. The schema, design system, public site, auth flow, and dashboard skeletons are wired up end-to-end. The heaviest modules (live classroom, sandbox editor, payments) are stubbed at the integration layer and surfaced as scaffolded routes ready to flesh out.

---

## Stack

| Layer        | Choice                                                     |
| ------------ | ---------------------------------------------------------- |
| Framework    | Next.js 14 (App Router, TypeScript)                        |
| Styling      | Tailwind CSS + brand design system (`app/globals.css`)     |
| Database     | PostgreSQL via Prisma                                      |
| Auth         | NextAuth.js (Credentials + optional Google OAuth)          |
| State        | Zustand + TanStack Query                                   |
| Charts       | Recharts                                                   |
| Animations   | Framer Motion                                              |
| Integrations | Mux, 100ms, Stripe, Resend, Judge0, Anthropic — stubbed    |

---

## Quick start

```bash
# 1. Install
npm install

# 2. Spin up Postgres (Docker)
docker compose up -d

# 3. Configure environment
cp .env.example .env.local
# (the defaults work against the docker-compose Postgres)

# 4. Apply schema + seed demo data
npx prisma db push
npm run db:seed

# 5. Run the dev server
npm run dev
```

Open http://localhost:3000.

### Demo accounts

All demo accounts use the password `fellowship2025`.

| Email                          | Role        | State                        |
| ------------------------------ | ----------- | ---------------------------- |
| `admin@fellowship.local`       | ADMIN       | Full admin access            |
| `instructor@fellowship.local`  | INSTRUCTOR  | Admin console                |
| `adaeze@fellowship.local`      | STUDENT     | 60% complete                 |
| `tunde@fellowship.local`       | STUDENT     | 45% complete                 |
| `amani@fellowship.local`       | STUDENT     | 30% complete                 |
| `kojo@fellowship.local`        | STUDENT     | 20% complete                 |
| `zanele@fellowship.local`      | STUDENT     | 10% complete                 |

---

## What's built

### Fully implemented

- **Brand design system** — color tokens (gold/brown/cream + 3 act colors), typography (Playfair Display + DM Sans), reusable shadcn-style components, dark/light tokens.
- **Database schema** — all 18 models with relations, enums, and indexes. NextAuth tables included.
- **Seed script** — admin + instructor + 5 students with varied progress, full 10-week curriculum, lessons, live sessions, assignments, 3 quizzes, library resources, forum threads with replies, sandbox projects.
- **Authentication** — Credentials sign-in, registration, JWT sessions, role-aware middleware protecting `/dashboard/*` and `/admin/*`. Routes redirect based on role.
- **Public marketing site** (`app/(public)/`):
  - Landing page with hero, 3-act overview, what-you-get grid, pricing tiers (with diaspora 50% discount checkbox at apply), instructor spotlight, final CTA.
  - Curriculum browser (`/curriculum`) — full week-by-week design matching the act colors.
  - Apply flow (`/apply`) — multi-step form: track → about → motivation/payment, hits `/api/enrollments/apply` and creates enrollment + checkout session.
  - Demo Day showcase (`/demo`) with project gallery.
- **Student dashboard** (`app/dashboard/`):
  - Layout with collapsible sidebar (12 nav items) + topbar with user dropdown.
  - Dashboard home — welcome banner, current week card, progress ring, per-act bars (live data), streak, quick links, upcoming live session card.
  - Curriculum browser — all 10 weeks grouped by act, lock states, day labels, lesson types.
  - Library — filterable resource grid with type icons + week badges.
  - Live sessions list, lesson player, assignments list/detail, quizzes list/detail, sandbox list/detail, community forum, notifications — all wired to real DB data with placeholder feature panels.
- **Admin portal** (`app/admin/`):
  - Layout with admin sidebar + role-gated middleware.
  - Dashboard — live stats from DB (enrollments, pending grading, lessons completed, next session, recent submissions/forum).
  - Cohorts list with enrollment counts.
  - Students roster table.
  - Developer admin — live integration health status (mock vs live).
  - Stub pages for: Curriculum Builder, Sessions, Assignments, Quizzes, Library, Announcements, Analytics, Settings.
- **Integration layer** — `lib/integrations/` with typed interfaces for Mux, Stripe, Resend, Judge0, Anthropic, 100ms. All run in mock mode when keys are absent so the UI works without external services.

### Scaffolded with feature checklist (next session)

The following routes exist with placeholder UI that documents exactly what the full module will contain. Each is a clean implementation surface — no missing wiring, just the feature work itself:

- Live classroom room — 100ms.live integration, hand-raise, polls, breakouts, recording
- Lesson player — Mux player, watch tracking, notes (TipTap), transcript, Q&A inline
- Assignment editor — Monaco code, file upload, draft auto-save, peer review
- Quiz player — full-screen, timer, navigator, exam-mode lock
- Sandbox editor — 3-panel Monaco + Judge0 + Anthropic AI assistant
- Curriculum builder — drag-and-drop weeks/lessons + Mux upload
- Grading queue — split-view submission grader
- Quiz builder — per-type question editor
- Stripe checkout flow + webhook handler — schema + integration stubs in place
- Email templates — Resend stub in place; React Email components needed
- Certificate generation — schema in place; Puppeteer rendering needed
- Notification system — schema + DB rows in place; real-time push needed

---

## Project structure

```
app/
├── (auth)/              login, register
├── (public)/            marketing site
├── dashboard/           student portal
│   ├── curriculum/
│   ├── lessons/[lessonId]/
│   ├── live/[sessionId]/
│   ├── library/
│   ├── assignments/[id]/
│   ├── quizzes/[id]/
│   ├── sandbox/[projectId]/
│   ├── community/
│   ├── progress/
│   ├── certificates/
│   └── notifications/
├── admin/               instructor + admin portal
│   ├── cohorts/
│   ├── curriculum/
│   ├── sessions/
│   ├── assignments/
│   ├── quizzes/
│   ├── students/
│   ├── library/
│   ├── analytics/
│   ├── announcements/
│   ├── settings/
│   └── developer/
├── api/                 route handlers
│   ├── auth/[...nextauth]/
│   ├── auth/register/
│   └── enrollments/apply/
├── globals.css          design tokens
└── layout.tsx           root layout

components/
├── ui/                  shadcn-style primitives
├── charts/              progress ring, etc.
└── layout/              sidebar, topbar, page-stub

lib/
├── auth.ts              NextAuth config
├── db.ts                Prisma client
├── curriculum.ts        canonical 10-week data
├── utils.ts             cn(), formatters
└── integrations/        mux, stripe, resend, judge0, anthropic, hms

prisma/
├── schema.prisma        full data model
└── seed.ts              demo data
```

---

## Going live with integrations

Every integration in `lib/integrations/` checks for required env vars at module load and falls back to a mock implementation when keys are missing. Each file has a TODO comment showing exactly where to drop in the real SDK call.

| Integration | What to set                                          | What it powers                  |
| ----------- | ---------------------------------------------------- | ------------------------------- |
| Mux         | `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`                   | Recorded video upload + playback |
| 100ms       | `HMS_ACCESS_KEY`, `HMS_SECRET`, `HMS_TEMPLATE_ID`    | Live classroom rooms             |
| Stripe      | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`         | Track payments + diaspora discount |
| Resend      | `RESEND_API_KEY`, `EMAIL_FROM`                       | Transactional email              |
| Judge0      | `JUDGE0_API_URL`, `JUDGE0_API_KEY`                   | Sandbox code execution           |
| Anthropic   | `ANTHROPIC_API_KEY`                                  | Sandbox AI tutor + agent runner  |

Visit `/admin/developer` to see live integration status.

---

## Implementation priority order (from the spec)

For follow-up sessions, build in this order for fastest MVP completion:

1. ✅ Auth + DB schema + seed
2. ✅ Public marketing site
3. ✅ Student dashboard skeleton
4. ⏳ Curriculum browser + Lesson player (skeleton in place; needs Mux player + watch tracking)
5. ⏳ Progress tracking (data model in place; needs UI)
6. ⏳ Quizzes (schema + seed in place; needs player UI)
7. ⏳ Assignments (schema + UI shell in place; needs editor)
8. ✅ Library (basic version shipped)
9. ⏳ Live Classroom (highest complexity — 100ms.live)
10. ⏳ Sandbox (Judge0 + Anthropic proxy)
11. ⏳ Community Forum (data model + list view in place; needs threads/replies UI)
12. ⏳ Instructor Admin (skeleton in place; needs builders + grading queue)
13. ⏳ Developer Admin (live status shipped; needs config + flags)
14. ⏳ Certificates (schema in place; needs PDF rendering)
15. ⏳ Payments (Stripe stub in place; needs real checkout + webhook)
16. ⏳ Notifications (schema + UI in place; needs real-time push)
17. ⏳ Polish — animations, mobile bottom-tab, accessibility, error states

---

## Brand notes

The platform leans into a **luxury-meets-community** aesthetic: warm cream backgrounds, deep brown sidebars, gold accents, editorial Playfair display headings. The three Acts are color-coded everywhere:

- **Act I — Foundation** → forest green `--act1`
- **Act II — Build** → midnight blue `--act2`
- **Act III — Launch** → terracotta `--act3`

All copy aims to be warm, high-expectation, and culturally grounded — not sterile or corporate.

---

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run lint         # eslint
npm run db:push      # apply schema without migration
npm run db:migrate   # create + apply migration
npm run db:seed      # populate demo data
npm run db:studio    # open Prisma Studio
npm run db:reset     # nuke + re-seed
```
