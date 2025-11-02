import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Target, TrendingUp, Users, Briefcase, Award, BookOpen } from 'lucide-react';
import { StudentProfile, SkillRating } from '../App';

interface DashboardProps {
  profile: StudentProfile | null;
  skills: SkillRating[];
  recommendations: Career[];
  onGetStarted: () => void;
  onExploreCareers: () => void;
}

export default function Dashboard({ profile, skills, recommendations, onGetStarted, onExploreCareers }: DashboardProps) {
  if (!profile) {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none text-white">
          <CardHeader className="pb-8 pt-12">
            <CardTitle className="text-3xl text-white">Welcome to CareerCompass</CardTitle>
            <CardDescription className="text-indigo-100 text-lg mt-2">
              Your personalized AI-powered career advisor designed specifically for Indian students
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-12">
            <p className="text-indigo-50 mb-6">
              Navigate your career journey with confidence. Get personalized recommendations based on your unique skills, 
              interests, and aspirations. Discover emerging opportunities in India's evolving job market.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-indigo-700 hover:bg-indigo-50"
              onClick={onGetStarted}
            >
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Personalized Career Paths</CardTitle>
              <CardDescription>
                Discover careers tailored to your unique interests, skills, and educational background
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Skills Gap Analysis</CardTitle>
              <CardDescription>
                Identify the exact skills you need to develop to achieve your career goals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>
                Stay updated with emerging roles and in-demand skills in India's job market
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Learning Roadmap</CardTitle>
              <CardDescription>
                Get curated learning paths with courses, certifications, and resources
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Industry Recognition</CardTitle>
              <CardDescription>
                Learn about certifications and credentials valued by Indian employers
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <CardTitle>Career Guidance</CardTitle>
              <CardDescription>
                Access insights on salary trends, growth potential, and work-life balance
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const totalSkills = skills.reduce((acc, cat) => acc + cat.skills.length, 0);
  const averageLevel = skills.length > 0 
    ? skills.reduce((acc, cat) => 
        acc + cat.skills.reduce((sum, skill) => sum + skill.level, 0), 0
      ) / totalSkills 
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Back */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Welcome Back, {profile.name}!</CardTitle>
          <CardDescription className="text-indigo-100">
            Continue your career exploration journey
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Skills Assessed</CardDescription>
            <CardTitle className="text-3xl">{totalSkills}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Average Skill Level</CardDescription>
            <CardTitle className="text-3xl">{averageLevel.toFixed(1)}/10</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Career Matches</CardDescription>
            <CardTitle className="text-3xl">{recommendations.length>0 ? recommendations.length : profile.preferredIndustries.length * 3}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Your Journey</CardTitle>
          <CardDescription>Complete your profile to get better recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!skills.length && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p>Assess Your Skills</p>
                <p className="text-sm text-muted-foreground">Help us understand your current skill level</p>
              </div>
              <Button onClick={() => {}}>Start</Button>
            </div>
          )}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p>Explore Career Paths</p>
              <p className="text-sm text-muted-foreground">View personalized career recommendations</p>
            </div>
            <Button onClick={onExploreCareers}>Explore</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
