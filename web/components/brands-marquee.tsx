const brands = [
  "Mercari",
  "Rakuten",
  "SmartHR",
  "Notion",
  "Slack",
  "HubSpot",
  "Zendesk",
  "Airtable",
];

export function BrandsMarquee() {
  const items = [...brands, ...brands];

  return (
    <div className="relative mt-12 overflow-hidden rounded-2xl border border-border/70 bg-background/70 py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
      <div className="marquee-track">
        {items.map((brand, index) => (
          <span
            key={`${brand}-${index}`}
            className="mx-5 inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
