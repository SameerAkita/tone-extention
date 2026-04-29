import Navbar from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";
import { SiteFooter } from "@/components/site-footer";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-[radial-gradient(circle_at_top,_rgba(0,66,37,0.14),_transparent_35%)]">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Navbar />
        <div className="max-w-5xl p-5">
          <PricingSection />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
