import Link from "next/link";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 text-sm text-muted-foreground sm:px-7 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-medium text-foreground">{siteConfig.name}</p>
            <p>
              Digital subscription for instant access to the Tone browser
              extension and rewrite features.
            </p>
            <p>
              Support:{" "}
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="text-foreground underline underline-offset-4"
              >
                {siteConfig.supportEmail}
              </a>
            </p>
            {siteConfig.supportEmailNeedsUpdate ? (
              <p className="text-xs text-amber-700">
                Replace the support email before launching payments.
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <ThemeSwitcher />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
