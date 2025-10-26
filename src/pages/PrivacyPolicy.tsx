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
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
            <p className="leading-relaxed">
              <strong>We do not collect, store, or share any personal information.</strong>
            </p>
            <p className="leading-relaxed mt-2">
              The App uses local storage on your device to save game progress, including:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Current counting progress and highest count achieved</li>
              <li>Stars and scores earned</li>
              <li>Puzzle and math game levels completed</li>
              <li>Child's name and age (stored only on your device)</li>
              <li>App settings (sound, voice preferences)</li>
            </ul>
            <p className="leading-relaxed mt-2">
              <strong>Important:</strong> All this data is saved locally on the user's device only and is never transmitted, 
              uploaded, or accessed by the developers or any third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <p className="leading-relaxed">
              Since all data is stored locally on your device and never transmitted over the internet, 
              your child's information remains completely private and secure on your device.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
            <p className="leading-relaxed">
              The App does not integrate with any third-party services, analytics tools, or advertising networks. 
              No data is shared with third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Children's Privacy</h2>
            <p className="leading-relaxed">
              This App is designed for children ages 5-8. We do not knowingly collect any personal information from children. 
              The App includes a Parent Gate to restrict access to parent-only features, ensuring children cannot accidentally 
              access settings or reset progress.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Data Deletion</h2>
            <p className="leading-relaxed">
              Since no data is collected or stored by us, there is no data to delete from our servers. 
              You can delete all locally stored app data by:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Using the "Reset Progress" button in the Parent Dashboard</li>
              <li>Clearing your browser's local storage</li>
              <li>Uninstalling the App</li>
            </ul>
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
