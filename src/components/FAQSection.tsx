import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQSection = () => {
  const faqs = [
    {
      question: "What payment methods does Nardopay support?",
      answer: "Nardopay supports a wide range of payment methods including international cards (Visa, Mastercard, American Express), local mobile money (M-Pesa, MTN Money, Airtel Money), bank transfers, and digital wallets. We also integrate with PayPal and Stripe for verified merchants."
    },
    {
      question: "How much does it cost to use Nardopay?",
      answer: "Nardopay charges NO transaction fees. We only charge a 2% fee when you withdraw your money to your bank account or mobile wallet. Your mobile money provider, bank, or card network may charge their own fees, but these are separate from Nardopay's fees."
    },
    {
      question: "How long does it take to receive payments?",
      answer: "All payments are instant."
    },
    {
      question: "Is Nardopay secure?",
      answer: "Yes, Nardopay is built with bank-level security. We are PCI DSS compliant, use end-to-end encryption, and implement advanced fraud detection systems. All transactions are monitored 24/7 for suspicious activity."
    },
    {
      question: "Can I use Nardopay for international transactions?",
      answer: "Absolutely! Nardopay supports transactions in 100+ countries with 37 different currencies. We have partnerships with major payment networks and local payment providers to ensure seamless international payments."
    },
    {
      question: "How do I integrate Nardopay into my website?",
      answer: "Integration is straightforward with our comprehensive API documentation and SDKs. We provide code examples in multiple programming languages, and our developer support team is available to help with implementation."
    },
    {
      question: "What currencies does Nardopay support?",
      answer: "We support 37 currencies including major African currencies (NGN, KES, GHS, ZAR, TZS, UGX) and international currencies (USD, EUR, GBP, JPY, CNY, INR). We're constantly adding support for more currencies."
    },
    {
      question: "How do I get customer support?",
      answer: "We offer 24/7 customer support through multiple channels: live chat, email, phone, and WhatsApp. Our support team is available in multiple languages and can help with technical issues, account management, and general inquiries."
    },
    {
      question: "Can I use Nardopay for recurring payments?",
      answer: "Yes, Nardopay supports recurring billing and subscription management. You can set up automatic payments with flexible billing cycles (daily, weekly, monthly, yearly) and manage subscriptions through our dashboard or API."
    },
    {
      question: "What happens if a payment fails?",
      answer: "Failed payments are automatically retried with intelligent retry logic. We provide detailed error messages and suggestions for resolution. Our system also sends notifications to both merchants and customers about payment status."
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
            Find answers to common questions about Nardopay's services and features
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground text-center">
              Common Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
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
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@nardopay.com" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-primary text-primary-foreground font-semibold rounded-lg hover:shadow-glow transition-all duration-300"
            >
              Contact Support
            </a>
            <a 
              href="/developers" 
              className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors"
            >
              Developer Docs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 