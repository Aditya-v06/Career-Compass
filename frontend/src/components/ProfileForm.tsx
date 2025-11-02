import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { StudentProfile } from '../App';

interface ProfileFormProps {
  profile: StudentProfile | null;
  onSave: (profile: StudentProfile) => void;
  name?: string;
  age?: number;
}

const INTERESTS = [
  'Technology', 'Business', 'Healthcare', 'Education', 'Arts & Design',
  'Engineering', 'Science', 'Finance', 'Marketing', 'Social Work',
  'Media & Entertainment', 'Law', 'Environment', 'Sports', 'Agriculture'
];

const STRENGTHS = [
  'Problem Solving', 'Leadership', 'Communication', 'Creativity', 'Analytical Thinking',
  'Teamwork', 'Adaptability', 'Technical Skills', 'Research', 'Project Management',
  'Critical Thinking', 'Innovation', 'Public Speaking', 'Writing', 'Mathematical Skills'
];

const INDUSTRIES = [
  'Information Technology', 'Finance & Banking', 'Healthcare & Medicine', 
  'Education & EdTech', 'E-commerce', 'Manufacturing', 'Consulting',
  'Media & Entertainment', 'Government & Public Sector', 'Startups',
  'Pharmaceuticals', 'Telecommunications', 'Real Estate', 'Automotive'
];

const EDUCATION_LEVELS = [
  '10th Standard', '12th Standard (Science)', '12th Standard (Commerce)', 
  '12th Standard (Arts)', 'Undergraduate - 1st Year', 'Undergraduate - 2nd Year',
  'Undergraduate - 3rd Year', 'Undergraduate - Final Year', 'Postgraduate',
  'PhD', 'Diploma', 'Professional Course'
];

export default function ProfileForm({ profile, onSave, name, age }: ProfileFormProps) {
  const [formData, setFormData] = useState<StudentProfile>(profile || {
    name: name || '',
    age: age || 18,
    education: '',
    interests: [],
    strengths: [],
    location: '',
    preferredIndustries: []
  });

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Build Your Profile</CardTitle>
        <CardDescription>
          Tell us about yourself so we can provide personalized career recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="15"
                max="35"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="education">Education Level *</Label>
              <Select
                value={formData.education}
                onValueChange={(value) => setFormData({ ...formData, education: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (City) *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Mumbai, Bangalore, Delhi"
                required
              />
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label>Areas of Interest * (Select at least 3)</Label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <Badge
                  key={interest}
                  variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => setFormData({
                    ...formData,
                    interests: toggleArrayItem(formData.interests, interest)
                  })}
                >
                  {interest}
                  {formData.interests.includes(interest) && (
                    <X className="ml-1 w-3 h-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="space-y-3">
            <Label>Your Strengths * (Select at least 3)</Label>
            <div className="flex flex-wrap gap-2">
              {STRENGTHS.map(strength => (
                <Badge
                  key={strength}
                  variant={formData.strengths.includes(strength) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => setFormData({
                    ...formData,
                    strengths: toggleArrayItem(formData.strengths, strength)
                  })}
                >
                  {strength}
                  {formData.strengths.includes(strength) && (
                    <X className="ml-1 w-3 h-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Preferred Industries */}
          <div className="space-y-3">
            <Label>Preferred Industries * (Select at least 2)</Label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map(industry => (
                <Badge
                  key={industry}
                  variant={formData.preferredIndustries.includes(industry) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/90"
                  onClick={() => setFormData({
                    ...formData,
                    preferredIndustries: toggleArrayItem(formData.preferredIndustries, industry)
                  })}
                >
                  {industry}
                  {formData.preferredIndustries.includes(industry) && (
                    <X className="ml-1 w-3 h-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={
              !formData.name || 
              !formData.education || 
              !formData.location ||
              formData.interests.length < 3 ||
              formData.strengths.length < 3 ||
              formData.preferredIndustries.length < 2
            }
          >
            Save Profile & Continue to Skills Assessment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
