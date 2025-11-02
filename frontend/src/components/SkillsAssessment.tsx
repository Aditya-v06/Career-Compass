import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { SkillRating } from '../App';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SkillsAssessmentProps {
  skills: SkillRating[];
  onSave: (skills: SkillRating[]) => void;
}

const SKILL_CATEGORIES = [
  {
    category: 'Technical Skills',
    skills: [
      'Programming/Coding',
      'Data Analysis',
      'Web Development',
      'Mobile Development',
      'Database Management',
      'Cloud Computing',
      'Cybersecurity',
      'UI/UX Design'
    ]
  },
  {
    category: 'Business Skills',
    skills: [
      'Financial Analysis',
      'Business Strategy',
      'Marketing',
      'Sales',
      'Project Management',
      'Operations Management',
      'Entrepreneurship',
      'Market Research'
    ]
  },
  {
    category: 'Communication Skills',
    skills: [
      'Written Communication',
      'Public Speaking',
      'Presentation Skills',
      'Negotiation',
      'Active Listening',
      'Cross-cultural Communication',
      'Professional Writing',
      'Storytelling'
    ]
  },
  {
    category: 'Analytical Skills',
    skills: [
      'Problem Solving',
      'Critical Thinking',
      'Research',
      'Statistical Analysis',
      'Logical Reasoning',
      'Decision Making',
      'Pattern Recognition',
      'Strategic Planning'
    ]
  },
  {
    category: 'Creative Skills',
    skills: [
      'Graphic Design',
      'Content Creation',
      'Creative Writing',
      'Video Editing',
      'Photography',
      'Innovation',
      'Brainstorming',
      'Artistic Expression'
    ]
  }
];

export default function SkillsAssessment({ skills, onSave }: SkillsAssessmentProps) {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [ratings, setRatings] = useState<SkillRating[]>(
    skills.length > 0 ? skills : SKILL_CATEGORIES.map(cat => ({
      category: cat.category,
      skills: cat.skills.map(skill => ({ name: skill, level: 5 }))
    }))
  );

  const updateSkillLevel = (categoryIndex: number, skillIndex: number, level: number) => {
    const newRatings = [...ratings];
    newRatings[categoryIndex].skills[skillIndex].level = level;
    setRatings(newRatings);
  };

  const handleNext = () => {
    if (currentCategory < SKILL_CATEGORIES.length - 1) {
      setCurrentCategory(currentCategory + 1);
    } else {
      onSave(ratings);
    }
  };

  const handlePrevious = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
    }
  };

  const currentCat = SKILL_CATEGORIES[currentCategory];
  const currentRatings = ratings[currentCategory];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Assessment Progress</span>
              <span>{currentCategory + 1} of {SKILL_CATEGORIES.length}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${((currentCategory + 1) / SKILL_CATEGORIES.length) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Category */}
      <Card>
        <CardHeader>
          <CardTitle>{currentCat.category}</CardTitle>
          <CardDescription>
            Rate your proficiency in each skill from 1 (Beginner) to 10 (Expert)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {currentCat.skills.map((skill, skillIndex) => (
            <div key={skill} className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>{skill}</Label>
                <span className="text-sm px-3 py-1 bg-primary/10 rounded-md">
                  {currentRatings.skills[skillIndex].level}/10
                </span>
              </div>
              <Slider
                value={[currentRatings.skills[skillIndex].level]}
                onValueChange={(value) => updateSkillLevel(currentCategory, skillIndex, value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentCategory === 0}
          className="flex-1"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1"
        >
          {currentCategory === SKILL_CATEGORIES.length - 1 ? 'Complete & View Recommendations' : 'Next Category'}
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
