import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { LayoutDashboard, User, Target, TrendingUp, BookOpen, LogOut } from 'lucide-react';
import { Button } from './components/ui/button';
import Homepage from './components/Homepage';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import Dashboard from './components/Dashboard';
import ProfileForm from './components/ProfileForm';
import SkillsAssessment from './components/SkillsAssessment';
import CareerRecommendations from './components/CareerRecommendations';
import LearningPath from './components/LearningPath';

const API_URL = import.meta.env.VITE_API_URL

export interface StudentProfile {
  name: string;
  age: number;
  education: string;
  interests: string[];
  strengths: string[];
  location: string;
  preferredIndustries: string[];
}

export interface SkillRating {
  category: string;
  skills: { name: string; level: number }[];
}

// This interface must match the JSON structure from the Python backend
export interface Career {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  industry: string;
  salaryRange: string;
  growthRate: string;
  locations: string[];
  keySkills: string[];
  requiredEducation: string[];
  emergingTrends: string[];
  topCompanies: string[];
  workLifeBalance: number;
  jobOpenings: string;
}

type AuthView = 'homepage' | 'signin' | 'signup' | 'dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<AuthView>('homepage');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState<number | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [skills, setSkills] = useState<SkillRating[]>([]);
  const [recommendations, setRecommendations] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  console.log(activeTab);

  const handleSignIn = (email: string, password: string) => {
    console.log('Sign in:', { email, password });
    setUserEmail(email);
    setUserName(email.split('@')[0]);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
    setActiveTab('dashboard');
  };

  const handleSignUp = (username: string, age: number, email: string, password: string) => {
    console.log('Sign up:', { username, age, email, password });
    setUserEmail(email);
    setUserName(username);
    setUserAge(age);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
    setActiveTab('profile');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('homepage');
    setUserEmail('');
    setUserName('');
    setUserAge(null);
    setProfile(null);
    setSkills([]);
    setRecommendations([]);
    setIsLoading(false);
    setError(null);
    setActiveTab('dashboard');
  };

  const handleSkillsSave = async (newSkills: SkillRating[]) => {
    setSkills(newSkills);
    setIsLoading(true);
    setError(null);
    setActiveTab('careers'); // Switch tab immediately to show loading state
    
    try {
      //const response = await fetch('http://127.0.0.1:5001/api/recommendations', {
      const response = await fetch(`${API_URL}/api/recommendations` ,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills: newSkills, profile }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch recommendations');
      }

      const data: Career[] = await response.json();
      setRecommendations(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentView === 'homepage') {
    return <Homepage onSignIn={() => setCurrentView('signin')} onSignUp={() => setCurrentView('signup')} />;
  }

  if (currentView === 'signin') {
    return <SignInForm onSignIn={handleSignIn} onBack={() => setCurrentView('homepage')} onSwitchToSignUp={() => setCurrentView('signup')} />;
  }

  if (currentView === 'signup') {
    return <SignUpForm onSignUp={handleSignUp} onBack={() => setCurrentView('homepage')} onSwitchToSignIn={() => setCurrentView('signin')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-foreground">CareerCompass</h1>
                <p className="text-sm text-muted-foreground">Your Personalized Career Advisor</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {profile && (
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-foreground">{profile.name}</p>
                  <p className="text-xs text-muted-foreground">{profile.education}</p>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard" style={{backgroundColor: activeTab === 'dashboard' ? 'white' : ''}} className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /><span className="hidden sm:inline">Dashboard</span></TabsTrigger>
            <TabsTrigger value="profile" style={{backgroundColor: activeTab === 'profile' ? 'white' : ''}} className="flex items-center gap-2"><User className="w-4 h-4" /><span className="hidden sm:inline">Profile</span></TabsTrigger>
            <TabsTrigger value="skills" style={{backgroundColor: activeTab === 'skills' ? 'white' : ''}} className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /><span className="hidden sm:inline">Skills</span></TabsTrigger>
            <TabsTrigger value="careers" style={{backgroundColor: activeTab === 'careers' ? 'white' : ''}} className="flex items-center gap-2"><Target className="w-4 h-4" /><span className="hidden sm:inline">Careers</span></TabsTrigger>
            <TabsTrigger value="learning" style={{backgroundColor: activeTab === 'learning' ? 'white' : ''}} className="flex items-center gap-2"><BookOpen className="w-4 h-4" /><span className="hidden sm:inline">NextStep HUB</span></TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard"><Dashboard profile={profile} skills={skills} recommendations={recommendations} onGetStarted={() => setActiveTab('profile')} onExploreCareers={() => setActiveTab('careers')} /></TabsContent>
          <TabsContent value="profile"><ProfileForm profile={profile} onSave={(newProfile) => { setProfile(newProfile); setActiveTab('skills'); }} name={userName} age={userAge} /></TabsContent>
          <TabsContent value="skills"><SkillsAssessment skills={skills} onSave={handleSkillsSave} /></TabsContent>
          <TabsContent value="careers"><CareerRecommendations profile={profile} recommendations={recommendations} isLoading={isLoading} error={error} skills={skills} /></TabsContent>
          <TabsContent value="learning"><LearningPath profile={profile} skills={skills} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}