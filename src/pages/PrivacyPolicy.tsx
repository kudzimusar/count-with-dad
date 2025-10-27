import { WebsiteHeader } from "@/components/layout/WebsiteHeader";
import { WebsiteFooter } from "@/components/layout/WebsiteFooter";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <WebsiteHeader />

      <main className="flex-1 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-yellow-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-purple-200 dark:border-purple-800 mb-6 shadow-lg">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Your Privacy Matters</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Content */}
            <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-8 lg:p-12">
              <div className="prose prose-lg max-w-none space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    This privacy policy applies to the "Count to 100 - Kids Learning App" (hereby referred to as "the App"). 
                    We are committed to protecting the privacy of children and ensuring a safe learning environment. 
                    This policy explains how we handle user information in a privacy-first, transparent manner.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    <strong>We collect minimal information necessary to provide a personalized learning experience.</strong>
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    The App stores the following data securely in the cloud:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                    <li><strong>Account Information:</strong> Email and password (encrypted) for parent/guardian authentication</li>
                    <li><strong>Child Profile:</strong> Nickname (required), age (required), avatar selection, and gender (optional)</li>
                    <li><strong>Parent Information:</strong> Parent/guardian email and relationship to child (optional)</li>
                    <li><strong>Progress Data:</strong> Counting progress, levels completed, stars earned, puzzle and math game scores</li>
                    <li><strong>App Settings:</strong> Sound preferences, voice settings, daily goals, and time limits</li>
                    <li><strong>Analytics:</strong> Session duration, activity patterns, error patterns (for improving the app)</li>
                    <li><strong>Feedback:</strong> User-submitted feedback and suggestions</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong>Important:</strong> All data is stored securely in your own Supabase database that you control. 
                    Your child's data is encrypted in transit and at rest. We use industry-standard security practices 
                    to protect user information.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">How We Use Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    The securely stored information is used to:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
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
                  <h2 className="text-3xl font-bold mb-4">Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We take data security seriously and implement industry-standard security measures:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                    <li>All data is encrypted in transit using HTTPS/TLS</li>
                    <li>Passwords are securely hashed and never stored in plain text</li>
                    <li>Database access is protected with Row Level Security (RLS) policies</li>
                    <li>Each user can only access their own data</li>
                    <li>Regular security audits and updates</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Your data is stored in your own Supabase database infrastructure with enterprise-grade security and compliance.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Third-Party Services</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The App uses Supabase for secure database and authentication services. Supabase is a trusted, 
                    open-source backend platform that complies with GDPR, CCPA, and other privacy regulations. 
                    No data is shared with advertising networks or other third parties.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Children's Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    This App is designed for children ages 3-8. We take children's privacy seriously:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                    <li>We only collect the minimum information needed (nickname and age)</li>
                    <li>No personally identifiable information is required to use the app</li>
                    <li>Parent Gate protects access to settings and feedback features</li>
                    <li>Parent/guardian email is optional and only used for progress updates if provided</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    We comply with COPPA (Children's Online Privacy Protection Act) and similar international regulations 
                    for protecting children's privacy online.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Parent Control</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Parents and guardians have full control over their child's data:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                    <li>Access the Parent Dashboard to view all collected information</li>
                    <li>Edit or update child profile information at any time</li>
                    <li>View analytics and session history</li>
                    <li>Review and manage submitted feedback</li>
                    <li>Delete all data using the "Reset Progress" feature</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Data Deletion</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You have full control over your data and can request deletion at any time:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                    <li>Use the "Reset Progress" button in the Parent Dashboard to delete all app data</li>
                    <li>Delete your account entirely by contacting support</li>
                    <li>Upon account deletion, all associated data is permanently removed from our databases</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Data deletion is permanent and cannot be undone.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Changes to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this privacy policy from time to time. We will notify users of any changes by updating 
                    the "Last updated" date at the top of this policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-muted/50 rounded-xl p-6 border border-border">
                    <p className="font-semibold mb-2">Count to 100 Support Team</p>
                    <p className="text-muted-foreground">
                      <strong>Email:</strong>{" "}
                      <a href="mailto:kudzimusar@gmail.com" className="text-primary hover:underline">
                        kudzimusar@gmail.com
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                      We typically respond to all inquiries within 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WebsiteFooter />
    </div>
  );
};

export default PrivacyPolicy;
