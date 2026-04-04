import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,66,37,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(0,66,37,0.08),_transparent_28%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:flex-row lg:gap-6 lg:px-8">
        <DashboardSidebar />
        <section className="flex-1 rounded-[32px] border border-border/70 bg-background/88 p-6 shadow-[0_30px_80px_-56px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}
