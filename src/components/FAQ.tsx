import { ChevronDown } from "lucide-react";

interface FAQProps {
    faqs: { question: string; answer: string }[];
    headingAs?: "h1" | "h2";
}

/** Visible FAQ. Uses <details> so every answer is in the HTML for search engines and AI crawlers. */
const FAQ = ({ faqs, headingAs: HeadingTag = "h2" }: FAQProps) => {
    if (!faqs.length) return null;
    const linkify = (text: string) =>
        text.split(/(https?:\/\/[^\s),]+)/g).map((part, i) =>
            /^https?:\/\//.test(part) ? (
                <a key={i} href={part.replace(/\.$/, "")} className="text-primary underline underline-offset-2 break-all">
                    {part.replace(/^https?:\/\/(www\.)?/, "").replace(/\.$/, "")}
                </a>
            ) : (
                part
            )
        );

    return (
        <section id="faq" aria-labelledby="faq-heading" className="section-padding bg-background scroll-mt-20">
            <div className="container-custom max-w-3xl">
                <div className="text-center mb-10">
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-primary mb-2">Good to know</p>
                    <HeadingTag id="faq-heading" className="heading-section text-foreground">
                        Frequently Asked Questions
                    </HeadingTag>
                </div>
                <div className="divide-y divide-border border-y border-border">
                    {faqs.map((f) => (
                        <details key={f.question} className="group py-4">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-foreground [&::-webkit-details-marker]:hidden">
                                <h3 className="font-display text-lg font-normal">{f.question}</h3>
                                <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                            </summary>
                            <p className="mt-3 text-muted-foreground leading-relaxed">{linkify(f.answer)}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
