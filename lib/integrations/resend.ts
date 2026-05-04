/**
 * Resend integration — transactional email.
 *
 * STATUS: Stub. Mock mode logs to the server console instead of sending.
 *
 * To go live: `npm install resend @react-email/components`, set RESEND_API_KEY,
 * and replace `send` with the real SDK call.
 */

const MOCK = !process.env.RESEND_API_KEY;

export type EmailKind =
  | "welcome"
  | "live_session_reminder"
  | "assignment_graded"
  | "certificate_issued"
  | "scholarship_decision"
  | "weekly_newsletter"
  | "password_reset";

export type SendEmailInput = {
  to: string;
  kind: EmailKind;
  data: Record<string, any>;
};

const SUBJECTS: Record<EmailKind, (d: any) => string> = {
  welcome: () => "Welcome to the Fellowship",
  live_session_reminder: (d) => `Live in 30 min: ${d.title}`,
  assignment_graded: (d) => `Your assignment "${d.title}" has been graded`,
  certificate_issued: () => "Your Fellowship certificate is ready",
  scholarship_decision: (d) =>
    d.approved ? "Your scholarship has been approved" : "Scholarship application update",
  weekly_newsletter: (d) => `Cohort update — ${d.weekTitle}`,
  password_reset: () => "Reset your Fellowship password",
};

export const resend = {
  isMock: MOCK,

  async send({ to, kind, data }: SendEmailInput) {
    const subject = SUBJECTS[kind](data);
    const from = process.env.EMAIL_FROM ?? "Fellowship <hello@fellowship.local>";

    if (MOCK) {
      console.log(
        `📧 [MOCK EMAIL] from="${from}" to="${to}" kind="${kind}" subject="${subject}" data=${JSON.stringify(data)}`,
      );
      return { id: `mock-email-${Date.now()}` };
    }

    // TODO: Real Resend implementation
    // const result = await resendClient.emails.send({
    //   from, to, subject, react: <Template kind={kind} data={data} />,
    // });
    throw new Error("Resend SDK not implemented yet.");
  },
};
