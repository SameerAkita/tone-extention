import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

type BillingInterval = "month" | "year" | null;

type BillingUpdate = {
  email?: string | null;
  plan?: string | null;
  billing_interval?: BillingInterval;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  stripe_price_id?: string | null;
  stripe_subscription_status?: string | null;
  trial_started_at?: string | null;
  trial_ends_at?: string | null;
  current_period_end?: string | null;
};

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook misconfigured" }, { status: 400 });
  }

  const stripe = getStripe();
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncProfileFromSubscription(subscription);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("stripe webhook handling failed", {
      eventType: event.type,
      error,
    });
    return NextResponse.json(
      { error: "Webhook handling failed" },
      { status: 500 },
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId =
    typeof session.client_reference_id === "string"
      ? session.client_reference_id
      : null;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;

  if (!userId) {
    return;
  }

  await updateProfileByUserId(userId, {
    plan: "founding",
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
  });
}

async function syncProfileFromSubscription(subscription: Stripe.Subscription) {
  const price = subscription.items.data[0]?.price;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const userId =
    subscription.metadata.supabase_user_id
    || (await findUserIdByCustomerId(customerId));

  if (!userId) {
    console.error("stripe webhook could not resolve user id", {
      subscriptionId: subscription.id,
      customerId,
    });
    return;
  }

  await updateProfileByUserId(userId, {
    plan: "founding",
    billing_interval: normalizeInterval(price?.recurring?.interval),
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: price?.id ?? null,
    stripe_subscription_status: subscription.status,
    trial_started_at: toIsoString(subscription.trial_start),
    trial_ends_at: toIsoString(subscription.trial_end),
    current_period_end: toIsoString(subscription.current_period_end),
  });
}

async function findUserIdByCustomerId(customerId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle<{ id: string }>();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

async function updateProfileByUserId(userId: string, update: BillingUpdate) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update(update)
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

function normalizeInterval(
  interval: Stripe.Price.Recurring.Interval | undefined,
): BillingInterval {
  if (interval === "month" || interval === "year") {
    return interval;
  }

  return null;
}

function toIsoString(timestamp: number | null | undefined) {
  if (!timestamp) {
    return null;
  }

  return new Date(timestamp * 1000).toISOString();
}
