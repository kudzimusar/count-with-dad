import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WebsiteHeader } from '@/components/layout/WebsiteHeader';
import { WebsiteFooter } from '@/components/layout/WebsiteFooter';
import { Brain, Users, Shield, Puzzle, Calculator, Target, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'Multiple Learning Modes',
      description: 'Count in order, tackle puzzles, solve math problems - multiple ways to master numbers 1-100.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Parent Dashboard',
      description: 'Track your child\'s progress, view achievements, and customize their learning experience.',
      gradient: 'from-pink-500 to-yellow-500',
    },
    {
      icon: Shield,
      title: 'Safe & Private',
      description: 'No ads, no tracking. COPPA compliant with robust privacy protection for your kids.',
      gradient: 'from-yellow-500 to-green-500',
    },
  ];

  const modes = [
    {
      icon: Target,
      title: 'Counting Mode',
      description: 'Learn to count from 1 to 100 in sequence with voice guidance and visual feedback.',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Puzzle,
      title: 'Puzzle Mode',
      description: 'Match numbers to their spots and build spatial recognition skills through fun puzzles.',
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      icon: Calculator,
      title: 'Math Mode',
      description: 'Practice addition and subtraction with engaging visual aids and instant feedback.',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
  ];

  const steps = [
    { number: '1', title: 'Choose Your Mode', description: 'Pick from counting, puzzles, or math activities' },
    { number: '2', title: 'Learn & Play', description: 'Interactive lessons adapt to your child\'s pace' },
    { number: '3', title: 'Track Progress', description: 'Watch achievements unlock as skills grow' },
    { number: '4', title: 'Master Numbers', description: 'Celebrate milestones from 1 to 100!' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <WebsiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-yellow-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-purple-200 dark:border-purple-800 mb-8 shadow-lg animate-fade-in">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Ages 3-7 • Free to Start</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
                Make Learning Numbers Fun!
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
              Interactive counting app that helps kids master numbers 1-100 through engaging games, puzzles, and activities.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button asChild size="lg" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-shadow">
                <Link to="/app" className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  Launch App - It's Free!
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-muted-foreground mt-8">
              ✨ No download required • Works on any device • COPPA compliant
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">💯</div>
          <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🎯</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Why Parents Love Count to 100
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted by families worldwide to make early math education engaging and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-background to-muted/50 border-2 border-border hover:border-primary/50 transition-all hover:shadow-xl"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-yellow-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              What's Inside the App
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three unique learning modes to keep your child engaged and progressing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {modes.map((mode, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl ${mode.bg} dark:bg-opacity-10 border-2 border-transparent hover:border-primary/50 transition-all hover:shadow-xl`}
              >
                <mode.icon className={`h-12 w-12 ${mode.color} mb-6`} />
                <h3 className="text-2xl font-bold mb-4">{mode.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{mode.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, intuitive, and designed for young learners.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-bold mb-4 shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  
                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-8 -right-3 h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Counting?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of families helping their kids master numbers through play.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-shadow">
              <Link to="/app" className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Launch App Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 border-white/30 text-white">
              <Link to="/support">Get Support</Link>
            </Button>
          </div>
          <p className="text-sm mt-8 opacity-75">
            Free to start • No credit card required • Works on any device
          </p>
        </div>
      </section>

      <WebsiteFooter />
    </div>
  );
}
