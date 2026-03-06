const faqs = [
  {
    question: "How does Tone work in my browser?",
    answer:
      "Install the extension, highlight your draft text, choose a tone, and apply the rewrite instantly in the same field.",
  },
  {
    question: "Does Tone replace human review?",
    answer:
      "Tone speeds up drafting and polishing. For highly sensitive communication, teams typically keep a final human check.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can switch plans or cancel your subscription at any time from your account settings.",
  },
  {
    question: "What tools can I use it with?",
    answer:
      "Tone is designed to work across modern web tools including email clients, chat apps, and browser-based CRMs.",
  },
];

export function FAQSection() {
  return (
    <section className="w-full py-4">
      <div className="mx-auto max-w-3xl animate-fade-up rounded-3xl border border-border/70 bg-card p-8 sm:p-10">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">FAQs</h2>
        <p className="mt-3 text-muted-foreground">
          Common questions about setup, pricing, and day-to-day usage.
        </p>

        <div className="mt-8 space-y-3">
          {faqs.map((item, index) => (
            <details
              key={item.question}
              className="animate-fade-up group rounded-xl border border-border/70 bg-background/70 p-5 transition-colors hover:bg-background"
              style={{ animationDelay: `${120 + index * 70}ms` }}
            >
              <summary className="cursor-pointer list-none pr-8 text-base font-medium leading-6">
                {item.question}
                <span className="float-right text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
