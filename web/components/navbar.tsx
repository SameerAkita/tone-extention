import Link from "next/link";
import { EnvVarWarning } from "./env-var-warning";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import { AuthButton } from "./auth-button";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-40 w-full px-4 pt-2">
      <nav className="mx-auto w-full max-w-3xl rounded-xl border border-border/70 bg-background/85 shadow-[0_10px_35px_-20px_rgba(0,0,0,0.55)] backdrop-blur">
        <div className="grid h-12 grid-cols-[1fr_auto_1fr] items-center px-5 text-sm">
          <div className="justify-self-start">
            <Link href="/" className="font-semibold text-primary">
              Tone
            </Link>
          </div>
          <div className="flex items-center gap-6 text-foreground/80 justify-self-center">
            <Link href="/pricing" className="rounded-md px-2 py-1 hover:bg-foreground/10 hover:text-foreground">
              Pricing
            </Link>
            <Link href="/updates" className="rounded-md px-2 py-1 hover:bg-foreground/10 hover:text-foreground">
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
    </div>
  );
}
