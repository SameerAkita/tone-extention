import type { ReactNode } from "react";

import Navbar from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";

type LegalPageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,66,37,0.14),_transparent_35%)]">
      <div className="flex min-h-screen flex-col items-center">
        <div className="w-full flex-1">
          <Navbar />
          <div className="mx-auto w-full max-w-4xl px-5 pb-16 pt-6 sm:px-7 lg:px-10">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-8 shadow-[0_30px_70px_-45px_rgba(0,0,0,0.45)] sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Public Policy
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {description}
              </p>
              <div className="prose prose-neutral mt-8 max-w-none text-sm leading-7 text-foreground prose-headings:font-semibold prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground dark:prose-invert">
                {children}
              </div>
            </section>
          </div>
        </div>
        <SiteFooter />
      </div>
    </main>
  );
}
