import { PricingCard } from "./pricing-card";
import { PricingActionButton } from "./pricing-action-button";

export function PricingSection() {
  return (
    <section className="w-full py-4">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mx-auto mb-8 max-w-2xl text-center animate-fade-up">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple pricing</h2>
          <p className="mt-3 text-muted-foreground">
            Start free and upgrade when you need unlimited rewrites and priority support.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-xl gap-6 md:grid-cols-2">
          <PricingCard
            name="Monthly"
            description="For occasional professional writing."
            price="¥1200"
            period="/month"
            ctaLabel="Start free trial"
            cta={
              <PricingActionButton billingInterval="month" />
            }
            features={[
              "Unlimited rewrites",
              "Basic tone presets",
              "Browser extension access",
              "Weekly updates",
            ]}
          />
          <PricingCard
            name="Yearly"
            description="For daily business communication."
            price="¥1000"
            period="/month"
            ctaLabel="Start free trial"
            cta={
              <PricingActionButton billingInterval="year" isPopular />
            }
            features={[
              "Unlimited rewrites",
              "Basic tone presets",
              "Browser extension access",
              "Weekly updates",
            ]}
            isPopular
          />
        </div>
      </div>
    </section>
  );
}
