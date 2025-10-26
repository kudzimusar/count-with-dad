import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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

        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-6 text-foreground/90">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Agreement to Terms</h2>
            <p className="leading-relaxed">
              By downloading, installing, or using the "Count to 100 - Kids Learning App" (the "App"), 
              you agree to be bound by these Terms of Service. If you do not agree to these terms, 
              please do not use the App.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Use License</h2>
            <p className="leading-relaxed">
              We grant you a personal, non-transferable, non-exclusive license to use the App for personal, 
              non-commercial purposes, subject to these Terms of Service.
            </p>
            <p className="leading-relaxed mt-2">You may not:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Modify, copy, or create derivative works of the App</li>
              <li>Reverse engineer, decompile, or disassemble the App</li>
              <li>Remove, alter, or obscure any proprietary notices on the App</li>
              <li>Use the App for any commercial purpose or for any public display</li>
              <li>Transfer the App to another person or entity</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Educational Purpose</h2>
            <p className="leading-relaxed">
              This App is designed as an educational tool to help children learn counting, basic math, 
              and problem-solving skills. While we strive for accuracy and effectiveness, we make no 
              guarantees about specific educational outcomes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Parental Supervision</h2>
            <p className="leading-relaxed">
              This App is intended for children ages 3-8. We recommend parental supervision during use. 
              The App includes a Parent Gate feature to restrict access to certain settings and features, 
              ensuring children cannot accidentally modify settings or access parent-only areas.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">User Registration</h2>
            <p className="leading-relaxed">
              To use the App, you must create an account with a valid email address and password. 
              After authentication, you will create a child profile with a nickname and age. 
              All information is stored securely in an encrypted database. Parent email addresses 
              may optionally be provided for progress updates.
            </p>
            <p className="leading-relaxed mt-2">
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">User Data and Privacy</h2>
            <p className="leading-relaxed">
              All user data, including child profile information, progress data, analytics, and feedback, 
              is stored securely in an encrypted cloud database. We use industry-standard security measures 
              to protect your information. Please refer to our Privacy Policy for comprehensive details on 
              data handling, security practices, and your rights regarding your data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Feedback and Analytics</h2>
            <p className="leading-relaxed">
              The App includes features for collecting user feedback and tracking usage analytics to improve 
              the learning experience. All feedback and analytics data is stored securely in our database. 
              By using the feedback feature, you grant us permission to use your suggestions to improve the App. 
              Analytics data is anonymized and used solely for improving app functionality and user experience.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Disclaimer of Warranties</h2>
            <p className="leading-relaxed">
              The App is provided "as is" and "as available" without warranties of any kind, either express 
              or implied, including but not limited to warranties of merchantability, fitness for a particular 
              purpose, or non-infringement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
              directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting 
              from your use of the App.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Updates and Modifications</h2>
            <p className="leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the App at any time without notice. 
              We may also update these Terms of Service from time to time. Your continued use of the App 
              after changes constitutes acceptance of the modified terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Refund Policy</h2>
            <p className="leading-relaxed">
              Refund requests are subject to the Google Play Store's refund policy. Please contact Google Play 
              support for refund inquiries.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through the Support page.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
