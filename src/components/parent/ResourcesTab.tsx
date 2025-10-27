import { FileText, HelpCircle, Mail, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResourcesTabProps {
  onOpenFeedback: () => void;
}

export function ResourcesTab({ onOpenFeedback }: ResourcesTabProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Quick Help */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border-2 border-primary/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Quick Help
        </h3>
        
        <div className="space-y-3">
          <div className="bg-background p-4 rounded-lg">
            <h4 className="font-bold mb-2">How does counting work?</h4>
            <p className="text-sm text-muted-foreground">
              Choose "Count in Order" to practice 1-100 sequentially, or try "Number Challenge" to find specific numbers.
            </p>
          </div>
          
          <div className="bg-background p-4 rounded-lg">
            <h4 className="font-bold mb-2">What are stars for?</h4>
            <p className="text-sm text-muted-foreground">
              Stars are rewards for completing activities. Collect them to track progress and celebrate achievements!
            </p>
          </div>
          
          <div className="bg-background p-4 rounded-lg">
            <h4 className="font-bold mb-2">Setting daily goals</h4>
            <p className="text-sm text-muted-foreground">
              Set realistic daily counting goals in the Profile tab to encourage consistent practice.
            </p>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          App Information
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/about')}
            className="w-full bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
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
            className="w-full bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
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
            className="w-full bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
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
      </div>

      {/* Support */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Get Support
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/support')}
            className="w-full bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
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
            className="w-full bg-primary text-primary-foreground p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-between group"
          >
            <div className="text-left flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <div className="font-bold text-lg">Share Feedback</div>
                <div className="text-sm text-primary-foreground/80">Help us improve</div>
              </div>
            </div>
            <div className="text-primary-foreground group-hover:translate-x-1 transition-transform text-xl">→</div>
          </button>
        </div>
      </div>
    </div>
  );
}
