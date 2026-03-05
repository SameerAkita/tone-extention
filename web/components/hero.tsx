import Link from "next/link";
import { NextLogo } from "./next-logo";
import { SupabaseLogo } from "./supabase-logo";

export function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <p className="text-4xl lg:text-5xl font-semibold !leading-tight mx-auto max-w-xl text-center">
        Business Japanese<br></br>without the effort
      </p>
      <p className="text-base lg:text-xl">
        Your ideas conveyed in one click.
      </p>
      <button
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:bg-primary/90"
      >
        <Link href={"/auth/sign-up"}>
          Start free trial
        </Link>
      </button>
    </div>
  );
}
