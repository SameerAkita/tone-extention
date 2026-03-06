import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { PricingSection } from "@/components/pricing-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="grid h-full w-full max-w-5xl grid-cols-[1fr_auto_1fr] items-center p-3 px-5 text-sm">
            <div className="justify-self-start">
              <Link href="/" className="font-semibold text-primary">
                Tone
              </Link>
            </div>
            <div className="flex items-center gap-8 text-foreground/80 justify-self-center">
              <Link href="/pricing" className="px-2 py-1 rounded-md hover:text-foreground hover:bg-foreground/10">
                Pricing
              </Link>
              <Link href="/blog" className="px-2 py-1 rounded-md hover:text-foreground hover:bg-foreground/10">
                Blog
              </Link>
              <Link href="/roadmap" className="px-2 py-1 rounded-md hover:text-foreground hover:bg-foreground/10">
                Roadmap
              </Link>
            </div>
            <div className="justify-self-end">
              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
          <main className="flex-1 flex flex-col gap-6 px-4">
            <PricingSection />
          </main>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
