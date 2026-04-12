import { SubscriptionDetailsPanel } from "@/components/subscription-details-panel";

export default function DashboardSubscriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Subscription
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Subscription details
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Keep track of your plan, billing state, and upcoming renewal in one place.
        </p>
      </div>
      <SubscriptionDetailsPanel />
    </div>
  );
}
