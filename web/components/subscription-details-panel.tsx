"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { BadgeCheck, CalendarClock, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";

type SubscriptionResponse = {
  plan: string | null;
  billingInterval: "month" | "year" | null;
  status: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  error?: string;
};

export function SubscriptionDetailsPanel() {
  const [data, setData] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadSubscriptionDetails() {
      try {
        const res = await fetch("/api/dashboard/subscription", {
          method: "GET",
        });

        const body = (await res.json().catch(() => ({}))) as SubscriptionResponse;

        if (!isActive) return;

        if (!res.ok) {
          setData({
            plan: null,
            billingInterval: null,
            status: null,
            trialEndsAt: null,
            currentPeriodEnd: null,
            error: body.error ?? "Failed to load subscription details",
          });
          return;
        }

        setData(body);
      } catch {
        if (!isActive) return;

        setData({
          plan: null,
          billingInterval: null,
          status: null,
          trialEndsAt: null,
          currentPeriodEnd: null,
          error: "Failed to load subscription details",
        });
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadSubscriptionDetails();

    return () => {
      isActive = false;
    };
  }, []);

  const plan = data?.plan ? toTitleCase(data.plan) : "Free";
  const status = data?.status ? toTitleCase(data.status) : "Inactive";
  const billing = data?.billingInterval
    ? toTitleCase(data.billingInterval)
    : "Not set";
  const renewalDate = getRenewalDateLabel(data);

  return (
    <div className="space-y-4">
      <DetailRow
        icon={<CreditCard className="h-5 w-5" />}
        label="Plan"
        value={loading ? "Loading..." : plan}
      />

      <DetailRow
        icon={<BadgeCheck className="h-5 w-5" />}
        label="Status"
        value={loading ? "Loading..." : status}
        secondary={!loading ? `Billing cadence: ${billing}` : undefined}
      />

      <DetailRow
        icon={<CalendarClock className="h-5 w-5" />}
        label="Renewal date"
        value={loading ? "Loading..." : renewalDate}
      />

      <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
        <div>
          <p className="text-sm font-medium">Billing</p>
          <p className="text-sm text-muted-foreground">
            {data?.error
              ? data.error
              : "Manage your plan and payment details."}
          </p>
        </div>
        <Button type="button" variant="outline">
          Manage subscription
        </Button>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  secondary,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  secondary?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center text-muted-foreground">
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{value}</p>
          {secondary ? (
            <p className="text-sm text-muted-foreground">{secondary}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function toTitleCase(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getRenewalDateLabel(data: SubscriptionResponse | null) {
  if (!data) {
    return "No upcoming renewal";
  }

  if (data.status === "trialing" && data.trialEndsAt) {
    return formatDate(data.trialEndsAt);
  }

  if (data.currentPeriodEnd) {
    return formatDate(data.currentPeriodEnd);
  }

  return "No upcoming renewal";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
