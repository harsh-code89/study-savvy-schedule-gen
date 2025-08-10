
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import DashboardTabs from '@/components/DashboardTabs';
import ProfileSetup from '@/components/profile/ProfileSetup';
import SettingsModal from '@/components/settings/SettingsModal';
import ParticleBackground from '@/components/ParticleBackground';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import SubjectFormModal from '@/components/dashboard/SubjectFormModal';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TodaysFocus, FocusItem } from '@/components/dashboard/TodaysFocus';
import { OnboardingTooltip } from '@/components/onboarding/OnboardingTooltip';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Plus, HelpCircle } from 'lucide-react';
import { StudySession } from '@/types/studyPlanner';

interface DashboardProps {
  user: any;
  subjects: any[];
  sessions: StudySession[];
  activeTab: string;
  showProfileSetup: boolean;
  showSettings: boolean;
  showSubjectForm: boolean;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onShowSettings: () => void;
  onCloseProfileSetup: () => void;
  onProfileComplete: (profileData: any) => void;
  onCloseSettings: () => void;
  onUserUpdate: (user: any) => void;
  onShowSubjectForm: () => void;
  onCloseSubjectForm: () => void;
  onSubjectAdded: (subject: any) => void;
  onRemoveSubject: (id: string) => void;
  onToggleSessionCompleted: (sessionId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  subjects,
  sessions,
  activeTab,
  showProfileSetup,
  showSettings,
  showSubjectForm,
  onTabChange,
  onLogout,
  onShowSettings,
  onCloseProfileSetup,
  onProfileComplete,
  onCloseSettings,
  onUserUpdate,
  onShowSubjectForm,
  onCloseSubjectForm,
  onSubjectAdded,
  onRemoveSubject,
  onToggleSessionCompleted
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [focusItems, setFocusItems] = useState<FocusItem[]>([
    { id: '1', title: 'Complete Math homework', type: 'task', priority: 'high', dueTime: '3:00 PM' },
    { id: '2', title: 'Study for Biology test', type: 'study', priority: 'medium' },
    { id: '3', title: 'Submit English essay', type: 'deadline', priority: 'high', dueTime: '11:59 PM' },
  ]);

  // Check if user is new (for onboarding)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && subjects.length === 0) {
      setShowOnboarding(true);
    }
  }, [subjects.length]);

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to StudySavvy!',
      description: 'Let\'s take a quick tour of your new study companion.',
      position: 'bottom' as const
    },
    {
      id: 'sidebar',
      title: 'Navigation Sidebar',
      description: 'Access all your tools here - Tasks, Notes, Journal, Mind Maps, and more!',
      targetSelector: '[data-sidebar="trigger"]',
      position: 'right' as const
    },
    {
      id: 'add-subject',
      title: 'Add Your First Subject',
      description: 'Start by adding subjects you\'re studying to create personalized study plans.',
      targetSelector: '[data-onboarding="add-subject"]',
      position: 'top' as const
    },
    {
      id: 'stats',
      title: 'Track Your Progress',
      description: 'Monitor your study habits and achievements with these helpful statistics.',
      targetSelector: '[data-onboarding="stats"]',
      position: 'bottom' as const
    }
  ];

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleAddFocus = () => {
    const newItem = {
      id: Date.now().toString(),
      title: 'New focus item',
      type: 'task' as const,
      priority: 'medium' as const
    };
    setFocusItems([...focusItems, newItem]);
  };

  const handleToggleFocusComplete = (id: string) => {
    setFocusItems(items => 
      items.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Calculate stats
  const completedSessions = sessions.filter(s => s.completed).length;
  const completedTasks = focusItems.filter(item => item.completed).length;
  const studyStreak = 7; // This would come from your data
  const weeklyStudyHours = sessions.reduce((acc, session) => acc + (session.duration || 0), 0) / 60;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-subtle/20 to-accent/30">
        <ParticleBackground />
        
        {/* Enhanced Header with Actions */}
        <div className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-30">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <WelcomeSection user={user} />
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOnboarding(true)}
                  className="interactive-hover"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </Button>
                <ThemeToggle />
                <Button 
                  onClick={onShowSubjectForm}
                  className="btn-3d"
                  data-onboarding="add-subject"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Stats Section */}
          <div data-onboarding="stats">
            <DashboardStats
              completedTasks={completedTasks}
              totalTasks={focusItems.length}
              studyStreak={studyStreak}
              weeklyStudyHours={weeklyStudyHours}
              activeSubjects={subjects.length}
              upcomingDeadlines={2}
            />
          </div>

          {/* Focus and Tabs Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Today's Focus - Left Column */}
            <div className="lg:col-span-1">
              <TodaysFocus
                focusItems={focusItems}
                onAddFocus={handleAddFocus}
                onToggleComplete={handleToggleFocusComplete}
              />
            </div>

            {/* Main Dashboard Tabs - Right Columns */}
            <div className="lg:col-span-3">
              <DashboardTabs
                user={user}
                subjects={subjects}
                sessions={sessions}
                activeTab={activeTab}
                onTabChange={onTabChange}
                onShowSubjectForm={onShowSubjectForm}
                onRemoveSubject={onRemoveSubject}
                onToggleSessionCompleted={onToggleSessionCompleted}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <ProfileSetup
          isOpen={showProfileSetup}
          onClose={onCloseProfileSetup}
          user={user}
          onProfileComplete={onProfileComplete}
        />

        <SettingsModal
          isOpen={showSettings}
          onClose={onCloseSettings}
          user={user}
          onUserUpdate={onUserUpdate}
        />

        <SubjectFormModal
          isOpen={showSubjectForm}
          onClose={onCloseSubjectForm}
          onSubjectAdded={onSubjectAdded}
        />

        {/* Onboarding */}
        <OnboardingTooltip
          steps={onboardingSteps}
          isVisible={showOnboarding}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingComplete}
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
