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
          name="Monthly"
          description="For occasional professional writing."
          price="¥1200"
          period="/month"
          ctaLabel="Start free trial"
          ctaHref="/auth/sign-up"
          features={[
            "Unlimited rewrites",
            "Basic tone presets",
            "Browser extension access",
            "Weekly updates"
          ]}
        />
        <PricingCard
          name="Yearly"
          description="For daily business communication."
          price="¥1000"
          period="/month"
          ctaLabel="Start free trial"
          ctaHref="/auth/sign-up"
          features={[
            "Unlimited rewrites",
            "Basic tone presets",
            "Browser extension access",
            "Weekly updates"
          ]}
          isPopular
        />
      </div>
    </section>
  );
}
