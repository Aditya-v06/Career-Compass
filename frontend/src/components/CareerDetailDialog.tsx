import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  TrendingUp, IndianRupee, MapPin, Briefcase, GraduationCap, 
  Lightbulb, Building2, BarChart3, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { SkillRating } from '../App';
import { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 

interface Career {
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

interface CareerDetailDialogProps {
  career: Career;
  skills: SkillRating[];
  onClose: () => void;
}

export default function CareerDetailDialog({ career, skills, onClose }: CareerDetailDialogProps) {
  
  // Calculate skill gaps
  const getSkillMatch = (careerSkill: string): number => {
    // Simplified skill matching logic
    for (const category of skills) {
      for (const skill of category.skills) {
        if (skill.name.toLowerCase().includes(careerSkill.toLowerCase()) || 
            careerSkill.toLowerCase().includes(skill.name.toLowerCase())) {
          return skill.level * 10;
        }
      }
    }
    return 0;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{career.title}</DialogTitle>
          <DialogDescription>{career.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="w-4 h-4" />
                    <CardTitle className="text-sm">Salary Range</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xl">{career.salaryRange}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <CardTitle className="text-sm">Growth Rate</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xl">{career.growthRate}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <CardTitle className="text-sm">Job Openings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xl">{career.jobOpenings}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BarChart3 className="w-4 h-4" />
                    <CardTitle className="text-sm">Work-Life Balance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xl">{career.workLifeBalance}/10</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <CardTitle>Top Locations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {career.locations.map(loc => (
                    <Badge key={loc} variant="secondary">{loc}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <CardTitle>Emerging Trends</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {career.emergingTrends.map(trend => (
                    <li key={trend} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 mt-0.5 text-primary" />
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <CardTitle>Required Education</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {career.requiredEducation.map(edu => (
                    <li key={edu} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Skills Gap Analysis</CardTitle>
                <DialogDescription>
                  Your current proficiency vs. required skills for this role
                </DialogDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {career.keySkills.map(skill => {
                  const currentLevel = getSkillMatch(skill);
                  const isGap = currentLevel < 70;
                  return (
                    <div key={skill} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {isGap ? (
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                          {skill}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {currentLevel}% proficiency
                        </span>
                      </div>
                      <Progress value={currentLevel} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>3-Month Learning Roadmap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">1</div>
                      <div className="w-0.5 h-16 bg-border"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <h4>Month 1: Foundation</h4>
                      <p className="text-sm text-muted-foreground">Build core skills through online courses and certifications</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">Coursera</Badge>
                        <Badge variant="outline">Udemy</Badge>
                        <Badge variant="outline">Free Resources</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">2</div>
                      <div className="w-0.5 h-16 bg-border"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <h4>Month 2: Practice & Projects</h4>
                      <p className="text-sm text-muted-foreground">Apply your skills through hands-on projects</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">Personal Projects</Badge>
                        <Badge variant="outline">Open Source</Badge>
                        <Badge variant="outline">Internships</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">3</div>
                    </div>
                    <div className="flex-1">
                      <h4>Month 3: Portfolio & Network</h4>
                      <p className="text-sm text-muted-foreground">Build your portfolio and connect with professionals</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">LinkedIn</Badge>
                        <Badge variant="outline">GitHub</Badge>
                        <Badge variant="outline">Networking Events</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <CardTitle>Top Hiring Companies in India</CardTitle>
                </div>
                <DialogDescription>
                  Companies actively hiring for this role
                </DialogDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {career.topCompanies.map(company => (
                    <div key={company} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <span>{company}</span>
                        </div>
                        <Badge variant="secondary">Hiring</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Search Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                    <span>Optimize your LinkedIn profile with relevant keywords</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                    <span>Build a strong portfolio showcasing your projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                    <span>Network with professionals through LinkedIn and events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                    <span>Apply through company career pages and job portals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                    <span>Prepare for technical interviews and case studies</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
