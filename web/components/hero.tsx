import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandsMarquee } from "./brands-marquee";

export function Hero() {
  return (
    <section className="animate-fade-up pt-8 sm:pt-12">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            AI writing copilot for teams
          </p>
          <h1 className="mt-4 text-4xl font-semibold !leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Business Japanese
            <br />
            without the effort
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Rewrite rough drafts into polished, culturally appropriate Japanese in
            one click. Move faster without losing professionalism.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link href="/auth/sign-up">Start free trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>

        <div className="relative rounded-3xl border border-border/70 bg-card p-6 shadow-[0_30px_70px_-45px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="absolute -right-3 -top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
            Live rewrite
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Before
          </p>
          <p className="mt-2 rounded-xl border border-border/70 bg-background p-4 text-sm leading-7 text-muted-foreground">
            お世話になっております。会議の日程が変わるかもしれないので、確認お願いします。
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            After
          </p>
          <p className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-7 text-foreground">
            いつもお世話になっております。会議日程に変更の可能性がございますため、ご確認のほどよろしくお願いいたします。
          </p>
        </div>
      </div>

      <BrandsMarquee />
    </section>
  );
}
