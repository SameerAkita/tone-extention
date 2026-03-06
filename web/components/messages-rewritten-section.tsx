"use client";

import { useEffect, useRef, useState } from "react";

const TARGET = 200000;
const DURATION_MS = 1400;

function formatCompact(value: number) {
  if (value >= 1000) {
    return `${Math.floor(value / 1000)}k`;
  }
  return `${value}`;
}

export function MessagesRewrittenSection() {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let rafId = 0;
    let startTime = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(TARGET * eased));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [started]);

  return (
    <section
      ref={sectionRef}
      className="animate-fade-up rounded-3xl border border-border/70 bg-card p-8 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.35)] sm:p-10"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Trusted in daily communication
      </p>
      <p className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        {formatCompact(value)} messages rewritten
      </p>
      <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
        Tone is a browser extension that rewrites rough Japanese drafts into
        clear, respectful, business-ready messages. It helps teams communicate
        faster in email, chat, CRM tools, and docs without second-guessing tone.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-background/70 p-4">
          <p className="text-lg font-semibold">One-click rewrite</p>
          <p className="mt-1 text-sm text-muted-foreground">From draft to polished in seconds.</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-background/70 p-4">
          <p className="text-lg font-semibold">Context-aware tone</p>
          <p className="mt-1 text-sm text-muted-foreground">Formal, concise, friendly, or apologetic.</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-background/70 p-4">
          <p className="text-lg font-semibold">Built for work</p>
          <p className="mt-1 text-sm text-muted-foreground">Use directly where you already type.</p>
        </div>
      </div>
    </section>
  );
}
