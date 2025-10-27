import { Link } from 'react-router-dom';
import { WebsiteHeader } from '@/components/layout/WebsiteHeader';
import { WebsiteFooter } from '@/components/layout/WebsiteFooter';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, MessageCircle, HelpCircle, Book } from 'lucide-react';

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col">
      <WebsiteHeader />

      <main className="flex-1 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-yellow-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-purple-200 dark:border-purple-800 mb-6 shadow-lg">
              <HelpCircle className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">We're Here to Help</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
                Support Center
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          {/* Quick Help Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-8 hover:border-purple-500/50 transition-all">
              <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Email Support</h3>
              <p className="text-muted-foreground mb-6">
                Get personalized help from our support team. We typically respond within 24-48 hours.
              </p>
              <a
                href="mailto:kudzimusar@gmail.com"
                className="text-primary hover:underline font-medium inline-flex items-center gap-2"
              >
                kudzimusar@gmail.com
                <Mail className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-8 hover:border-pink-500/50 transition-all">
              <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-pink-600 to-yellow-600 mb-6">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Send Feedback</h3>
              <p className="text-muted-foreground mb-6">
                Have a suggestion or want to report an issue? We'd love to hear from you!
              </p>
              <Button asChild>
                <Link to="/feedback">Submit Feedback</Link>
              </Button>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Book className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">
                Quick answers to common questions about Count to 100
              </p>
            </div>

            <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-6 lg:p-8">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border-b border-border last:border-0">
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold text-lg">What age is this app designed for?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    Count to 100 is specifically designed for children ages 3-7 who are learning to count and recognize numbers.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-b border-border last:border-0">
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold text-lg">Is the app really free?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    Yes! The core features are completely free including counting mode and progress tracking.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-b border-border last:border-0">
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold text-lg">Is my child's data safe?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    Absolutely. COPPA compliant with end-to-end encryption. See our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>

          {/* Still Need Help */}
          <section className="mt-16 text-center">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-600 rounded-2xl text-white p-8 lg:p-12 shadow-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-lg mb-8 opacity-90">
                Our support team is here to help!
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-xl">
                <Link to="/feedback">Contact Support</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <WebsiteFooter />
    </div>
  );
}
