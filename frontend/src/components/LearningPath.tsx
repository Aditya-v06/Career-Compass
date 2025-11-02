import { useState, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Award, Video, Briefcase, Bot, FileText, BookOpen, Send, ArrowLeft, Search, Plus, Minus } from 'lucide-react';
import { StudentProfile, SkillRating } from '../App';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface InterviewQA {
  questions: string[];
  answers: string[];
}

interface InterviewSummary {
  tips: string;
}

interface LearningPathProps {
  profile: StudentProfile | null;
  skills: SkillRating[];
}

const API_URL = import.meta.env.VITE_API_URL

const formatMessageContent = (text: string): ReactNode => {
  const finalResult: ReactNode[] = [];
  let currentLastIndex = 0;

  const combinedRegex = /(\[([^]]+)]\((https?:\/\/[^\s<>\\[\\]{}()"']+\b)\)\**)|(https?:\/\/[^\s<>\\[\\]{}()"']+\b)/g;

  let match;
  while ((match = combinedRegex.exec(text)) !== null) {
    const startIndex = match.index;
    const endIndex = combinedRegex.lastIndex;

    if (startIndex > currentLastIndex) {
      finalResult.push(text.substring(currentLastIndex, startIndex).replace(/[#*]/g, ''));
    }

    if (match[1]) {
      const linkText = match[2];
      const url = match[3];
      finalResult.push(
        <a
          key={startIndex}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {linkText.replace(/[#*]/g, '')}
        </a>
      );
    } else if (match[4]) {
      const url = match[4];
      finalResult.push(
        <a
          key={startIndex}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {url}
        </a>
      );
    }

    currentLastIndex = endIndex;
  }

  if (currentLastIndex < text.length) {
    finalResult.push(text.substring(currentLastIndex).replace(/[#*]/g, ''));
  }

  return finalResult;
};

export default function LearningPath({ profile, skills }: LearningPathProps) {
  const [activeView, setActiveView] = useState('main'); // main, chatbot, certifications, joblistings, mockInterview, resumeBuilder
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I am your learning assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);
  const [jobListings, setJobListings] = useState<string[]>([]);
  const [interviewQA, setInterviewQA] = useState<InterviewQA | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean[]>([]);
  const [interviewSummary, setInterviewSummary] = useState<InterviewSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>({
    experiences: [],
    education: [],
    projects: [],
    skills: '',
    certifications: '',
    languages: '',
    hobbies: '',
  });
  const [resumeStep, setResumeStep] = useState(0);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const messageToSend = input;
    const userMessage: Message = { text: messageToSend, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsBotLoading(true);

    try {
      //const response = await fetch('http://127.0.0.1:5001/api/chat', {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const formattedResponse = data.response.replace(/\. /g, '.\n');
      const botMessage: Message = { text: formattedResponse, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { text: 'Sorry, something went wrong. Please try again.', sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsBotLoading(false);
    }
  };

  const handleGetCertifications = async () => {
    if (role.trim() === '') return;
    setIsLoading(true);
    setError(null);
    setCertifications([]);

    try {
      //const response = await fetch('http://127.0.0.1:5001/api/certifications', {
      const response = await fetch(`${API_URL}/api/certifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ career_title: role, skills }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch certifications');
      }

      const data = await response.json();
      const parsedCerts = data.certifications.split(/\d+\. /).filter(Boolean).map((s: string) => s.trim());
      setCertifications(parsedCerts);

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetJobListings = async () => {
    if (role.trim() === '') return;
    setIsLoading(true);
    setError(null);
    setJobListings([]);

    try {
      //const response = await fetch('http://127.0.0.1:5001/api/job-listings', {
      const response = await fetch(`${API_URL}/api/job-listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, location }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch job listings');
      }

      const data = await response.json();
      const parsedJobs = data.job_listings.split(/\d+\. /).filter(Boolean).map((s: string) => s.trim());
      setJobListings(parsedJobs);

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInterview = async () => {
    if (role.trim() === '') return;
    setIsLoading(true);
    setError(null);
    setInterviewQA(null);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setUserAnswers([]);
    setShowCorrectAnswer([]);

    try {
      //const response = await fetch('http://127.0.0.1:5001/api/interview-questions', {
      const response = await fetch(`${API_URL}/api/interview-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch interview questions');
      }

      const data: InterviewQA = await response.json();
      setInterviewQA(data);
      setUserAnswers(new Array(data.questions.length).fill(''));
      setShowCorrectAnswer(new Array(data.questions.length).fill(false));

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = userAnswer;
    setUserAnswers(newAnswers);
    setUserAnswer(userAnswers[currentQuestionIndex + 1] || '');
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handlePreviousQuestion = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = userAnswer;
    setUserAnswers(newAnswers);
    setUserAnswer(userAnswers[currentQuestionIndex - 1] || '');
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const handleGenerateInterviewSummary = async () => {
    setIsSummaryLoading(true);
    try {
      //const response = await fetch('http://127.0.0.1:5001/api/interview-summary', {
      const response = await fetch(`${API_URL}/api/interview-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch interview summary');
      }

      const data: InterviewSummary = await response.json();
      setInterviewSummary(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleResumeNextStep = () => {
    setResumeStep(resumeStep + 1);
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    const work_experience_text = resumeData.experiences.map((exp: any) => `${exp.job_title} at ${exp.company}: ${exp.achievements.join(', ')}`).join('\n');
    try {
      //const response = await fetch('http://127.0.0.1:5001/api/resume-builder', {
      const response = await fetch(`${API_URL}/api/resume-builder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step: 'summary', work_experience_text }),
      });
      const data = await response.json();
      setResumeData({ ...resumeData, summary: data.summary });
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };

  const handleGenerateHtml = async () => {
    setIsLoading(true);
    const dataToSend = {
      ...resumeData,
      skills: resumeData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
      certifications: resumeData.certifications.split(',').map((s: string) => s.trim()).filter(Boolean),
      languages: resumeData.languages.split(',').map((s: string) => s.trim()).filter(Boolean),
      hobbies: resumeData.hobbies.split(',').map((s: string) => s.trim()).filter(Boolean),
    };
    try {
      //const response = await fetch('http://127.0.0.1:5001/api/resume-builder', {
      const response = await fetch(`${API_URL}/api/resume-builder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step: 'generate-html', resume_data: dataToSend }),
      });
      const data = await response.json();
      setResumeData({ ...resumeData, html: data.html });
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };

  const features = [
    {
      title: "Certifications",
      icon: <Award className="w-8 h-8 text-blue-600" />,
      description: "Find top certifications to boost your profile.",
      onClick: () => setActiveView('certifications'),
    },
    {
      title: "Mock Interview",
      icon: <Video className="w-8 h-8 text-green-600" />,
      description: "Practice your interview skills with AI.",
      onClick: () => setActiveView('mockInterview'),
    },
    {
      title: "Job Listings",
      icon: <Briefcase className="w-8 h-8 text-indigo-600" />,
      description: "Discover job openings tailored to your profile.",
      onClick: () => setActiveView('joblistings'),
    },
    {
      title: "ElevAIte",
      icon: <Bot className="w-8 h-8 text-purple-600" />,
      description: "Get AI-powered feedback on your career path.",
      onClick: () => setActiveView('chatbot'),
    },
    {
      title: "Resume Builder",
      icon: <FileText className="w-8 h-8 text-orange-600" />,
      description: "Create a professional resume in minutes.",
      onClick: () => setActiveView('resumeBuilder'),
    },
  ];

  const renderMainView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={feature.onClick}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              {feature.icon}
            </div>
            <div>
              <CardTitle>{feature.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderChatbotView = () => (
    <div className="flex items-center justify-center min-h-[500px] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center relative">
          <Button variant="ghost" className="absolute top-4 left-4" onClick={() => setActiveView('main')}> 
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle>Learning Assistant</CardTitle>
          <CardDescription>
            Chat with our AI to get learning recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 h-96 overflow-y-auto p-4 border rounded-md">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${message.sender === 'user' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                  {message.sender === 'user' ? 'You' : <BookOpen className="w-6 h-6 text-purple-600" />}
                </div>
                <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-black' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-line' }}>{formatMessageContent(message.text)}</p>
                </div>
              </div>
            ))}
            {isBotLoading && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-purple-100">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <p className="text-sm italic">Typing...</p>
                </div>
              </div>
            )}
          </div>
          
          
          <div className="flex items-center gap-2 mt-4">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCertificationsView = () => (
    <div className="flex items-center justify-center min-h-[500px] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center relative">
          <Button variant="ghost" className="absolute top-4 left-4" onClick={() => setActiveView('main')}> 
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle>Find Certifications</CardTitle>
          <CardDescription>
            Enter a job role to find recommended certifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              placeholder="e.g., Software Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGetCertifications()}
            />
            <Button onClick={handleGetCertifications} disabled={isLoading}>
              {isLoading ? "Searching..." : <><Search className="w-4 h-4 mr-2" /> Search</>}</Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {certifications.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold">Recommended Certifications for {role}</h3>
              <ul className="list-disc pl-5 space-y-2">
                {certifications.map((cert, index) => {
                  const match = cert.match(/(.*) \((https?:\/\/.*)\)/);
                  if (match) {
                    const text = match[1];
                    const url = match[2];
                    return (
                      <li key={index}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {text}
                        </a>
                      </li>
                    );
                  }
                  return <li key={index}>{cert}</li>;
                })}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderJobListingsView = () => (
    <div className="flex items-center justify-center min-h-[500px] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center relative">
          <Button variant="ghost" className="absolute top-4 left-4" onClick={() => setActiveView('main')}> 
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle>Find Job Listings</CardTitle>
          <CardDescription>
            Enter a role and location to find job openings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="e.g., Software Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <Input
              placeholder="e.g., Bangalore"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGetJobListings()}
            />
          </div>
          <Button onClick={handleGetJobListings} disabled={isLoading} className="w-full mt-4">
            {isLoading ? "Searching..." : <><Search className="w-4 h-4 mr-2" /> Search for Jobs</>}</Button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {jobListings.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold">Job Search Results</h3>
              <ul className="list-disc pl-5 space-y-2">
                {jobListings.map((job, index) => {
                  const match = job.match(/(.*) \((https?:\/\/.*)\)/);
                  if (match) {
                    const text = match[1];
                    const url = match[2];
                    return (
                      <li key={index}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {text}
                        </a>
                      </li>
                    );
                  }
                  return <li key={index}>{job}</li>;
                })}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderMockInterviewView = () => (
    <div className="flex items-center justify-center min-h-[500px] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center relative">
          <Button variant="ghost" className="absolute top-4 left-4" onClick={() => setActiveView('main')}> 
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle>Mock Interview</CardTitle>
          <CardDescription>
            Practice for your next big interview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!interviewQA ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter job role..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleStartInterview()}
              />
              <Button onClick={handleStartInterview} disabled={isLoading}>
                {isLoading ? "Starting..." : "Start Interview"}
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="font-semibold text-lg">Question {currentQuestionIndex + 1} of {interviewQA.questions.length}</p>
                <p>{interviewQA.questions[currentQuestionIndex]}</p>
              </div>
              <Textarea
                placeholder="Your answer..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={5}
              />
              <div className="mt-4 flex justify-end gap-2">
                {!showCorrectAnswer[currentQuestionIndex] ? (
                  <Button onClick={() => {
                    const newShowCorrectAnswer = [...showCorrectAnswer];
                    newShowCorrectAnswer[currentQuestionIndex] = true;
                    setShowCorrectAnswer(newShowCorrectAnswer);
                    const newAnswers = [...userAnswers];
                    newAnswers[currentQuestionIndex] = userAnswer;
                    setUserAnswers(newAnswers);
                  }}>Submit</Button>
                ) : (
                  <>
                    <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} variant="outline">
                      Previous Question
                    </Button>
                    <Button onClick={handleNextQuestion} disabled={currentQuestionIndex >= interviewQA.questions.length - 1}> 
                      Next Question
                    </Button>
                    {currentQuestionIndex === interviewQA.questions.length - 1 && (
                      <Button onClick={handleGenerateInterviewSummary}>Finish</Button>
                    )}
                  </>
                )}
              </div>
              {showCorrectAnswer[currentQuestionIndex] && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="font-semibold">Your Answer:</p>
                  <p className="text-sm mb-4">{userAnswers[currentQuestionIndex]}</p>
                  <p className="font-semibold">Suggested Answer:</p>
                  <p className="text-sm">{interviewQA.answers[currentQuestionIndex]}</p>
                </div>
              )}
            </div>
          )}
          {isSummaryLoading && <p>Loading summary...</p>}
          {interviewSummary && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Interview Summary</h3>
              <div>
                <h4 className="font-semibold">Tips to clear the interview:</h4>
                <p>{interviewSummary.tips}</p>
              </div>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );

  const renderResumeBuilderView = () => {
    const steps = [
      { name: 'Contact Info', fields: ['name', 'phone', 'email', 'linkedin', 'portfolio', 'address'] },
      { name: 'Work Experience', fields: ['experiences'] },
      { name: 'Professional Summary', fields: ['summary'] },
      { name: 'Education', fields: ['education'] },
      { name: 'Skills', fields: ['skills'] },
      { name: 'Certifications', fields: ['certifications'] },
      { name: 'Projects', fields: ['projects'] },
      { name: 'Languages', fields: ['languages'] },
      { name: 'Hobbies', fields: ['hobbies'] },
    ];

    const currentStep = steps[resumeStep];

    const handleResumeInputChange = (field: string, value: any) => {
      setResumeData({ ...resumeData, [field]: value });
    };

    const handleArrayInputChange = (field: string, itemIndex: number, itemField: string, value: any) => {
      const updatedArray = [...resumeData[field]];
      updatedArray[itemIndex] = { ...updatedArray[itemIndex], [itemField]: value };
      setResumeData({ ...resumeData, [field]: updatedArray });
    };

    const handleAddArrayItem = (field: string, template: any) => {
      setResumeData({ ...resumeData, [field]: [...resumeData[field], template] });
    };

    const handleRemoveArrayItem = (field: string, itemIndex: number) => {
      const updatedArray = [...resumeData[field]];
      updatedArray.splice(itemIndex, 1);
      setResumeData({ ...resumeData, [field]: updatedArray });
    };

    const renderContactInfo = () => (
      <div className="space-y-4">
        <label className="font-semibold">Full Name</label>
        <Input type="text" value={resumeData.name || ''} onChange={(e) => handleResumeInputChange('name', e.target.value)} />
        <label className="font-semibold">Phone</label>
        <Input type="text" value={resumeData.phone || ''} onChange={(e) => handleResumeInputChange('phone', e.target.value)} />
        <label className="font-semibold">Email</label>
        <Input type="text" value={resumeData.email || ''} onChange={(e) => handleResumeInputChange('email', e.target.value)} />
        <label className="font-semibold">LinkedIn (Optional)</label>
        <Input type="text" value={resumeData.linkedin || ''} onChange={(e) => handleResumeInputChange('linkedin', e.target.value)} />
        <label className="font-semibold">Portfolio/Website (Optional)</label>
        <Input type="text" value={resumeData.portfolio || ''} onChange={(e) => handleResumeInputChange('portfolio', e.target.value)} />
        <label className="font-semibold">Address (Optional)</label>
        <Input type="text" value={resumeData.address || ''} onChange={(e) => handleResumeInputChange('address', e.target.value)} />
      </div>
    );

    const renderWorkExperience = () => (
      <div className="space-y-4">
        {(resumeData.experiences || []).map((exp: any, index: number) => (
          <Card key={index} className="p-4">
            <div className="flex justify-end mb-2">
              <Button variant="destructive" size="sm" onClick={() => handleRemoveArrayItem('experiences', index)}><Minus className="w-4 h-4" /></Button>
            </div>
            <label className="font-semibold">Job Title</label>
            <Input type="text" value={exp.job_title || ''} onChange={(e) => handleArrayInputChange('experiences', index, 'job_title', e.target.value)} />
            <label className="font-semibold">Company</label>
            <Input type="text" value={exp.company || ''} onChange={(e) => handleArrayInputChange('experiences', index, 'company', e.target.value)} />
            <label className="font-semibold">Location</label>
            <Input type="text" value={exp.location || ''} onChange={(e) => handleArrayInputChange('experiences', index, 'location', e.target.value)} />
            <label className="font-semibold">Start Date (MM/YYYY)</label>
            <Input type="text" value={exp.start_date || ''} onChange={(e) => handleArrayInputChange('experiences', index, 'start_date', e.target.value)} />
            <label className="font-semibold">End Date (MM/YYYY or Present)</label>
            <Input type="text" value={exp.end_date || ''} onChange={(e) => handleArrayInputChange('experiences', index, 'end_date', e.target.value)} />
            <label className="font-semibold">Achievements (comma-separated)</label>
            <Textarea value={(exp.achievements || []).join(', ')} onChange={(e) => handleArrayInputChange('experiences', index, 'achievements', e.target.value.split(',').map((s: string) => s.trim()))} />
          </Card>
        ))}
        <Button onClick={() => handleAddArrayItem('experiences', { job_title: '', company: '', location: '', start_date: '', end_date: '', achievements: [] })}><Plus className="w-4 h-4 mr-2" /> Add Experience</Button>
      </div>
    );

    const renderProfessionalSummary = () => (
      <div className="space-y-4">
        <label className="font-semibold">Professional Summary</label>
        <Textarea value={resumeData.summary || ''} onChange={(e) => handleResumeInputChange('summary', e.target.value)} rows={5} />
      </div>
    );

    const renderEducation = () => (
      <div className="space-y-4">
        {(resumeData.education || []).map((edu: any, index: number) => (
          <Card key={index} className="p-4">
            <div className="flex justify-end mb-2">
              <Button variant="destructive" size="sm" onClick={() => handleRemoveArrayItem('education', index)}><Minus className="w-4 h-4" /></Button>
            </div>
            <label className="font-semibold">Degree</label>
            <Input type="text" value={edu.degree || ''} onChange={(e) => handleArrayInputChange('education', index, 'degree', e.target.value)} />
            <label className="font-semibold">Institution</label>
            <Input type="text" value={edu.institution || ''} onChange={(e) => handleArrayInputChange('education', index, 'institution', e.target.value)} />
            <label className="font-semibold">Location</label>
            <Input type="text" value={edu.location || ''} onChange={(e) => handleArrayInputChange('education', index, 'location', e.target.value)} />
            <label className="font-semibold">Graduation Date (MM/YYYY)</label>
            <Input type="text" value={edu.graduation_date || ''} onChange={(e) => handleArrayInputChange('education', index, 'graduation_date', e.target.value)} />
            <label className="font-semibold">Honors/Awards (Optional)</label>
            <Input type="text" value={edu.honors || ''} onChange={(e) => handleArrayInputChange('education', index, 'honors', e.target.value)} />
          </Card>
        ))}
        <Button onClick={() => handleAddArrayItem('education', { degree: '', institution: '', location: '', graduation_date: '', honors: '' })}><Plus className="w-4 h-4 mr-2" /> Add Education</Button>
      </div>
    );
    const renderSkills = () => (
      <div className="space-y-4">
        <label className="font-semibold">Skills (comma-separated)</label>
        <Textarea value={resumeData.skills || ''} onChange={(e) => handleResumeInputChange('skills', e.target.value)} rows={3} />
      </div>
    );
    const renderCertifications = () => (
      <div className="space-y-4">
        <label className="font-semibold">Certifications (comma-separated)</label>
        <Textarea value={resumeData.certifications || ''} onChange={(e) => handleResumeInputChange('certifications', e.target.value)}
   rows={3} />     
      </div>
    );  

    const renderProjects = () => (
      <div className="space-y-4">
        {(resumeData.projects || []).map((proj: any, index: number) => (
          <Card key={index} className="p-4">
            <div className="flex justify-end mb-2">
              <Button variant="destructive" size="sm" onClick={() => handleRemoveArrayItem('projects', index)}><Minus className="w-4 h-4" /></Button>
            </div>
            <label className="font-semibold">Project Title</label>
            <Input type="text" value={proj.title || ''} onChange={(e) => handleArrayInputChange('projects', index, 'title', e.target.value)} />
            <label className="font-semibold">Description</label>
            <Textarea value={proj.description || ''} onChange={(e) => handleArrayInputChange('projects', index, 'description', e.target.value)} rows={3} />
            <label className="font-semibold">Technologies Used (comma-separated)</label>
            <Input type="text" value={proj.technologies || ''} onChange={(e) => handleArrayInputChange('projects', index, 'technologies', e.target.value)} />
            <label className="font-semibold">Your Role</label>
            <Input type="text" value={proj.role || ''} onChange={(e) => handleArrayInputChange('projects', index, 'role', e.target.value)} />
          </Card>
        ))}
        <Button onClick={() => handleAddArrayItem('projects', { title: '', description: '', technologies: '', role: '' })}><Plus className="w-4 h-4 mr-2" /> Add Project</Button>
      </div>
    );


    const renderLanguages = () => (
      <div className="space-y-4">
        <label className="font-semibold">Languages (comma-separated)</label>
        <Input type="text" value={resumeData.languages || ''} onChange={(e) => handleResumeInputChange('languages', e.target.value)} />
      </div>
    );

    const renderHobbies = () => (
      <div className="space-y-4">
        <label className="font-semibold">Hobbies and Interests (comma-separated)</label>
        <Input type="text" value={resumeData.hobbies || ''} onChange={(e) => handleResumeInputChange('hobbies', e.target.value)} />
      </div>
    );

    const renderCurrentStepContent = () => {
      switch (currentStep.name) {
        case 'Contact Info':
          return renderContactInfo();
        case 'Work Experience':
          return renderWorkExperience();
        case 'Professional Summary':
          return renderProfessionalSummary();
        case 'Education':
          return renderEducation();
        case 'Skills':
          return renderSkills();
        case 'Certifications':
          return renderCertifications();
        case 'Projects':
          return renderProjects();
        case 'Languages':
          return renderLanguages();
        case 'Hobbies':
          return renderHobbies();
        default:
          return null;
      }
    };

    return (
      <div className="flex items-center justify-center min-h-[500px] p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center relative">
            <Button variant="ghost" className="absolute top-4 left-4" onClick={() => resumeStep > 0 ? setResumeStep(resumeStep - 1) : setActiveView('main')}> 
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle>Resume Builder</CardTitle>
            <CardDescription>{currentStep.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {renderCurrentStepContent()}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              {resumeStep < steps.length - 1 ? (
                <Button onClick={handleResumeNextStep}>Next</Button>
              ) : (
                <div>
                  <Button onClick={handleGenerateHtml} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Preview Resume'}
                  </Button>
                  <Button onClick={() => window.print()} className="ml-2">
                    Print to PDF
                  </Button>
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            {resumeData.html && (
              <div id="resume-preview" className="mt-6 p-4 border rounded-lg">
                <h3 className="font-semibold mb-4">Resume Preview</h3>
                <div dangerouslySetInnerHTML={{ __html: resumeData.html }} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };
  const renderContent = () => {
    switch (activeView) {
      case 'chatbot':
        return renderChatbotView();
      case 'certifications':
        return renderCertificationsView();
      case 'joblistings':
        return renderJobListingsView();
      case 'mockInterview':
        return renderMockInterviewView();
      case 'resumeBuilder':
        return renderResumeBuilderView();
      default:
        return renderMainView();
    }
  };

  return (
    <div className="space-y-8">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #resume-preview, #resume-preview * {
              visibility: visible;
            }
            #resume-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
      <div className="text-center">
        <h1 className="text-3xl font-bold">NextStep HUB</h1>
        <p className="text-muted-foreground">Your one-stop-shop for career advancement.</p>
      </div>
      {renderContent()}
    </div>
  );
}
