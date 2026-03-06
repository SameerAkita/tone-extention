import { PricingCard } from "./pricing-card";

export function PricingSection() {
  return (
    <section className="w-full">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Simple pricing</h2>
        <p className="mt-3 text-muted-foreground">
          Start for free, then upgrade when you need more rewrites and team
          features.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PricingCard
          name="Starter"
          description="For occasional professional writing."
          price="$0"
          period="/month"
          ctaLabel="Start free"
          ctaHref="/auth/sign-up"
          features={[
            "20 rewrites per month",
            "Basic tone presets",
            "Browser extension access",
          ]}
        />
        <PricingCard
          name="Pro"
          description="For daily business communication."
          price="$12"
          period="/month"
          ctaLabel="Upgrade to Pro"
          ctaHref="/auth/sign-up"
          features={[
            "Unlimited rewrites",
            "Advanced tone presets",
            "Priority support",
            "Team-ready workflows",
          ]}
          isPopular
        />
      </div>
    </section>
  );
}
