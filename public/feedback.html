import { useState } from 'react';
import { WebsiteHeader } from '@/components/layout/WebsiteHeader';
import { WebsiteFooter } from '@/components/layout/WebsiteFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Clock, HelpCircle } from 'lucide-react';
import { z } from 'zod';

const feedbackSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  category: z.string().min(1, 'Please select a category'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

export default function Feedback() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = feedbackSchema.parse(formData);

      // Create mailto link
      const subject = encodeURIComponent(`[Count to 100] ${validatedData.category}`);
      const body = encodeURIComponent(
        `Name: ${validatedData.name}\nEmail: ${validatedData.email}\n\nCategory: ${validatedData.category}\n\nMessage:\n${validatedData.message}`
      );
      const mailtoLink = `mailto:kudzimusar@gmail.com?subject=${subject}&body=${body}`;

      // Open email client
      window.location.href = mailtoLink;

      // Show success message
      toast({
        title: 'Opening your email client...',
        description: 'Your feedback will be sent to kudzimusar@gmail.com',
      });

      // Reset form
      setFormData({ name: '', email: '', category: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: 'Validation Error',
          description: 'Please check the form and try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const characterCount = formData.message.length;
  const maxCharacters = 1000;

  return (
    <div className="min-h-screen flex flex-col">
      <WebsiteHeader />

      <main className="flex-1 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-yellow-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have a question, suggestion, or just want to say hi? We'd love to hear from you!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-6 lg:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your name"
                        className={errors.name ? 'border-destructive' : ''}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Category <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                          <SelectItem value="Feature Request">Feature Request</SelectItem>
                          <SelectItem value="Bug Report">Bug Report</SelectItem>
                          <SelectItem value="Partnership">Partnership</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us what's on your mind..."
                        rows={6}
                        className={errors.message ? 'border-destructive' : ''}
                      />
                      <div className="flex items-center justify-between text-sm">
                        {errors.message ? (
                          <p className="text-destructive">{errors.message}</p>
                        ) : (
                          <p className="text-muted-foreground">Minimum 10 characters</p>
                        )}
                        <p className={`${characterCount > maxCharacters ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {characterCount}/{maxCharacters}
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Contact Info Sidebar */}
              <div className="space-y-6">
                {/* Email Contact */}
                <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">Email Us</h3>
                      <p className="text-sm text-muted-foreground">Direct contact</p>
                    </div>
                  </div>
                  <a
                    href="mailto:kudzimusar@gmail.com"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    kudzimusar@gmail.com
                  </a>
                </div>

                {/* Response Time */}
                <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-pink-600 to-yellow-600">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">Response Time</h3>
                      <p className="text-sm text-muted-foreground">Typical reply</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    We typically respond within <strong>24-48 hours</strong> during business days.
                  </p>
                </div>

                {/* FAQ Link */}
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <HelpCircle className="h-6 w-6 text-purple-600" />
                    <h3 className="font-bold">Need Quick Help?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check our support page for answers to common questions.
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href="/support">Visit Support Center</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WebsiteFooter />
    </div>
  );
}
