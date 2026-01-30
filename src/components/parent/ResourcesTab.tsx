import { FileText, HelpCircle, Book, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BentoCard } from './widgets';
import { AnimatedMascot } from '@/components/mascots/AnimatedMascot';

interface ResourcesTabProps {
  onOpenFeedback: () => void;
}

export function ResourcesTab({ onOpenFeedback }: ResourcesTabProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Quick Help */}
      <BentoCard variant="hero">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <div className="w-8 h-8">
            <AnimatedMascot type="apple" animated />
          </div>
          <span>Quick Help</span>
        </h3>
        
        <div className="space-y-3">
          <div className="bg-background p-4 rounded-2xl border border-border/40">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              How does counting work?
            </h4>
            <p className="text-sm text-muted-foreground">
              Choose "Count in Order" to practice 1-100 sequentially, or try "Number Challenge" to find specific numbers.
            </p>
          </div>
          
          <div className="bg-background p-4 rounded-2xl border border-border/40">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <div className="w-4 h-4">
                <AnimatedMascot type="star" />
              </div>
              What are stars for?
            </h4>
            <p className="text-sm text-muted-foreground">
              Stars are rewards for completing activities. Collect them to track progress and celebrate achievements!
            </p>
          </div>
          
          <div className="bg-background p-4 rounded-2xl border border-border/40">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <div className="w-4 h-4">
                <AnimatedMascot type="cookie" />
              </div>
              Setting daily goals
            </h4>
            <p className="text-sm text-muted-foreground">
              Set realistic daily counting goals in the Profile tab to encourage consistent practice.
            </p>
          </div>
        </div>
      </BentoCard>

      {/* App Information */}
      <BentoCard>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <div className="w-8 h-8">
            <AnimatedMascot type="blueberry" animated />
          </div>
          <span>App Information</span>
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/about')}
            className="w-full bg-background p-4 rounded-2xl border border-border/40 hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="text-left flex items-center gap-3">
              <Book className="h-5 w-5 text-primary" />
              <div>
                <div className="font-bold">About Count to 100</div>
                <div className="text-sm text-muted-foreground">Learn about the app</div>
              </div>
            </div>
            <div className="text-primary group-hover:translate-x-1 transition-transform">→</div>
          </button>

          <button
            onClick={() => navigate('/privacy-policy')}
            className="w-full bg-background p-4 rounded-2xl border border-border/40 hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="text-left flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <div className="font-bold">Privacy Policy</div>
                <div className="text-sm text-muted-foreground">How we protect your data</div>
              </div>
            </div>
            <div className="text-primary group-hover:translate-x-1 transition-transform">→</div>
          </button>

          <button
            onClick={() => navigate('/terms-of-service')}
            className="w-full bg-background p-4 rounded-2xl border border-border/40 hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="text-left flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <div className="font-bold">Terms of Service</div>
                <div className="text-sm text-muted-foreground">Terms and conditions</div>
              </div>
            </div>
            <div className="text-primary group-hover:translate-x-1 transition-transform">→</div>
          </button>
        </div>
      </BentoCard>

      {/* Support */}
      <BentoCard>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <div className="w-8 h-8">
            <AnimatedMascot type="orange" animated />
          </div>
          <span>Get Support</span>
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/support')}
            className="w-full bg-background p-4 rounded-2xl border border-border/40 hover:border-primary/40 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="text-left flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-primary" />
              <div>
                <div className="font-bold">Support & Help Center</div>
                <div className="text-sm text-muted-foreground">Get help and contact us</div>
              </div>
            </div>
            <div className="text-primary group-hover:translate-x-1 transition-transform">→</div>
          </button>

          <button
            onClick={onOpenFeedback}
            className="w-full bg-primary text-primary-foreground p-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-between group"
          >
            <div className="text-left flex items-center gap-3">
              <div className="w-8 h-8">
                <AnimatedMascot type="banana" animated wiggle />
              </div>
              <div>
                <div className="font-bold text-lg">Share Feedback</div>
                <div className="text-sm text-primary-foreground/80">Help us improve</div>
              </div>
            </div>
            <div className="text-primary-foreground group-hover:translate-x-1 transition-transform text-xl">→</div>
          </button>
        </div>
      </BentoCard>
    </div>
  );
}
