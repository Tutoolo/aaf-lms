/**
 * Integration barrel export. Use `import { mux, stripe, ... } from "@/lib/integrations"`
 * across the app rather than reaching into individual files.
 *
 * All integrations follow the same pattern: a typed object with an `isMock`
 * flag, methods that match the production interface, and a mock implementation
 * that runs when env keys are missing. This means features depending on these
 * services degrade gracefully in dev — they don't crash, they return canned data.
 */

export { mux } from "./mux";
export { stripe } from "./stripe";
export { resend } from "./resend";
export { judge0 } from "./judge0";
export { anthropic } from "./anthropic";
export { hms } from "./hms";

export const integrationStatus = () => ({
  mux: !process.env.MUX_TOKEN_ID ? "mock" : "live",
  stripe: !process.env.STRIPE_SECRET_KEY ? "mock" : "live",
  resend: !process.env.RESEND_API_KEY ? "mock" : "live",
  judge0: !process.env.JUDGE0_API_KEY ? "mock" : "live",
  anthropic: !process.env.ANTHROPIC_API_KEY ? "mock" : "live",
  hms: !process.env.HMS_ACCESS_KEY ? "mock" : "live",
});
