import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between sm:px-7 lg:px-10">
        <div className="space-y-1">
          <p className="font-medium text-foreground">{siteConfig.name}</p>
          <p>Business Japanese without the effort.</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 sm:justify-end">
          <Link href="/pricing" className="whitespace-nowrap hover:text-foreground">
            Pricing
          </Link>
          <Link href="/privacy" className="whitespace-nowrap hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="whitespace-nowrap hover:text-foreground">
            Terms
          </Link>
          <Link href="/contact" className="whitespace-nowrap hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
