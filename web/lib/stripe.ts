import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(apiKey);
  }

  return stripeClient;
}

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error("Missing NEXT_PUBLIC_SITE_URL");
  }

  return siteUrl.replace(/\/+$/, "");
}

export function getTrialPeriodDays() {
  const rawValue = process.env.STRIPE_TRIAL_DAYS ?? "7";
  const trialDays = Number(rawValue);

  if (!Number.isFinite(trialDays) || trialDays < 0) {
    throw new Error("Invalid STRIPE_TRIAL_DAYS");
  }

  return trialDays;
}

export function getPriceIdForInterval(interval: "month" | "year") {
  const priceId =
    interval === "month"
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : process.env.STRIPE_YEARLY_PRICE_ID;

  if (!priceId) {
    throw new Error(
      interval === "month"
        ? "Missing STRIPE_MONTHLY_PRICE_ID"
        : "Missing STRIPE_YEARLY_PRICE_ID",
    );
  }

  return priceId;
}
