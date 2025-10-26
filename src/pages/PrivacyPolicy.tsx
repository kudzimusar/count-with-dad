import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to App
        </Button>

        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-6 text-foreground/90">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
            <p className="leading-relaxed">
              This privacy policy applies to the "Count to 100 - Kids Learning App" (hereby referred to as "the App"). 
              We are committed to protecting the privacy of children and ensuring a safe learning environment. 
              This policy explains how we handle user information in a privacy-first, transparent manner.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
            <p className="leading-relaxed">
              <strong>We collect minimal information necessary to provide a personalized learning experience.</strong>
            </p>
            <p className="leading-relaxed mt-2">
              The App stores the following data securely in the cloud:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li><strong>Account Information:</strong> Email and password (encrypted) for parent/guardian authentication</li>
              <li><strong>Child Profile:</strong> Nickname (required), age (required), avatar selection, and gender (optional)</li>
              <li><strong>Parent Information:</strong> Parent/guardian email and relationship to child (optional)</li>
              <li><strong>Progress Data:</strong> Counting progress, levels completed, stars earned, puzzle and math game scores</li>
              <li><strong>App Settings:</strong> Sound preferences, voice settings, daily goals, and time limits</li>
              <li><strong>Analytics:</strong> Session duration, activity patterns, error patterns (for improving the app)</li>
              <li><strong>Feedback:</strong> User-submitted feedback and suggestions</li>
            </ul>
            <p className="leading-relaxed mt-2">
              <strong>Important:</strong> All data is stored securely in your own Supabase database that you control. 
              Your child's data is encrypted in transit and at rest. We use industry-standard security practices 
              to protect user information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">How We Use Information</h2>
            <p className="leading-relaxed">
              The securely stored information is used to:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Authenticate parents/guardians and provide secure access to the app</li>
              <li>Personalize the learning experience for each child</li>
              <li>Track progress across multiple devices</li>
              <li>Provide appropriate difficulty levels based on performance</li>
              <li>Send optional progress updates via parent email (if provided)</li>
              <li>Understand usage patterns to improve the app</li>
              <li>Address user feedback and suggestions</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <p className="leading-relaxed">
              We take data security seriously and implement industry-standard security measures:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>All data is encrypted in transit using HTTPS/TLS</li>
              <li>Passwords are securely hashed and never stored in plain text</li>
              <li>Database access is protected with Row Level Security (RLS) policies</li>
              <li>Each user can only access their own data</li>
              <li>Regular security audits and updates</li>
            </ul>
            <p className="leading-relaxed mt-2">
              Your data is stored in your own Supabase database infrastructure with enterprise-grade security and compliance.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
            <p className="leading-relaxed">
              The App uses Supabase for secure database and authentication services. Supabase is a trusted, 
              open-source backend platform that complies with GDPR, CCPA, and other privacy regulations. 
              No data is shared with advertising networks or other third parties.
            </p>
            <p className="leading-relaxed mt-2">
              For more information about Supabase's privacy practices, please visit their privacy policy at 
              <a href="https://supabase.com/privacy" className="text-primary hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                supabase.com/privacy
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Children's Privacy</h2>
            <p className="leading-relaxed">
              This App is designed for children ages 3-8. We take children's privacy seriously:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>We only collect the minimum information needed (nickname and age)</li>
              <li>No personally identifiable information is required to use the app</li>
              <li>All data remains on the device and is never shared</li>
              <li>Parent Gate protects access to settings and feedback features</li>
              <li>Parent/guardian email is optional and only used for progress updates if provided</li>
            </ul>
            <p className="leading-relaxed mt-2">
              We comply with COPPA (Children's Online Privacy Protection Act) and similar international regulations 
              for protecting children's privacy online.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Parent Control</h2>
            <p className="leading-relaxed">
              Parents and guardians have full control over their child's data:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Access the Parent Dashboard to view all collected information</li>
              <li>Edit or update child profile information at any time</li>
              <li>View analytics and session history</li>
              <li>Review and manage submitted feedback</li>
              <li>Delete all data using the "Reset Progress" feature</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Data Deletion</h2>
            <p className="leading-relaxed">
              You have full control over your data and can request deletion at any time:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Use the "Reset Progress" button in the Parent Dashboard to delete all app data</li>
              <li>Delete your account entirely by contacting support</li>
              <li>Upon account deletion, all associated data is permanently removed from our databases</li>
            </ul>
            <p className="leading-relaxed mt-2">
              Data deletion is permanent and cannot be undone.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this privacy policy from time to time. We will notify users of any changes by updating 
              the "Last updated" date at the top of this policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this privacy policy, please contact us through the Support page.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
