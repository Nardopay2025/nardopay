import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQSection = () => {
  const faqs = [
    {
      question: "Do I need a business licence to use Nardopay?",
      answer: "No. Individuals, side projects, and registered businesses can all create payment links. You can start accepting payments immediately without any business registration."
    },
    {
      question: "Which payment methods do you support?",
      answer: "We accept Visa, Mastercard, M-Pesa, MTN Mobile Money, Airtel Money, bank transfers, and major digital wallets. Your customers can pay using whichever method they prefer."
    },
    {
      question: "How quickly do I get my money?",
      answer: "Funds are available in your Nardopay wallet immediately after payment. You can then withdraw to your bank account within 24 hours."
    },
    {
      question: "Can I use Nardopay if I'm outside Africa?",
      answer: "Yes. We support global card payments in USD, GBP, and EUR, plus local currencies across Africa. Anyone, anywhere can create payment links."
    },
    {
      question: "Is there a monthly fee?",
      answer: "No monthly charges. You only pay a small transaction fee when you receive a payment. No setup fees, no hidden costs."
    },
    {
      question: "Is Nardopay secure?",
      answer: "Yes. All transactions are encrypted and comply with PCI DSS standards. We use bank-level security to protect your money and your customers' data."
    },
    {
      question: "Can I customise my payment page?",
      answer: "Yes. You can add your logo, choose your brand colours, and write custom thank-you messages. Make every payment page feel like your own."
    },
    {
      question: "How do I share my payment link?",
      answer: "Copy your link and share it anywhere—WhatsApp, Instagram, email, SMS, or your website. Customers click the link and pay instantly."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="w-8 h-8 text-blue-primary" />
            <h2 className="text-4xl font-bold text-foreground">
              Frequently asked questions
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know to get started
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-blue-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@nardopay.com" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-primary text-primary-foreground font-semibold rounded-lg hover:shadow-glow transition-all duration-300"
            >
              Contact Support
            </a>
            <a 
              href="/help-center" 
              className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors"
            >
              Help Centre
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 