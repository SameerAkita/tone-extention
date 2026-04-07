import { CreditCard, CalendarClock, BadgeCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

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

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center text-muted-foreground">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Plan</p>
              <p className="text-sm text-muted-foreground">Free</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center text-muted-foreground">
              <BadgeCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center text-muted-foreground">
              <CalendarClock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Renewal date</p>
              <p className="text-sm text-muted-foreground">No upcoming renewal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
          <div>
            <p className="text-sm font-medium">Billing</p>
            <p className="text-sm text-muted-foreground">Manage your plan and payment details.</p>
          </div>
          <Button type="button" variant="outline">
            Manage subscription
          </Button>
        </div>
      </div>
    </div>
  );
}
