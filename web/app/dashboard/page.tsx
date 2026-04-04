import Link from "next/link";
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
    current: true,
  },
  {
    href: "/dashboard",
    label: "Account",
    description: "Profile and workspace",
    icon: UserRound,
    current: false,
  },
  {
    href: "/dashboard",
    label: "Subscription",
    description: "Billing and access",
    icon: CreditCard,
    current: false,
  },
  {
    href: "/dashboard",
    label: "Extension",
    description: "Connect and install",
    icon: Link2,
    current: false,
  },
  {
    href: "/dashboard",
    label: "Settings",
    description: "Preferences and support",
    icon: Settings,
    current: false,
  },
] as const;

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,66,37,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(0,66,37,0.08),_transparent_28%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:flex-row lg:gap-6 lg:px-8">
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

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`group flex items-start gap-3 rounded-2xl px-4 py-3 transition ${
                        item.current
                          ? "bg-primary text-primary-foreground shadow-[0_14px_30px_-22px_rgba(0,66,37,0.9)]"
                          : "text-foreground/80 hover:bg-background/80 hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`mt-0.5 rounded-xl border p-2 ${
                          item.current
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
                            item.current
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

        <section className="flex-1 rounded-[32px] border border-border/70 bg-background/88 p-6 shadow-[0_30px_80px_-56px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8">
          <div className="rounded-[28px] border border-dashed border-primary/20 bg-[linear-gradient(180deg,rgba(0,66,37,0.04),rgba(255,255,255,0.98))] p-8 sm:p-10">
            <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Tone workspace
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Dashboard content goes here
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              The shell is ready. You can plug cards, account details, billing, or extension actions into this main panel whenever you are ready.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
