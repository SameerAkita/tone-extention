import Link from "next/link";
import { EnvVarWarning } from "./env-var-warning";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import { AuthButton } from "./auth-button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-5 text-sm">
        <div className="justify-self-start">
          <Link href="/" className="font-semibold text-primary">
            Tone
          </Link>
        </div>
        <div className="flex items-center gap-8 text-foreground/80 justify-self-center">
          <Link href="/pricing" className="px-2 py-1 rounded-md hover:text-foreground hover:bg-foreground/10">
            Pricing
          </Link>
          <Link href="/updates" className="px-2 py-1 rounded-md hover:text-foreground hover:bg-foreground/10">
            Updates
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
  );
}
