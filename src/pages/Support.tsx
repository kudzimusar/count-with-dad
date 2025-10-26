import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, HelpCircle } from "lucide-react";

const Support = () => {
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

        <h1 className="text-4xl font-bold text-foreground mb-4">Support & Help</h1>
        <p className="text-muted-foreground mb-8">We're here to help you and your child get the most out of the app</p>

        <section className="space-y-8 text-foreground/90">
          <div className="bg-primary/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Contact Us</h2>
            </div>
            <p className="leading-relaxed mb-4">
              Have questions, feedback, or need assistance? We'd love to hear from you!
            </p>
            <p className="leading-relaxed">
              Email: <a href="mailto:support@countto100app.com" className="text-primary hover:underline">
                support@countto100app.com
              </a>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              We typically respond within 24-48 hours.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I access the Parent Dashboard?</h3>
                <p className="leading-relaxed">
                  Tap the menu button (☰) in the top-right corner of the app. You'll be prompted to enter 
                  a 4-digit parent code: <strong>1111</strong>. This prevents children from accidentally 
                  changing settings or resetting progress.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">How does my child progress through levels?</h3>
                <p className="leading-relaxed">
                  Your child needs to complete 10 correct answers to unlock the next level in each game mode. 
                  Progress is tracked and displayed in the menu bar to help motivate continued learning.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Can I reset my child's progress?</h3>
                <p className="leading-relaxed">
                  Yes! Access the Parent Dashboard and tap the "Reset Progress" button. This will clear all 
                  game progress and start fresh.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Does the app work offline?</h3>
                <p className="leading-relaxed">
                  Yes! Once downloaded, the app works completely offline. All progress is saved locally on 
                  your device.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Is my child's data private?</h3>
                <p className="leading-relaxed">
                  Absolutely. We do not collect, store, or transmit any personal data. All information 
                  (name, progress, scores) is stored only on your device and never leaves it. 
                  See our <button 
                    onClick={() => navigate("/privacy-policy")} 
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </button> for more details.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">What age is this app appropriate for?</h3>
                <p className="leading-relaxed">
                  The app is designed for children ages 5-8, focusing on counting, number recognition, 
                  basic addition, and problem-solving skills.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Can I turn off sound or voice guidance?</h3>
                <p className="leading-relaxed">
                  Yes! Access the Parent Dashboard, go to the Settings tab, and toggle sound and voice 
                  guidance on or off. You can also adjust the voice speed and pitch.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">The app isn't working correctly. What should I do?</h3>
                <p className="leading-relaxed">
                  Try these steps:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Close and restart the app</li>
                  <li>Clear your browser cache (if using web version)</li>
                  <li>Ensure you have the latest version installed</li>
                  <li>If problems persist, contact us at support@countto100app.com</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-secondary/10 rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-3">Feedback</h2>
            <p className="leading-relaxed">
              We continuously improve the app based on parent and teacher feedback. If you have suggestions 
              for new features or improvements, please reach out to us at support@countto100app.com
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
