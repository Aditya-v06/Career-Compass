import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, IndianRupee, Clock, MapPin, Briefcase, 
  Target, CheckCircle2, AlertCircle, ArrowRight, Loader2
} from 'lucide-react';
import { StudentProfile, SkillRating, Career } from '../App';
import CareerDetailDialog from './CareerDetailDialog';
import { Skeleton } from './ui/skeleton';

interface CareerRecommendationsProps {
  profile: StudentProfile | null;
  recommendations: Career[];
  isLoading: boolean;
  error: string | null;
  skills: SkillRating[];
}

const LoadingSkeleton = () => (
  <div className="space-y-6 bg-red-500">
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-1"><Skeleton className="h-5 w-20" /><Skeleton className="h-8 w-24" /></div>
          <div className="space-y-1"><Skeleton className="h-5 w-20" /><Skeleton className="h-8 w-24" /></div>
          <div className="space-y-1"><Skeleton className="h-5 w-20" /><Skeleton className="h-8 w-24" /></div>
          <div className="space-y-1"><Skeleton className="h-5 w-20" /><Skeleton className="h-8 w-24" /></div>
        </div>
        <Skeleton className="h-12 w-64" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-5 w-80" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i}><CardContent className="pt-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default function CareerRecommendations({ profile, recommendations, isLoading, error, skills }: CareerRecommendationsProps) {
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  console.log('isLoading:', isLoading);

  if (isLoading) {
    return <div className="w-full h-96 bg-red-500 text-black text-4xl flex items-center justify-center">Generating Your Career Recommendations... <Loader2 className="ml-4 w-8 h-8 animate-spin" /></div>;
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <CardTitle className="text-destructive">An Error Occurred</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-destructive/80">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            There was a problem generating your career recommendations. Please try again later or check your API key configuration.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!profile || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Career Recommendations</CardTitle>
          <CardDescription>Complete your profile and skills assessment to get personalized, AI-powered career recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4" />
            <p>Your future career path awaits!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const topCareer = recommendations[0];

  return (
    <div className="space-y-6">
      {topCareer && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <Badge className="bg-green-600">Best Match</Badge>
            </div>
            <CardTitle className="text-2xl">{topCareer.title}</CardTitle>
            <CardDescription className="text-foreground">{topCareer.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-1"><p className="text-sm text-muted-foreground">Match Score</p><p className="text-xl">{topCareer.matchScore}%</p></div>
              <div className="space-y-1"><p className="text-sm text-muted-foreground">Salary Range</p><p className="text-xl">{topCareer.salaryRange}</p></div>
              <div className="space-y-1"><p className="text-sm text-muted-foreground">Growth Rate</p><p className="text-xl">{topCareer.growthRate}</p></div>
              <div className="space-y-1"><p className="text-sm text-muted-foreground">Openings</p><p className="text-xl">{topCareer.jobOpenings}</p></div>
            </div>
            <Button onClick={() => setSelectedCareer(topCareer)} size="lg">
              View Detailed Roadmap <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Career Recommendations</CardTitle>
          <CardDescription>Based on your profile, interests, and skills assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((career) => (
              <Card key={career.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3>{career.title}</h3>
                          <Badge variant="outline">{career.matchScore}% Match</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{career.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-sm text-muted-foreground mr-2">Match Score:</span>
                      <Progress value={career.matchScore} className="flex-1" />
                      <span className="text-sm ml-2">{career.matchScore}%</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm"><IndianRupee className="w-4 h-4 text-muted-foreground" /><span>{career.salaryRange}</span></div>
                      <div className="flex items-center gap-2 text-sm"><TrendingUp className="w-4 h-4 text-muted-foreground" /><span>{career.growthRate}</span></div>
                      <div className="flex items-center gap-2 text-sm"><Briefcase className="w-4 h-4 text-muted-foreground" /><span>{career.jobOpenings}</span></div>
                      <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-muted-foreground" /><span>{career.locations[0]}</span></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {career.keySkills.slice(0, 4).map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                      {career.keySkills.length > 4 && (
                        <Badge variant="secondary">+{career.keySkills.length - 4} more</Badge>
                      )}
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setSelectedCareer(career)}>
                      View Full Details & Roadmap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCareer && (
        <CareerDetailDialog 
          career={selectedCareer} 
          skills={skills}
          onClose={() => setSelectedCareer(null)} 
        />
      )}
    </div>
  );
}