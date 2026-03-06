import Navbar from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";

export default function Page() {
    return (
        <>
        <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <Navbar />
                <div className="max-w-5xl p-5">
                    <PricingSection />
                </div>
            </div>
        </main>
        </>
    )
}