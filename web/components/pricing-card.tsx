import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  name: string;
  description: string;
  price: string;
  period?: string;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
  isPopular?: boolean;
};

export function PricingCard({
  name,
  description,
  price,
  period = "/month",
  ctaLabel,
  ctaHref,
  features,
  isPopular = false,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex h-full flex-col rounded-2xl",
        isPopular ? "border-primary shadow-md" : "border-border",
      )}
    >
      {isPopular ? (
        <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Popular
        </span>
      ) : null}

      <CardHeader className="space-y-3">
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-6">
          <p className="text-4xl font-semibold tracking-tight">
            {price}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {period}
            </span>
          </p>
        </div>
        <ul className="space-y-3 text-sm text-muted-foreground">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="mt-1 text-primary">●</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          asChild
          className="w-full"
          variant={isPopular ? "default" : "outline"}
        >
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
