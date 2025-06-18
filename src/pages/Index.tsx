
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Target, TrendingUp, Settings, LogOut, User, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '@/components/auth/AuthModal';
import ProfileSetup from '@/components/profile/ProfileSetup';
import SettingsModal from '@/components/settings/SettingsModal';
import SubjectForm from '@/components/SubjectForm';
import SubjectsList from '@/components/SubjectsList';
import TimeAllocationForm from '@/components/TimeAllocationForm';
import StudyCalendar from '@/components/StudyCalendar';
import ProgressSummary from '@/components/ProgressSummary';
import { StudySession } from '@/types/studyPlanner';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('studysavvy_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      if (!parsedUser.profileComplete) {
        setShowProfileSetup(true);
      }
    }

    const savedSubjects = localStorage.getItem('studysavvy_subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }

    const savedSessions = localStorage.getItem('studysavvy_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('studysavvy_user');
    localStorage.removeItem('studysavvy_subjects');
    localStorage.removeItem('studysavvy_sessions');
    setUser(null);
    setSubjects([]);
    setSessions([]);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of StudySavvy."
    });
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setShowAuthModal(false);
    if (!userData.profileComplete) {
      setShowProfileSetup(true);
    }
    toast({
      title: "Welcome to StudySavvy!",
      description: `Hello ${userData.name}, let's start your study journey.`
    });
  };

  const handleProfileComplete = (profileData: any) => {
    setUser(profileData);
    setShowProfileSetup(false);
    toast({
      title: "Profile completed!",
      description: "Your profile has been set up successfully."
    });
  };

  const handleSubjectAdded = (subject: any) => {
    const updatedSubjects = [...subjects, { ...subject, id: Date.now().toString() }];
    setSubjects(updatedSubjects);
    localStorage.setItem('studysavvy_subjects', JSON.stringify(updatedSubjects));
    setShowSubjectForm(false);
    toast({
      title: "Subject added!",
      description: `${subject.name} has been added to your study plan.`
    });
  };

  const handleRemoveSubject = (id: string) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    setSubjects(updatedSubjects);
    localStorage.setItem('studysavvy_subjects', JSON.stringify(updatedSubjects));
    
    // Also remove related sessions
    const updatedSessions = sessions.filter(session => session.subjectId !== id);
    setSessions(updatedSessions);
    localStorage.setItem('studysavvy_sessions', JSON.stringify(updatedSessions));
    
    toast({
      title: "Subject removed!",
      description: "Subject and related sessions have been removed."
    });
  };

  const handleToggleSessionCompleted = (sessionId: string) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId ? { ...session, completed: !session.completed } : session
    );
    setSessions(updatedSessions);
    localStorage.setItem('studysavvy_sessions', JSON.stringify(updatedSessions));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="h-12 w-12 text-purple-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                StudySavvy
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your study routine with AI-powered planning and personalized learning paths. 
              Master your subjects, track your progress, and achieve your academic goals.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleLogin}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full w-fit">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Smart Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  AI-powered study plans tailored to your learning style and schedule
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full w-fit">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Monitor your learning progress with detailed analytics and insights
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full w-fit">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Flexible Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Adaptive scheduling that fits your lifestyle and commitments
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                StudySavvy
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="text-gray-600 hover:text-purple-600"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-400 to-indigo-400 text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Let's continue your learning journey
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="subjects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              Subjects
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Total Subjects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {subjects.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    Study Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {user?.studyGoals || 'Complete your profile to set goals'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Study Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {user?.preferredStudyTime || 'Not set'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Your Subjects</h3>
              <Button
                onClick={() => setShowSubjectForm(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </div>
            <SubjectsList subjects={subjects} onRemoveSubject={handleRemoveSubject} />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Study Calendar</h3>
            <StudyCalendar 
              subjects={subjects} 
              sessions={sessions}
              startDate={new Date()}
              endDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
              onToggleSessionCompleted={handleToggleSessionCompleted}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Progress Overview</h3>
            <ProgressSummary subjects={subjects} sessions={sessions} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <ProfileSetup
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        user={user}
        onProfileComplete={handleProfileComplete}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        onUserUpdate={setUser}
      />

      {showSubjectForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Subject</h3>
            <SubjectForm onSubjectAdd={handleSubjectAdded} />
            <Button
              variant="outline"
              onClick={() => setShowSubjectForm(false)}
              className="mt-4 w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
