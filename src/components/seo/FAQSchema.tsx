"use client";

interface FAQItem {
    question: string;
    answer: string;
}

const defaultFAQs: FAQItem[] = [
    {
        question: "Do you take reservations at Kin Dee?",
        answer: "Yes, we highly recommend making a reservation, especially for weekend dining. You can book online through our website or call us directly at +353 1 963 6162.",
    },
    {
        question: "What are Kin Dee's opening hours?",
        answer: "We are open Monday to Thursday 5pm-10pm, Friday and Saturday 5pm-11pm, and Sunday 1pm-9pm.",
    },
    {
        question: "Where is Kin Dee restaurant located?",
        answer: "We are located at 133 Leeson Street Upper, Dublin 4, D04HX48, Ireland.",
    },
    {
        question: "What type of cuisine does Kin Dee serve?",
        answer: "Kin Dee specializes in authentic Thai cuisine and innovative Asian fusion dishes, prepared with fresh, high-quality ingredients.",
    },
    {
        question: "Does Kin Dee cater for dietary requirements?",
        answer: "Yes, we offer vegetarian and vegan options. Please inform our staff of any allergies or dietary requirements when ordering.",
    },
];

interface FAQSchemaProps {
    faqs?: FAQItem[];
}

/**
 * Generates JSON-LD FAQPage schema for rich FAQ results in Google
 * @see https://schema.org/FAQPage
 */
export function FAQSchema({ faqs = defaultFAQs }: FAQSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
