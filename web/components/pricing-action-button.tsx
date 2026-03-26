"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type Props = {
  billingInterval: "month" | "year";
  isPopular?: boolean;
};

export function PricingActionButton({
  billingInterval,
  isPopular = false,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billingInterval }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (res.status === 401) {
        router.push("/auth/sign-up");
        return;
      }

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("pricing checkout failed", error);
      window.alert("Could not start checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button
      className="w-full"
      variant={isPopular ? "default" : "outline"}
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? "Redirecting..." : "Start free trial"}
    </Button>
  );
}
