import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  getPriceIdForInterval,
  getSiteUrl,
  getStripe,
  getTrialPeriodDays,
} from "@/lib/stripe";

type CheckoutRequestBody = {
  billingInterval?: string;
};

type ProfileRecord = {
  stripe_customer_id: string | null;
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as CheckoutRequestBody;
    const billingInterval =
      body.billingInterval === "month" || body.billingInterval === "year"
        ? body.billingInterval
        : null;

    if (!billingInterval) {
      return NextResponse.json(
        { error: "billingInterval must be 'month' or 'year'" },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const admin = createAdminClient();
    const siteUrl = getSiteUrl();
    const priceId = getPriceIdForInterval(billingInterval);
    const trialPeriodDays = getTrialPeriodDays();

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle<ProfileRecord>();

    if (profileError) {
      console.error("stripe checkout profile lookup failed", profileError);
      return NextResponse.json(
        { error: "Failed to load profile" },
        { status: 500 },
      );
    }

    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      const { error: updateError } = await admin
        .from("profiles")
        .update({
          email: user.email,
          stripe_customer_id: customerId,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("stripe checkout profile update failed", updateError);
        return NextResponse.json(
          { error: "Failed to update profile" },
          { status: 500 },
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/pricing?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
      subscription_data: {
        trial_period_days: trialPeriodDays > 0 ? trialPeriodDays : undefined,
        metadata: {
          supabase_user_id: user.id,
          plan: "founding",
          billing_interval: billingInterval,
        },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("stripe checkout failed", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
