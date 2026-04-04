"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  LayoutDashboard,
  Link2,
  Settings,
  UserRound,
} from "lucide-react";

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Overview and activity",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/account",
    label: "Account",
    description: "Profile and workspace",
    icon: UserRound,
  },
  {
    href: "/dashboard/subscription",
    label: "Subscription",
    description: "Billing and access",
    icon: CreditCard,
  },
  {
    href: "/dashboard/extension",
    label: "Extension",
    description: "Connect and install",
    icon: Link2,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    description: "Preferences and support",
    icon: Settings,
  },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="mb-4 rounded-[28px] border border-primary/10 bg-[linear-gradient(180deg,rgba(0,66,37,0.06),rgba(255,255,255,0.98))] shadow-[0_30px_70px_-48px_rgba(0,0,0,0.45)] backdrop-blur lg:sticky lg:top-4 lg:mb-0 lg:flex lg:min-h-[calc(100vh-2rem)] lg:w-[290px] lg:flex-col">
      <div className="border-b border-border/70 px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            App
          </span>
          <span className="text-2xl font-semibold tracking-tight text-primary">
            Tone
          </span>
        </Link>
        <p className="mt-4 max-w-[18rem] text-sm leading-6 text-muted-foreground">
          A focused space for your account, billing, and extension setup.
        </p>
      </div>

      <nav className="flex-1 px-4 py-5">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-start gap-3 rounded-2xl px-4 py-3 transition ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_14px_30px_-22px_rgba(0,66,37,0.9)]"
                      : "text-foreground/80 hover:bg-background/80 hover:text-foreground"
                  }`}
                >
                  <span
                    className={`mt-0.5 rounded-xl border p-2 ${
                      isActive
                        ? "border-white/15 bg-white/10"
                        : "border-primary/10 bg-primary/5 text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span
                      className={`mt-1 block text-xs leading-5 ${
                        isActive
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground group-hover:text-foreground/65"
                      }`}
                    >
                      {item.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
