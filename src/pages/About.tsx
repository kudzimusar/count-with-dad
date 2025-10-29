import { WebsiteHeader } from "@/components/layout/WebsiteHeader";
import { WebsiteFooter } from "@/components/layout/WebsiteFooter";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Heart, Target, BookOpen, Puzzle, Calculator, Users, Shield, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <WebsiteHeader />

      <main className="flex-1 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-yellow-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-purple-200 dark:border-purple-800 mb-6 shadow-lg">
              <Heart className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Our Story</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
                This App Was Born From My Son Nono's Struggle With Numbers
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Created by a dad who was tired of flashy apps that don't teach
            </p>
          </div>

          {/* Nono's Story */}
          <section className="max-w-4xl mx-auto mb-16">
            <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-8 lg:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  I watched my son Nono play with countless 'educational' apps that were all flash and no substance. 
                  He'd tap screens, collect points, but never actually understand what numbers meant. The apps were 
                  either too distracting or too boring - none of them genuinely taught the foundational math skills 
                  he needed.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  One day, I realized: Nono could count to 10 when we sat together, focused. But the moment a sibling 
                  walked by or a toy caught his eye, the learning stopped. That's when I knew we needed something different.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <strong>Count with Dad</strong> isn't just another app. It's the tool I created night after night, 
                  watching what actually worked for Nono's learning. I built it step by step, testing each feature to 
                  ensure it teaches practical understanding, not just memorization.
                </p>
              </div>
            </div>
          </section>

          {/* What Makes It Different */}
          <section className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-600 rounded-2xl text-white p-8 lg:p-12 shadow-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-center">I Didn't Build a Game - I Built a Learning Companion</h2>
              <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto mb-8 opacity-90">
                While other apps try to disguise learning as play, we do the opposite: we make learning so engaging 
                it feels like discovery. Every feature was designed with one question: "Will this help a child actually 
                understand numbers?"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-semibold mb-2">Teaches Practical Understanding</p>
                  <p className="text-sm opacity-90">Not just memorization</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-semibold mb-2">Grows With Your Child</p>
                  <p className="text-sm opacity-90">From basic counting to complex math</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-semibold mb-2">Minimizes Distractions</p>
                  <p className="text-sm opacity-90">Focused, clean interface</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-semibold mb-2">Provides Real Affirmation</p>
                  <p className="text-sm opacity-90">Celebrates genuine achievements</p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">Built on Real Learning Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-8 hover:border-purple-500/50 transition-all">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6">
                  <Star className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Engaging Learning</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Interactive games and challenges keep children motivated and excited to learn through colorful, 
                  rewarding experiences designed specifically for young learners.
                </p>
              </div>

              <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-8 hover:border-pink-500/50 transition-all">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-pink-600 to-yellow-600 mb-6">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Safe & Private</h3>
                <p className="text-muted-foreground leading-relaxed">
                  COPPA compliant with no ads, no data collection, and no internet required. Parent controls 
                  are protected by a parent gate for complete peace of mind.
                </p>
              </div>

              <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-8 hover:border-yellow-500/50 transition-all">
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-yellow-600 to-purple-600 mb-6">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Progressive Learning</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Adaptive difficulty levels ensure children are appropriately challenged as they progress, 
                  building confidence and skills at their own pace.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">What's Inside</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-8">
                <BookOpen className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">🔢 Counting Mode</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Three ways to practice: sequential counting to build number order recognition, 
                  number challenges to test skills, and free exploration mode for self-directed learning.
                </p>
              </div>

              <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-8">
                <Puzzle className="h-12 w-12 text-pink-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">🧩 Puzzle Mode</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find hidden numbers in colorful grids, developing visual recognition, pattern identification, 
                  and problem-solving skills through engaging puzzle challenges.
                </p>
              </div>

              <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-8">
                <Calculator className="h-12 w-12 text-yellow-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">➕ Math Mode</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Practice basic addition with progressively challenging problems. Perfect for building 
                  foundational math skills and number fluency.
                </p>
              </div>

              <div className="bg-background rounded-2xl border-2 border-border shadow-xl p-8">
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">👨‍👩‍👧 Parent Dashboard</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track progress, view detailed analytics, customize settings, and manage your child's 
                  learning journey with comprehensive parental controls.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-600 rounded-2xl text-white p-8 lg:p-12 shadow-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-center">Privacy & Safety First</h2>
              <p className="text-lg mb-6 text-center opacity-90">
                Your child's safety and privacy are our top priorities. Count to 100:
              </p>
              <ul className="space-y-3 max-w-2xl mx-auto mb-8">
                <li className="flex items-start gap-3">
                  <Heart className="h-6 w-6 flex-shrink-0 mt-0.5" />
                  <span>Contains no advertisements whatsoever</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-6 w-6 flex-shrink-0 mt-0.5" />
                  <span>Does not collect or share any personal data</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="h-6 w-6 flex-shrink-0 mt-0.5" />
                  <span>Works completely offline - no internet required</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="h-6 w-6 flex-shrink-0 mt-0.5" />
                  <span>Includes parent controls protected by a parent gate</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-6 w-6 flex-shrink-0 mt-0.5" />
                  <span>COPPA compliant and designed specifically for children ages 3-7</span>
                </li>
              </ul>
              <div className="text-center">
                <Button asChild size="lg" variant="secondary" className="shadow-xl">
                  <Link to="/privacy-policy">Read Our Privacy Policy</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Final Message */}
          <section className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-yellow-950/20 rounded-2xl border-2 border-border shadow-xl p-8 lg:p-12">
              <Heart className="h-16 w-16 text-purple-600 mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Today, Nono Doesn't Just Count Numbers - He Understands Them
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                He doesn't just solve problems - he enjoys the challenge. And that's what I want for every child.
              </p>
              <p className="text-xl font-semibold mb-8">
                Because every child deserves to count with confidence - and every parent deserves tools that actually help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="default">
                  <Link to="/app">Start Learning Today</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/support">Get Support</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <WebsiteFooter />
    </div>
  );
};

export default About;
