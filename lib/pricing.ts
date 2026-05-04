/**
 * Pricing logic — single source of truth for what each track costs and how
 * payment status maps to recognized revenue.
 *
 * All amounts are in USD cents (Stripe convention).
 */

import type { Track, PaymentStatus } from "@prisma/client";

export const TRACK_PRICE_CENTS: Record<Track, number> = {
  SELF_PACED: 35_000,    // $350
  FELLOWSHIP: 85_000,    // $850
  SCHOLARSHIP: 0,
};

export function fullPrice(track: Track) {
  return TRACK_PRICE_CENTS[track];
}

/**
 * Recognized revenue: how much of the track price is currently realized,
 * given the payment status. PARTIAL counts as half (we treat it as the first
 * of two installments). REFUNDED counts as zero.
 */
export function recognizedRevenue(
  track: Track,
  status: PaymentStatus,
): number {
  const price = TRACK_PRICE_CENTS[track];
  switch (status) {
    case "PAID":
      return price;
    case "PARTIAL":
      return Math.round(price / 2);
    case "UNPAID":
    case "WAIVED":
    case "REFUNDED":
      return 0;
  }
}

export function outstandingBalance(
  track: Track,
  status: PaymentStatus,
): number {
  const price = TRACK_PRICE_CENTS[track];
  switch (status) {
    case "PAID":
    case "REFUNDED":
    case "WAIVED":
      return 0;
    case "PARTIAL":
      return Math.round(price / 2);
    case "UNPAID":
      return price;
  }
}

/** Format cents as a human-readable USD string. */
export function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
