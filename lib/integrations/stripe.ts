/**
 * Stripe integration — checkout sessions, subscriptions, webhook handling.
 *
 * STATUS: Stub. Mock mode returns a fake checkout URL for local dev.
 *
 * To go live: `npm install stripe`, set STRIPE_SECRET_KEY +
 * STRIPE_WEBHOOK_SECRET, and replace the marked TODOs.
 */

import type { Track } from "@prisma/client";

const MOCK = !process.env.STRIPE_SECRET_KEY;

export type CheckoutInput = {
  userId: string;
  email: string;
  track: Track;
  cohortId: string;
  /** If true, applies a 50% diaspora discount. */
  diaspora?: boolean;
};

export type CheckoutSession = {
  sessionId: string;
  url: string;
  amount: number;
};

const PRICE_BY_TRACK: Record<Track, number> = {
  SELF_PACED: 35000, // $350.00
  FELLOWSHIP: 85000, // $850.00
  SCHOLARSHIP: 0,
};

export const stripe = {
  isMock: MOCK,

  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutSession> {
    let amount = PRICE_BY_TRACK[input.track];
    if (input.diaspora) amount = Math.round(amount * 0.5);

    if (MOCK) {
      const id = `cs_mock_${Math.random().toString(36).slice(2, 12)}`;
      return {
        sessionId: id,
        url: `/checkout/mock?session=${id}&amount=${amount}&track=${input.track}`,
        amount,
      };
    }

    // TODO: Real Stripe implementation
    // const session = await stripeClient.checkout.sessions.create({...});
    throw new Error("Stripe SDK not implemented yet.");
  },

  /** Verify and parse a webhook payload. */
  async verifyWebhook(_payload: string, _signature: string) {
    if (MOCK) return null;
    // TODO: stripeClient.webhooks.constructEvent(payload, signature, secret)
    throw new Error("Stripe webhook verification not implemented yet.");
  },
};
