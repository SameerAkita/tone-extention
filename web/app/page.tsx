import { ThemeSwitcher } from "@/components/theme-switcher";
import { Hero } from "@/components/hero";
import { PricingSection } from "@/components/pricing-section";
import Navbar from "@/components/navbar";
import { MessagesRewrittenSection } from "@/components/messages-rewritten-section";
import { FAQSection } from "@/components/faq-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-[radial-gradient(circle_at_top,_rgba(0,66,37,0.14),_transparent_35%)]">
      <div className="flex-1 w-full flex flex-col items-center">
        <Navbar />
        <div className="w-full max-w-6xl px-5 pb-16 pt-4 sm:px-7 lg:px-10 lg:pb-20">
          <Hero />
          <div className="mt-14 space-y-14">
            <MessagesRewrittenSection />
            <PricingSection />
            <FAQSection />
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-10">
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
