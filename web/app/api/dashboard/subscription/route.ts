import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type SubscriptionProfile = {
  plan: string | null;
  billing_interval: "month" | "year" | null;
  stripe_subscription_status: string | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
};

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select(
        "plan, billing_interval, stripe_subscription_status, trial_ends_at, current_period_end",
      )
      .eq("id", user.id)
      .maybeSingle<SubscriptionProfile>();

    if (profileError) {
      console.error("dashboard subscription profile lookup failed", profileError);
      return NextResponse.json(
        { error: "Failed to load subscription details" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      plan: profile?.plan ?? null,
      billingInterval: profile?.billing_interval ?? null,
      status: profile?.stripe_subscription_status ?? null,
      trialEndsAt: profile?.trial_ends_at ?? null,
      currentPeriodEnd: profile?.current_period_end ?? null,
    });
  } catch (error) {
    console.error("dashboard subscription route failed", error);
    return NextResponse.json(
      { error: "Failed to load subscription details" },
      { status: 500 },
    );
  }
}
