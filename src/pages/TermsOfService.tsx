import { WebsiteHeader } from "@/components/layout/WebsiteHeader";
import { WebsiteFooter } from "@/components/layout/WebsiteFooter";
import { FileText } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <WebsiteHeader />

      <main className="flex-1 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-yellow-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-purple-200 dark:border-purple-800 mb-6 shadow-lg">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Legal Agreement</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
                  Terms of Service
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
                  <h2 className="text-3xl font-bold mb-4">Agreement to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By downloading, installing, or using the "Count to 100 - Kids Learning App" (the "App"), 
                    you agree to be bound by these Terms of Service. If you do not agree to these terms, 
                    please do not use the App.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Use License</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We grant you a personal, non-transferable, non-exclusive license to use the App for personal, 
                    non-commercial purposes, subject to these Terms of Service.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">You may not:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 text-muted-foreground">
                    <li>Modify, copy, or create derivative works of the App</li>
                    <li>Reverse engineer, decompile, or disassemble the App</li>
                    <li>Remove, alter, or obscure any proprietary notices on the App</li>
                    <li>Use the App for any commercial purpose or for any public display</li>
                    <li>Transfer the App to another person or entity</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Educational Purpose</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    This App is designed as an educational tool to help children learn counting, basic math, 
                    and problem-solving skills. While we strive for accuracy and effectiveness, we make no 
                    guarantees about specific educational outcomes.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Parental Supervision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    This App is intended for children ages 3-8. We recommend parental supervision during use. 
                    The App includes a Parent Gate feature to restrict access to certain settings and features, 
                    ensuring children cannot accidentally modify settings or access parent-only areas.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">User Registration</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    To use the App, you must create an account with a valid email address and password. 
                    After authentication, you will create a child profile with a nickname and age. 
                    All information is stored securely in an encrypted database. Parent email addresses 
                    may optionally be provided for progress updates.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials 
                    and for all activities that occur under your account.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">User Data and Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All user data, including child profile information, progress data, analytics, and feedback, 
                    is stored securely in an encrypted cloud database. We use industry-standard security measures 
                    to protect your information. Please refer to our Privacy Policy for comprehensive details on 
                    data handling, security practices, and your rights regarding your data.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Feedback and Analytics</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The App includes features for collecting user feedback and tracking usage analytics to improve 
                    the learning experience. All feedback and analytics data is stored securely in our database. 
                    By using the feedback feature, you grant us permission to use your suggestions to improve the App. 
                    Analytics data is anonymized and used solely for improving app functionality and user experience.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Disclaimer of Warranties</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The App is provided "as is" and "as available" without warranties of any kind, either express 
                    or implied, including but not limited to warranties of merchantability, fitness for a particular 
                    purpose, or non-infringement.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
                    special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                    directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting 
                    from your use of the App.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Updates and Modifications</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to modify, suspend, or discontinue the App at any time without notice. 
                    We may also update these Terms of Service from time to time. Your continued use of the App 
                    after changes constitutes acceptance of the modified terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Refund Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Refund requests are subject to the Google Play Store's refund policy. Please contact Google Play 
                    support for refund inquiries.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    For any questions, concerns, or requests regarding these Terms of Service, please contact us:
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
                  <p className="text-sm text-muted-foreground leading-relaxed mt-6">
                    By using Count to 100, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                  </p>
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

export default TermsOfService;
