import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  Target, TrendingUp, Users, Briefcase, Award, BookOpen, 
  ArrowRight, CheckCircle, Sparkles, BarChart3, Globe, Zap 
} from 'lucide-react';

interface HomepageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function Homepage({ onSignIn, onSignUp }: HomepageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-foreground">CareerCompass</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Career Guidance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onSignIn}>
                Sign In
              </Button>
              <Button onClick={onSignUp} className="bg-gradient-to-r from-indigo-600 to-purple-600">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-foreground max-w-4xl mx-auto leading-tight">
            Your Career Journey,
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Personalized</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Navigate India's evolving job market with AI-powered career recommendations, 
            skills assessment, and personalized learning paths tailored just for you.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={onSignUp} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-lg px-8">
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={onSignIn} className="text-lg px-8">
              Sign In
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-3xl text-foreground">50K+</p>
            <p className="text-sm text-muted-foreground">Students Guided</p>
          </div>
          <div className="text-center">
            <p className="text-3xl text-foreground">200+</p>
            <p className="text-sm text-muted-foreground">Career Paths</p>
          </div>
          <div className="text-center">
            <p className="text-3xl text-foreground">15K+</p>
            <p className="text-sm text-muted-foreground">Skills Mapped</p>
          </div>
          <div className="text-center">
            <p className="text-3xl text-foreground">94%</p>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-foreground mb-4">
            Why Choose CareerCompass?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The most comprehensive AI career advisor designed specifically for Indian students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-indigo-200 hover:shadow-xl transition-all">
            <CardContent className="pt-6 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                <Target className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl">AI-Powered Matching</h3>
              <p className="text-muted-foreground">
                Advanced algorithms analyze your unique profile to recommend careers with 90%+ accuracy, 
                considering Indian job market dynamics.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-200 hover:shadow-xl transition-all">
            <CardContent className="pt-6 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl">Skills Gap Analysis</h3>
              <p className="text-muted-foreground">
                Identify exactly what skills you need to develop with visual gap analysis and 
                actionable insights for your dream career.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-200 hover:shadow-xl transition-all">
            <CardContent className="pt-6 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl">Real-Time Market Data</h3>
              <p className="text-muted-foreground">
                Access live salary trends, job openings, and growth rates from India's top companies 
                and emerging startups.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-200 hover:shadow-xl transition-all">
            <CardContent className="pt-6 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl">Personalized Learning Paths</h3>
              <p className="text-muted-foreground">
                Get curated courses from NPTEL, Coursera, and other platforms with free and 
                paid options suited to your budget.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-200 hover:shadow-xl transition-all">
            <CardContent className="pt-6 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl">Industry Insights</h3>
              <p className="text-muted-foreground">
                Discover emerging roles, trending technologies, and future-proof careers in 
                India's rapidly evolving job landscape.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-pink-200 hover:shadow-xl transition-all">
            <CardContent className="pt-6 space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center">
                <Award className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl">Certification Roadmap</h3>
              <p className="text-muted-foreground">
                Navigate certifications valued by Indian employers, from Google Cloud to 
                industry-specific credentials.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-foreground mb-4">
            Your Path to Success in 4 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground">
            From assessment to action in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-white">1</span>
            </div>
            <h3 className="text-xl">Build Your Profile</h3>
            <p className="text-muted-foreground">
              Share your interests, education, strengths, and career preferences
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-white">2</span>
            </div>
            <h3 className="text-xl">Assess Your Skills</h3>
            <p className="text-muted-foreground">
              Rate your proficiency across technical, creative, and soft skills
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-white">3</span>
            </div>
            <h3 className="text-xl">Get Recommendations</h3>
            <p className="text-muted-foreground">
              Receive AI-powered career matches with detailed roadmaps
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-white">4</span>
            </div>
            <h3 className="text-xl">Start Learning</h3>
            <p className="text-muted-foreground">
              Follow personalized learning paths to bridge skill gaps
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl text-foreground">
              Built for India's Future Leaders
            </h2>
            <p className="text-lg text-muted-foreground">
              We understand the unique challenges faced by Indian students in navigating career choices. 
              Our AI-powered platform is designed specifically for the Indian job market.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Regional Job Market Insights:</strong> Salary data and opportunities across 
                  metros, tier-2 cities, and remote roles
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Education-Aware Matching:</strong> Recommendations aligned with Indian 
                  education system (10th, 12th, UG, PG)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Free Government Resources:</strong> Integration with NPTEL, SWAYAM, 
                  and Skill India programs
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Startup & MNC Coverage:</strong> Insights from Indian startups and 
                  global companies hiring in India
                </span>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="pt-6 text-center">
                <Globe className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-3xl text-foreground mb-1">28+</p>
                <p className="text-sm text-muted-foreground">States & Cities Covered</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="pt-6 text-center">
                <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl text-foreground mb-1">500+</p>
                <p className="text-sm text-muted-foreground">Top Companies</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6 text-center">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl text-foreground mb-1">Real-time</p>
                <p className="text-sm text-muted-foreground">Market Updates</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="pt-6 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl text-foreground mb-1">10K+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none text-white">
          <CardContent className="py-16 text-center space-y-6">
            <h2 className="text-4xl text-white">
              Ready to Discover Your Perfect Career?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Join thousands of Indian students who have found their career direction with CareerCompass
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" onClick={onSignUp} className="bg-white text-indigo-700 hover:bg-indigo-50 text-lg px-8">
                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={onSignIn} className="text-white border-white hover:bg-white/10 text-lg px-8">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span>© 2025 CareerCompass. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
