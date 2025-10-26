import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Heart, Target } from "lucide-react";

const About = () => {
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

        <h1 className="text-4xl font-bold text-foreground mb-4">About Count to 100</h1>
        <p className="text-muted-foreground mb-8">Making learning fun, one number at a time</p>

        <section className="space-y-8 text-foreground/90">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="leading-relaxed">
              Count to 100 is designed to help young children develop essential early math skills through 
              engaging, interactive gameplay. We believe learning should be fun, rewarding, and accessible 
              to every child.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-primary/10 rounded-xl p-6">
              <Star className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Engaging Learning</h3>
              <p className="text-sm leading-relaxed">
                Interactive games and challenges keep children motivated and excited to learn
              </p>
            </div>

            <div className="bg-secondary/10 rounded-xl p-6">
              <Heart className="h-10 w-10 text-secondary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Safe & Private</h3>
              <p className="text-sm leading-relaxed">
                No ads, no data collection, no internet required—just pure learning fun
              </p>
            </div>

            <div className="bg-accent/10 rounded-xl p-6">
              <Target className="h-10 w-10 text-accent mb-3" />
              <h3 className="text-lg font-semibold mb-2">Progressive Learning</h3>
              <p className="text-sm leading-relaxed">
                Adaptive difficulty levels ensure children are appropriately challenged
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">What's Inside</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">🔢 Counting Mode</h3>
                <p className="leading-relaxed">
                  Three ways to practice: sequential counting, number challenges, and free exploration
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1">🧩 Puzzle Mode</h3>
                <p className="leading-relaxed">
                  Find hidden numbers in colorful grids, developing visual recognition and problem-solving skills
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1">➕ Math Mode</h3>
                <p className="leading-relaxed">
                  Practice basic addition with progressively challenging problems
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1">👨‍👩‍👧 Parent Dashboard</h3>
                <p className="leading-relaxed">
                  Track progress, customize settings, and manage your child's learning journey
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Privacy & Safety</h2>
            <p className="leading-relaxed">
              Your child's safety and privacy are our top priorities. Count to 100:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Contains no advertisements</li>
              <li>Does not collect or share any personal data</li>
              <li>Works completely offline</li>
              <li>Includes parent controls protected by a parent gate</li>
              <li>Is designed specifically for children ages 5-8</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Read our full{" "}
              <button 
                onClick={() => navigate("/privacy-policy")} 
                className="text-primary hover:underline"
              >
                Privacy Policy
              </button>
              {" "}for more details.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Version Information</h2>
            <p className="leading-relaxed">
              Version: 1.0.0<br />
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="bg-primary/10 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-3">Contact & Support</h2>
            <p className="leading-relaxed mb-4">
              Questions, feedback, or need help? We're here for you!
            </p>
            <Button onClick={() => navigate("/support")} variant="default">
              Visit Support Page
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
