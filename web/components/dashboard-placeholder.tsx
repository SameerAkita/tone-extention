import type { ReactNode } from "react";

type DashboardPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function DashboardPlaceholder({
  eyebrow,
  title,
  description,
  children,
}: DashboardPlaceholderProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-primary/20 bg-[linear-gradient(180deg,rgba(0,66,37,0.04),rgba(255,255,255,0.98))] p-8 sm:p-10">
      <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
        {description}
      </p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
