import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Account
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Account settings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Manage your basic account details from one place.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center text-muted-foreground">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">sameer@example.com</p>
            </div>
          </div>
        </div>

          <Button type="button">Log out</Button>
      </div>
    </div>
  );
}
